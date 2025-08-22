import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import BN from 'bn.js';

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com');
const client = new DynamicBondingCurveClient(connection, 'confirmed');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      creator, 
      payer, 
      pool, 
      maxBaseAmount, 
      maxQuoteAmount, 
      receiver, 
      tempWSolAcc 
    } = body;

    // Validate required parameters
    if (!creator || !payer || !pool || maxBaseAmount === undefined || maxQuoteAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: creator, payer, pool, maxBaseAmount, maxQuoteAmount' },
        { status: 400 }
      );
    }

    // Convert string addresses to PublicKey objects
    let creatorPubkey, payerPubkey, poolPubkey, receiverPubkey, tempWSolAccPubkey;
    
    try {
      creatorPubkey = new PublicKey(creator);
      payerPubkey = new PublicKey(payer);
      poolPubkey = new PublicKey(pool);
      receiverPubkey = receiver ? new PublicKey(receiver) : null;
      tempWSolAccPubkey = tempWSolAcc ? new PublicKey(tempWSolAcc) : null;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid public key format provided' },
        { status: 400 }
      );
    }

    // Convert amounts to BN
    const maxBaseAmountBN = new BN(maxBaseAmount.toString());
    const maxQuoteAmountBN = new BN(maxQuoteAmount.toString());

    console.log('Attempting to claim creator trading fee with params:', {
      creator: creator,
      payer: payer,
      pool: pool,
      maxBaseAmount: maxBaseAmount,
      maxQuoteAmount: maxQuoteAmount,
      receiver: receiver,
      tempWSolAcc: tempWSolAcc
    });

    // First, let's try to fetch the pool info to validate it exists
    try {
      const poolInfo = await connection.getAccountInfo(poolPubkey);
      if (!poolInfo) {
        return NextResponse.json(
          { error: 'Pool account does not exist' },
          { status: 400 }
        );
      }
      console.log('Pool account found, owner:', poolInfo.owner.toString());
    } catch (error) {
      console.error('Error fetching pool info:', error);
      return NextResponse.json(
        { error: 'Failed to validate pool account' },
        { status: 400 }
      );
    }

    // Create the claim creator trading fee transaction
    const transaction = await client.creator.claimCreatorTradingFee({
      creator: creatorPubkey,
      payer: payerPubkey,
      pool: poolPubkey,
      maxBaseAmount: maxBaseAmountBN,
      maxQuoteAmount: maxQuoteAmountBN,
      receiver: receiverPubkey,
      tempWSolAcc: tempWSolAccPubkey
    });

    // Add recent blockhash to the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payerPubkey;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    return NextResponse.json({
      success: true,
      transaction: Buffer.from(serializedTransaction).toString('base64'),
      message: 'Creator trading fee claim transaction created successfully'
    });

  } catch (error) {
    console.error('Error claiming creator trading fee:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create creator trading fee claim transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
