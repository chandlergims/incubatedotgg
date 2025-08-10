import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configAddress = searchParams.get('configAddress');
    const poolAddress = searchParams.get('poolAddress');
    const creatorAddress = searchParams.get('creatorAddress');

    if (!configAddress && !poolAddress && !creatorAddress) {
      return NextResponse.json(
        { error: 'Either configAddress, poolAddress, or creatorAddress is required' },
        { status: 400 }
      );
    }

    // Initialize connection and client
    const connection = new Connection(process.env.RPC_URL!, 'confirmed');
    const client = new DynamicBondingCurveClient(connection, 'confirmed');

    if (creatorAddress) {
      // Get all fees for pools linked to a specific creator
      console.log(`🔍 Fetching fees for creator: ${creatorAddress}`);
      
      const creatorPublicKey = new PublicKey(creatorAddress);
      const fees = await client.state.getPoolsFeesByCreator(creatorPublicKey);

      const formattedFees = fees.map(fee => ({
        poolAddress: fee.poolAddress.toString(),
        partnerBaseFee: fee.partnerBaseFee.toString(),
        partnerQuoteFee: fee.partnerQuoteFee.toString(),
        creatorBaseFee: fee.creatorBaseFee.toString(),
        creatorQuoteFee: fee.creatorQuoteFee.toString(),
        totalTradingBaseFee: fee.totalTradingBaseFee.toString(),
        totalTradingQuoteFee: fee.totalTradingQuoteFee.toString()
      }));

      return NextResponse.json({
        success: true,
        data: formattedFees
      });
    }

    if (poolAddress) {
      // Get fee metrics for a specific pool
      console.log(`🔍 Fetching fee metrics for pool: ${poolAddress}`);
      
      const poolPublicKey = new PublicKey(poolAddress);
      const metrics = await client.state.getPoolFeeMetrics(poolPublicKey);

      return NextResponse.json({
        success: true,
        data: {
          poolAddress,
          current: {
            partnerBaseFee: metrics.current.partnerBaseFee.toString(),
            partnerQuoteFee: metrics.current.partnerQuoteFee.toString(),
            creatorBaseFee: metrics.current.creatorBaseFee.toString(),
            creatorQuoteFee: metrics.current.creatorQuoteFee.toString()
          },
          total: {
            totalTradingBaseFee: metrics.total.totalTradingBaseFee.toString(),
            totalTradingQuoteFee: metrics.total.totalTradingQuoteFee.toString()
          }
        }
      });
    }

    if (configAddress) {
      // Get all fees for pools linked to a specific config
      console.log(`🔍 Fetching fees for config: ${configAddress}`);
      
      const configPublicKey = new PublicKey(configAddress);
      const fees = await client.state.getPoolsFeesByConfig(configPublicKey);

      const formattedFees = fees.map(fee => ({
        poolAddress: fee.poolAddress.toString(),
        partnerBaseFee: fee.partnerBaseFee.toString(),
        partnerQuoteFee: fee.partnerQuoteFee.toString(),
        creatorBaseFee: fee.creatorBaseFee.toString(),
        creatorQuoteFee: fee.creatorQuoteFee.toString(),
        totalTradingBaseFee: fee.totalTradingBaseFee.toString(),
        totalTradingQuoteFee: fee.totalTradingQuoteFee.toString()
      }));

      return NextResponse.json({
        success: true,
        data: formattedFees
      });
    }

  } catch (error) {
    console.error('Error fetching fee metrics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch fee metrics', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
