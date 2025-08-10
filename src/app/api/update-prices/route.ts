import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

interface JupiterTokenData {
  id: string;
  name: string;
  symbol: string;
  usdPrice: number;
  mcap: number;
  bondingCurve: number;
  stats24h: {
    priceChange: number;
    volume: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting price update from Jupiter API...');
    
    // Get all tokens from our database
    const tokensSnapshot = await getDocs(collection(db, 'tokens'));
    const tokens = tokensSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        baseMint: data.baseMint,
        symbol: data.symbol,
        name: data.name,
        configAddress: data.configAddress,
        ...data
      };
    });

    if (tokens.length === 0) {
      return NextResponse.json({ message: 'No tokens found to update' });
    }

    console.log(`📊 Found ${tokens.length} tokens to update`);

    let updatedCount = 0;
    const updatePromises = [];

    // Process tokens in batches of 100
    const batchSize = 100;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const mintAddresses = batch.map(token => token.baseMint);
      
      try {
        // Create query string with multiple mint addresses
        const queryString = mintAddresses.join(',');
        console.log(`🔍 Fetching batch ${Math.floor(i/batchSize) + 1}: ${batch.length} tokens`);
        
        const jupiterResponse = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (jupiterResponse.ok) {
          const jupiterTokens: JupiterTokenData[] = await jupiterResponse.json();
          console.log(`🪐 Jupiter API returned ${jupiterTokens.length} tokens for this batch`);
          
          // Create a map for quick lookup
          const jupiterTokenMap = new Map();
          jupiterTokens.forEach(jToken => {
            jupiterTokenMap.set(jToken.id, jToken);
          });

          // Update each token in the batch
          for (const token of batch) {
            const jupiterData = jupiterTokenMap.get(token.baseMint);
            
            if (jupiterData) {
              const updateData = {
                usdPrice: jupiterData.usdPrice || 0,
                marketCap: jupiterData.mcap || 0,
                bondingCurve: jupiterData.bondingCurve || 0,
                priceChange24h: jupiterData.stats24h?.priceChange || 0,
                volume24h: jupiterData.stats24h?.buyVolume || 0,
                lastPriceUpdate: serverTimestamp(),
              };

              const updatePromise = updateDoc(doc(db, 'tokens', token.id), updateData);
              updatePromises.push(updatePromise);
              updatedCount++;

              console.log(`✅ Queued update for ${token.symbol} (${token.baseMint})`);
              console.log(`   Price: $${jupiterData.usdPrice}, MC: $${jupiterData.mcap}, Bonding: ${jupiterData.bondingCurve}%`);
            } else {
              console.log(`⚠️ No Jupiter data found for ${token.symbol} (${token.baseMint})`);
            }
          }
        } else {
          console.log(`❌ Jupiter API error for batch: ${jupiterResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error fetching batch data:`, error);
      }
      
      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < tokens.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Execute all price updates
    await Promise.all(updatePromises);

    console.log(`🎉 Successfully updated ${updatedCount} token prices`);

    // Now update fee data for tokens with configAddress
    console.log('💰 Starting fee data update...');
    
    const connection = new Connection(process.env.RPC_URL!, 'confirmed');
    const client = new DynamicBondingCurveClient(connection, 'confirmed');
    
    let feeUpdatedCount = 0;
    const feeUpdatePromises = [];

    // Process tokens with configAddress for fee updates
    const tokensWithConfig = tokens.filter(token => token.configAddress);
    console.log(`📊 Found ${tokensWithConfig.length} tokens with config addresses for fee updates`);

    // Process fee updates in smaller batches to avoid rate limiting
    const feeBatchSize = 5; // Smaller batches for fee updates
    for (let i = 0; i < tokensWithConfig.length; i += feeBatchSize) {
      const batch = tokensWithConfig.slice(i, i + feeBatchSize);
      
      for (const token of batch) {
        try {
          console.log(`💰 Fetching fees for ${token.symbol} (${token.configAddress})`);
          
          const configPublicKey = new PublicKey(token.configAddress);
          const fees = await client.state.getPoolsFeesByConfig(configPublicKey);

          if (fees.length > 0) {
            // Use the first pool's fee data
            const feeData = fees[0];
            
            // Convert lamports to SOL (1 SOL = 1e9 lamports)
            const LAMPORTS_PER_SOL = 1e9;
            
            const feeUpdateData = {
              creatorFees: parseFloat(feeData.creatorQuoteFee.toString()) / LAMPORTS_PER_SOL,
              partnerFees: parseFloat(feeData.partnerQuoteFee.toString()) / LAMPORTS_PER_SOL,
              totalTradingFees: parseFloat(feeData.totalTradingQuoteFee.toString()) / LAMPORTS_PER_SOL,
              lastFeeUpdate: serverTimestamp(),
            };

            const feeUpdatePromise = updateDoc(doc(db, 'tokens', token.id), feeUpdateData);
            feeUpdatePromises.push(feeUpdatePromise);
            feeUpdatedCount++;

            console.log(`✅ Queued fee update for ${token.symbol}`);
            console.log(`   Creator: ${feeUpdateData.creatorFees}, Partner: ${feeUpdateData.partnerFees}, Total: ${feeUpdateData.totalTradingFees}`);
          } else {
            console.log(`⚠️ No fee data found for ${token.symbol}`);
          }
        } catch (error) {
          console.log(`❌ Error fetching fees for ${token.symbol}:`, error);
        }
      }
      
      // Add delay between fee batches to avoid rate limiting
      if (i + feeBatchSize < tokensWithConfig.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    // Execute all fee updates
    await Promise.all(feeUpdatePromises);

    console.log(`🎉 Successfully updated fees for ${feeUpdatedCount} tokens`);

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} prices and ${feeUpdatedCount} fee records out of ${tokens.length} tokens`,
      updatedCount,
      feeUpdatedCount,
      totalTokens: tokens.length,
    });

  } catch (error) {
    console.error('❌ Error updating token prices:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update token prices', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Allow GET requests to manually trigger price updates
export async function GET(request: NextRequest) {
  return POST(request);
}
