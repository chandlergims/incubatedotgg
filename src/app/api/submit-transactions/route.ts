import { NextRequest, NextResponse } from 'next/server';
import { Connection, Transaction } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    const { createConfigTx, createPoolTx, swapBuyTx, baseMint, config } = await request.json();

    if (!createConfigTx || !createPoolTx) {
      return NextResponse.json(
        { error: 'Missing required transactions' },
        { status: 400 }
      );
    }

    // Initialize connection
    const connection = new Connection(process.env.RPC_URL!, 'confirmed');

    // Deserialize signed transactions
    const configTransaction = Transaction.from(Buffer.from(createConfigTx, 'base64'));
    const poolTransaction = Transaction.from(Buffer.from(createPoolTx, 'base64'));
    const buyTransaction = swapBuyTx ? Transaction.from(Buffer.from(swapBuyTx, 'base64')) : null;

    
    // Get blockhash info for the original blockhash used in transactions
    const blockhashInfo = await connection.getLatestBlockhash();
    // Note: We use the current lastValidBlockHeight since we can't get the exact one 
    // from when the transaction was created, but the original blockhash is what matters
    
    const results = [];

    // Submit transactions sequentially
    console.log('Submitting createConfig transaction...');
    const configTxId = await connection.sendRawTransaction(configTransaction.serialize());
    console.log('Config transaction submitted:', configTxId);
    results.push({ type: 'createConfig', txId: configTxId });

    // Wait for config transaction to confirm before proceeding
    await connection.confirmTransaction({
      signature: configTxId,
      blockhash: configTransaction.recentBlockhash!,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight
    });
    console.log('Config transaction confirmed');

    console.log('Submitting createPool transaction...');
    const poolTxId = await connection.sendRawTransaction(poolTransaction.serialize());
    console.log('Pool transaction submitted:', poolTxId);
    results.push({ type: 'createPool', txId: poolTxId });

    // Wait for pool transaction to confirm before proceeding
    await connection.confirmTransaction({
      signature: poolTxId,
      blockhash: poolTransaction.recentBlockhash!,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight
    });
    console.log('Pool transaction confirmed');

    // Submit buy transaction if provided
    if (buyTransaction) {
      console.log('Submitting swap buy transaction...');
      const buyTxId = await connection.sendRawTransaction(buyTransaction.serialize());
      console.log('Buy transaction submitted:', buyTxId);
      results.push({ type: 'swapBuy', txId: buyTxId });
      
      await connection.confirmTransaction({
        signature: buyTxId,
        blockhash: buyTransaction.recentBlockhash!,
        lastValidBlockHeight: blockhashInfo.lastValidBlockHeight
      });
      console.log('Buy transaction confirmed');
    }

    return NextResponse.json({
      success: true,
      message: 'All transactions submitted successfully',
      transactions: results,
      baseMint,
      config,
    });

  } catch (error) {
    console.error('Error submitting transactions:', error);
    return NextResponse.json(
      { error: 'Failed to submit transactions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
