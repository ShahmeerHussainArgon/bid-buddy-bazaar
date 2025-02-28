
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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

    // Get bid details if provided
    let bidAmount = 0;
    if (bid_id) {
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .select('amount')
        .eq('id', bid_id)
        .single();

      if (!bidError && bid) {
        bidAmount = bid.amount;
      }
    }

    // Create notification in the database
    await supabase.rpc('create_notification', {
      p_user_id: user_id,
      p_type: 'winner',
      p_message: `Congratulations! You won the auction for "${auction.title}" with a bid of $${bidAmount}. Please complete your payment within 24 hours.`
    });

    console.log(`Email would be sent to ${user.email} about winning auction "${auction.title}"`);
    
    // For now, we'll just log the email content
    // In a production app, you would integrate with an email service like Resend, SendGrid, etc.
    const emailContent = {
      to: user.email,
      subject: `Congratulations! You won the auction for "${auction.title}"`,
      body: `
        <h1>Congratulations ${user.username || 'valued customer'}!</h1>
        <p>You've won the auction for "${auction.title}" with a bid of $${bidAmount}.</p>
        <p>Please complete your payment within the next 24 hours to secure your win.</p>
        <p>Thank you for participating in our auction platform!</p>
      `
    };

    console.log("Email content prepared:", emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Winner notification processed",
        emailContent
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
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
