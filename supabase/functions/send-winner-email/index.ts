
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  auction_id?: string;
  user_id?: string;
  bid_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    // Use the provided API key
    const resendApiKey = 're_WnaYqBi4_GuzHh94ebN1QTLSX4mso7Qf9';
    
    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const requestData: EmailRequest = await req.json();
    const { auction_id, user_id, bid_id } = requestData;

    console.log(`Processing email for auction: ${auction_id}, user: ${user_id}, bid: ${bid_id}`);

    if (!auction_id || !user_id) {
      throw new Error("Missing required parameters");
    }

    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auction_id)
      .single();

    if (auctionError) {
      throw new Error(`Error fetching auction: ${auctionError.message}`);
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email, username')
      .eq('id', user_id)
      .single();

    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!user.email) {
      throw new Error(`User ${user_id} does not have an email address`);
    }

    // Get bid details if provided
    let bidAmount = 0;
    let directPaymentLink = '';
    if (bid_id) {
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .select('amount')
        .eq('id', bid_id)
        .single();

      if (!bidError && bid) {
        bidAmount = bid.amount;
        
        // Generate a direct payment link
        directPaymentLink = `${supabaseUrl.replace('.supabase.co', '').replace('https://', 'http://localhost:3000/')}/payment/${bid_id}`;
      }
    }

    // Create notification in the database
    await supabase.rpc('create_notification', {
      p_user_id: user_id,
      p_type: 'auction_win',
      p_message: `Congratulations! You won the auction for "${auction.title}" with a bid of $${bidAmount}. Please complete your payment within 24 hours.`
    });

    console.log(`Sending email to ${user.email} about winning auction "${auction.title}"`);
    
    // Prepare the email content
    const emailSubject = `Congratulations! You won the auction for "${auction.title}"`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Congratulations ${user.username || 'valued customer'}!</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">You've won the auction for <strong>${auction.title}</strong> with a bid of <strong>$${bidAmount}</strong>.</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">Please complete your payment within the next 24 hours to secure your win.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${directPaymentLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Complete Payment Now
          </a>
        </div>
        <p style="font-size: 14px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          Thank you for participating in our auction platform!
        </p>
      </div>
    `;

    try {
      // Send the email using Resend with the correct from address
      const { data: emailResponse, error: emailError } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [user.email],
        subject: emailSubject,
        html: emailHtml
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error(`Failed to send email: ${emailError}`);
      }

      console.log("Email sent successfully:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Winner notification email sent",
          emailId: emailResponse?.id
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (sendError) {
      console.error("Error sending email with Resend:", sendError);
      throw sendError;
    }
  } catch (error) {
    console.error("Error processing winner email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
