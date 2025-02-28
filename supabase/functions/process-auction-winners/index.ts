
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Processing auction winners...");

    // Find recently ended auctions where winners need to be determined
    const { data: endedAuctions, error: auctionError } = await supabase
      .from('auctions')
      .select('id, title, max_spots')
      .lt('ends_at', new Date().toISOString())
      .eq('winners_processed', true)
      .order('ends_at', { ascending: false })
      .limit(5); // Process a few at a time

    if (auctionError) {
      throw new Error(`Error fetching ended auctions: ${auctionError.message}`);
    }

    console.log(`Found ${endedAuctions?.length || 0} recently ended auctions`);

    const results = [];

    // Process each auction
    for (const auction of endedAuctions || []) {
      console.log(`Processing auction ${auction.id}: ${auction.title}`);

      // Get the winners for this auction
      const { data: winners, error: winnersError } = await supabase
        .from('auction_winners')
        .select('id, user_id, winning_bid_id, status')
        .eq('auction_id', auction.id)
        .eq('status', 'pending_payment');

      if (winnersError) {
        console.error(`Error fetching winners for auction ${auction.id}:`, winnersError);
        continue;
      }

      console.log(`Found ${winners?.length || 0} winners for auction ${auction.id}`);

      // Send emails to each winner
      for (const winner of winners || []) {
        console.log(`Sending email to winner ${winner.user_id} for auction ${auction.id}`);
        
        try {
          // Call our send-winner-email function
          const { data: emailResult, error: emailError } = await supabase.functions.invoke(
            'send-winner-email',
            {
              body: {
                auction_id: auction.id,
                user_id: winner.user_id,
                bid_id: winner.winning_bid_id
              }
            }
          );

          if (emailError) {
            console.error(`Error sending email to winner ${winner.user_id}:`, emailError);
            results.push({
              auction_id: auction.id,
              user_id: winner.user_id,
              success: false,
              error: emailError.message
            });
          } else {
            console.log(`Successfully sent email to winner ${winner.user_id}:`, emailResult);
            results.push({
              auction_id: auction.id,
              user_id: winner.user_id,
              success: true
            });
          }
        } catch (error) {
          console.error(`Exception sending email to winner ${winner.user_id}:`, error);
          results.push({
            auction_id: auction.id,
            user_id: winner.user_id,
            success: false,
            error: error.message
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${endedAuctions?.length || 0} auctions with ${results.length} winner notifications`,
        results
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in process-auction-winners function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
