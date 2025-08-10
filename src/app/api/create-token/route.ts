import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { createCurveConfig } from '@/helpers/buildCurve';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const symbol = formData.get('symbol') as string;
    const description = formData.get('description') as string;
    const poolCreator = formData.get('poolCreator') as string;
    const imageFile = formData.get('image') as File;
    const website = formData.get('website') as string;
    const telegram = formData.get('telegram') as string;
    const twitter = formData.get('twitter') as string;
    const creatorFeePercentage = parseInt(formData.get('creatorFeePercentage') as string) || 0;
    const initialBuyAmountStr = formData.get('initialBuyAmount') as string;
    const initialBuyAmount = initialBuyAmountStr && initialBuyAmountStr.trim() !== '' ? parseFloat(initialBuyAmountStr) : 0;

    if (!name || !symbol || !poolCreator || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields: name, symbol, poolCreator, image' },
        { status: 400 }
      );
    }

    // Step 1: Upload image and create metadata
    console.log('📤 Uploading image to Firebase...');
    
    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `tokens/${symbol.toLowerCase()}-${timestamp}.${fileExtension}`;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    console.log('✅ Image uploaded to Firebase Storage:', imageUrl);

    // Create Solana token metadata JSON
    const metadata = {
      name: name,
      symbol: symbol,
      description: description,
      image: imageUrl,
      ...(website && { website }),
      ...(telegram && { telegram }),
      ...(twitter && { twitter })
    };

    // Upload metadata JSON to Firebase Storage
    const metadataFileName = `metadata/${symbol.toLowerCase()}-${timestamp}.json`;
    const metadataRef = ref(storage, metadataFileName);
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataSnapshot = await uploadBytes(metadataRef, metadataBlob);
    const metadataUrl = await getDownloadURL(metadataSnapshot.ref);

    console.log('✅ Metadata uploaded to Firebase Storage:', metadataUrl);

    // Step 2: Create Solana token with metadata URL
    console.log('🪙 Creating Solana token...');

    // Initialize connection and client
    const connection = new Connection(process.env.RPC_URL!, 'confirmed');
    const client = new DynamicBondingCurveClient(connection, 'confirmed');

    // Get the curve config with creator fees setting
    const config = await createCurveConfig(creatorFeePercentage);

    // Generate keypairs for the transaction
    const baseMint = Keypair.generate();
    const configKeypair = Keypair.generate();

    const transaction = await client.pool.createConfigAndPoolWithFirstBuy({
      ...config,
      payer: new PublicKey(poolCreator),
      config: configKeypair.publicKey,
      feeClaimer: new PublicKey(process.env.FEE_CLAIMER_WALLET!),
      leftoverReceiver: new PublicKey(process.env.FEE_CLAIMER_WALLET!),
      quoteMint: new PublicKey('So11111111111111111111111111111111111111112'), // SOL
      preCreatePoolParam: {
        baseMint: baseMint.publicKey,
        name: name,
        symbol: symbol,
        uri: metadataUrl,
        poolCreator: new PublicKey(poolCreator),
      },
      ...(initialBuyAmount > 0 && {
        firstBuyParam: {
          buyer: new PublicKey(poolCreator),
          buyAmount: new BN(initialBuyAmount * 1e9), // Custom SOL amount
          minimumAmountOut: new BN(1),
          referralTokenAccount: null,
        },
      }),
    });

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Set recent blockhash and fee payer for all transactions
    const payerPublicKey = new PublicKey(poolCreator);
    
    transaction.createConfigTx.recentBlockhash = blockhash;
    transaction.createConfigTx.feePayer = payerPublicKey;
    
    transaction.createPoolTx.recentBlockhash = blockhash;
    transaction.createPoolTx.feePayer = payerPublicKey;
    
    if (transaction.swapBuyTx) {
      transaction.swapBuyTx.recentBlockhash = blockhash;
      transaction.swapBuyTx.feePayer = payerPublicKey;
    }

    // Sign transactions with backend keypairs
    // createConfigTx requires: payer (user) + config (backend)
    transaction.createConfigTx.partialSign(configKeypair);
    
    // createPoolTx requires: payer (user) + poolCreator (user) + baseMint (backend)
    transaction.createPoolTx.partialSign(baseMint);
    
    // swapBuyTx requires: buyer (user) + payer (user) - no backend signing needed

    return NextResponse.json({
      success: true,
      transactions: {
        createConfigTx: transaction.createConfigTx.serialize({ requireAllSignatures: false }).toString('base64'),
        createPoolTx: transaction.createPoolTx.serialize({ requireAllSignatures: false }).toString('base64'),
        swapBuyTx: transaction.swapBuyTx ? transaction.swapBuyTx.serialize({ requireAllSignatures: false }).toString('base64') : undefined,
      },
      baseMint: baseMint.publicKey.toString(),
      config: configKeypair.publicKey.toString(),
      imageUrl,
      metadataUrl,
      metadata,
      message: 'Image uploaded, metadata created, and transactions prepared.',
    });

  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Failed to create token', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
