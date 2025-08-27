import { buildCurve } from '@meteora-ag/dynamic-bonding-curve-sdk';

export const createCurveConfig = (creatorFeePercentage: number = 0) => {
  // Ensure percentage is within valid range (0-90)
  const validPercentage = Math.max(0, Math.min(90, creatorFeePercentage));
  const platformPercentage = 100 - validPercentage;

  return buildCurve({
    totalTokenSupply: 1000000000,
    percentageSupplyOnMigration: 20,
    migrationQuoteThreshold: 80,
    migrationOption: 1, 
    tokenBaseDecimal: 9, 
    tokenQuoteDecimal: 9, 
    lockedVestingParam: {
      totalLockedVestingAmount: 0,
      numberOfVestingPeriod: 0,
      cliffUnlockAmount: 0,
      totalVestingDuration: 0,
      cliffDurationFromMigrationTime: 0,
    },
    baseFeeParams: {
      baseFeeMode: 0, 
      feeSchedulerParam: {
        startingFeeBps: 200,
        endingFeeBps: 200,
        numberOfPeriod: 0,
        totalDuration: 0,
      },
    },
    dynamicFeeEnabled: false,
    activationType: 0, 
    collectFeeMode: 0, 
    migrationFeeOption: 4, 
    tokenType: 0, 
    partnerLpPercentage: 0,
    creatorLpPercentage: 0,
    partnerLockedLpPercentage: platformPercentage, // Platform gets remaining percentage
    creatorLockedLpPercentage: validPercentage,    // Creator gets their selected percentage
    creatorTradingFeePercentage: 0,
    leftover: 0,
    tokenUpdateAuthority: 1,
    migrationFee: {
      feePercentage: 0,
      creatorFeePercentage: 0,
    },
    migratedPoolFee: {
      collectFeeMode: 0, 
      dynamicFee: 0, 
      poolFeeBps: 0,
    },
  });
};

// Default export for backward compatibility
export const curveConfig = createCurveConfig(0);
