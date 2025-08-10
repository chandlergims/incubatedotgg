import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { 
      name,
      symbol,
      description,
      creator,
      imageUrl,
      metadataUrl,
      metadata,
      baseMint,
      configAddress,
      transactions,
      website,
      telegram,
      twitter,
      creatorFeePercentage
    } = await request.json();

    if (!name || !symbol || !creator || !baseMint) {
      return NextResponse.json(
        { error: 'Missing required fields: name, symbol, creator, baseMint' },
        { status: 400 }
      );
    }

    console.log('💾 Saving token data to database...');
    
    const dbTokenData = {
      // Token Metadata
      baseMint: baseMint,
      name,
      symbol,
      description: description || null,
      imageUrl: imageUrl || null,
      metadataUrl: metadataUrl || null,
      metadata: metadata || null,
      creator: creator,
      
      // Pool Info
      configAddress: configAddress || null,
      
      // Launch Info
      createdAt: serverTimestamp(),
      status: 'created',
      
      // Price Data (updated by Jupiter API)
      usdPrice: 0,
      marketCap: 0,
      bondingCurve: 0,
      priceChange24h: 0,
      volume24h: 0,
      lastPriceUpdate: null,
      
      // Fee Data (updated by cron job)
      creatorFees: 0,
      partnerFees: 0,
      totalTradingFees: 0,
      lastFeeUpdate: null,
      creatorFeePercentage: creatorFeePercentage || 0,
      
      // Social Links
      website: website || null,
      telegram: telegram || null,
      twitter: twitter || null,
      
      // Transaction History
      transactions: transactions || []
    };

    const docRef = await addDoc(collection(db, 'tokens'), dbTokenData);
    console.log('✅ Token data saved to Firestore with ID:', docRef.id);

    return NextResponse.json({
      success: true,
      tokenId: docRef.id,
      message: 'Token data saved to database successfully',
    });

  } catch (error) {
    console.error('Error saving token data to database:', error);
    return NextResponse.json(
      { error: 'Failed to save token data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
