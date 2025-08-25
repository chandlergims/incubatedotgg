'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '@/utils/formatTime';
import { Copy } from 'phosphor-react';

interface TokenCardProps {
  token: {
    id?: string;
    name: string;
    symbol: string;
    description?: string;
    creator: string;
    imageUrl: string;
    baseMint: string;
    createdAt: any;
    website?: string;
    telegram?: string;
    twitter?: string;
    configAddress?: string;
    usdPrice?: number;
    marketCap?: number;
    bondingCurve?: number;
    priceChange24h?: number;
    lastPriceUpdate?: any;
    // Fee data fields (will be populated by cron job)
    creatorFees?: number;
    partnerFees?: number;
    totalTradingFees?: number;
    lastFeeUpdate?: any;
  };
}

export default function TokenCard({ token }: TokenCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    router.push(`/coin/${token.baseMint}`);
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.baseMint);
  };

  const handleCopyMint = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.baseMint);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatFeeAmount = (fee: number) => {
    if (fee === 0) return '0.00 SOL';
    if (fee >= 1000) return `${(fee / 1000).toFixed(2)}K SOL`;
    return `${fee.toFixed(2)} SOL`;
  };

  const bondingProgress = token.bondingCurve || 0;
  const circumference = 2 * Math.PI * 45; // radius of 45px
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (bondingProgress / 100) * circumference;

  return (
    <div 
      onClick={handleCardClick}
      className="relative bg-[#0a0a0a] rounded-xl hover:bg-black transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Token Image */}
      <div className="w-full aspect-[4/3] bg-gray-800 flex items-center justify-center overflow-hidden relative rounded-t-xl">
        {!imageError && token.imageUrl ? (
          <img
            src={token.imageUrl}
            alt={token.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-gray-400 font-bold text-2xl">
            {token.symbol.charAt(0)}
          </span>
        )}
        
        {/* Token Name overlay at top */}
        <div className="absolute top-0 left-0 right-0 p-3">
          <div className="font-bold text-white text-sm bg-black/50 rounded px-2 py-1 inline-block">
            {token.symbol}
          </div>
        </div>
        
        {/* Mint address overlay - top right */}
        <div className="absolute top-0 right-0 p-3">
          <div 
            className="flex items-center gap-1 bg-black/50 rounded px-2 py-1 cursor-pointer hover:bg-black/70 transition-colors"
            onClick={handleCopyMint}
          >
            <span className="text-gray-300 text-xs">{truncateAddress(token.baseMint)}</span>
          </div>
        </div>
      </div>

      {/* Bottom info section - more compact */}
      <div className="p-2 space-y-1">
        {/* SOL Raised */}
        <div className="text-white font-bold text-sm">
          {formatFeeAmount(token.totalTradingFees || 0)}
        </div>
        <div className="text-gray-400 text-xs">
          Creator Fees
        </div>
        
        {/* Bonding Curve Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Bonding</span>
            <span>{bondingProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-1">
            <div 
              className="bg-green-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(bondingProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
