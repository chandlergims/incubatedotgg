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
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
    >
      <div className="flex items-center justify-between">
        {/* Left side: Image + Token Info */}
        <div className="flex items-center gap-3">
          {/* Token Image */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {!imageError && token.imageUrl ? (
              <img
                src={token.imageUrl}
                alt={token.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-600 font-bold text-sm">
                {token.symbol.charAt(0)}
              </span>
            )}
          </div>

          {/* Token Info */}
          <div>
            {/* Ticker */}
            <div className="font-bold text-gray-900 text-base">
              {token.symbol}
            </div>
            {/* Contract Address */}
            <div className="flex items-center gap-1 text-gray-500 font-mono text-xs">
              <span>{truncateAddress(token.baseMint)}</span>
              <Copy 
                size={12} 
                className="cursor-pointer hover:text-gray-700 transition-colors" 
                onClick={handleCopyAddress}
              />
            </div>
          </div>
        </div>

        {/* Right side: Market Cap + Timestamp */}
        <div className="text-right">
          <div className="text-gray-400 text-xs mb-1">
            {formatTimeAgo(token.createdAt)}
          </div>
          <div className="text-gray-900 font-bold text-base">
            {formatFeeAmount(token.totalTradingFees || 0)}
          </div>
          <div className="text-gray-500 text-xs">
            Total Raised
          </div>
        </div>
      </div>
    </div>
  );
}
