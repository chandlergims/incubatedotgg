'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import GMGNChart from '@/components/GMGNChart';
import { Globe, Copy } from 'phosphor-react';

interface TokenData {
  id?: string;
  name: string;
  symbol: string;
  description?: string;
  creator: string;
  imageUrl: string;
  metadataUrl: string;
  metadata: any;
  baseMint: string;
  configAddress: string;
  poolAddress?: string;
  transactions: Array<{ type: string; txId: string }>;
  status: string;
  createdAt: any;
  website?: string;
  telegram?: string;
  twitter?: string;
  usdPrice?: number;
  marketCap?: number;
  volume24h?: number;
  totalTradingFees?: number;
  creatorFeesEnabled?: boolean;
}

export default function CoinPage() {
  const params = useParams();
  const baseMint = params.baseMint as string;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(`/api/get-token/${baseMint}`);
        if (response.ok) {
          const result = await response.json();
          setTokenData(result.token);
        } else {
          setError('Token not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load token data');
        setLoading(false);
      }
    };

    if (baseMint) {
      fetchTokenData();
    }
  }, [baseMint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto">
            {/* Token Header Skeleton */}
            <div className="text-center mb-6">
              <div className="mb-3">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full mx-auto animate-pulse"></div>
              </div>
              <div className="h-8 bg-[#1a1a1a] rounded w-24 mx-auto mb-1 animate-pulse"></div>
              <div className="h-5 bg-[#1a1a1a] rounded w-32 mx-auto mb-1 animate-pulse"></div>
              <div className="h-4 bg-[#1a1a1a] rounded w-48 mx-auto animate-pulse"></div>
            </div>

            {/* Key Metrics Skeleton */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="h-3 bg-[#2a2a2a] rounded w-8 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-12 mx-auto animate-pulse"></div>
                </div>
                <div className="text-center">
                  <div className="h-3 bg-[#2a2a2a] rounded w-10 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-12 mx-auto animate-pulse"></div>
                </div>
                <div className="text-center">
                  <div className="h-3 bg-[#2a2a2a] rounded w-8 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-16 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Contract Address Skeleton */}
            <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 bg-[#2a2a2a] rounded w-24 animate-pulse"></div>
                <div className="w-3 h-3 bg-[#2a2a2a] rounded animate-pulse"></div>
              </div>
            </div>

            {/* Social Links Skeleton */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#1a1a1a] rounded-xl px-3 py-2">
                <div className="h-4 bg-[#2a2a2a] rounded w-16 mx-auto animate-pulse"></div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl px-3 py-2">
                <div className="h-4 bg-[#2a2a2a] rounded w-16 mx-auto animate-pulse"></div>
              </div>
            </div>

            {/* Created By Skeleton */}
            <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-3 bg-[#2a2a2a] rounded w-16 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-[#2a2a2a] rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-[#2a2a2a] rounded w-20 animate-pulse"></div>
                  <div className="w-3 h-3 bg-[#2a2a2a] rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Total Fees Skeleton */}
            <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-[#2a2a2a] rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-[#2a2a2a] rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Chart Skeleton */}
            <div className="mb-4">
              <div className="h-[300px] bg-[#1a1a1a] rounded-xl animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatPrice = (value: number) => {
    if (value < 0.000001) return `$${value.toFixed(8)}`;
    if (value < 0.01) return `$${value.toFixed(6)}`;
    return `$${value.toFixed(4)}`;
  };

  const formatFees = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K SOL`;
    return `${value.toFixed(2)} SOL`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleCopyTokenAddress = () => {
    navigator.clipboard.writeText(baseMint);
  };

  const handleCopyCreatorAddress = () => {
    if (tokenData?.creator) {
      navigator.clipboard.writeText(tokenData.creator);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Token Header */}
          <div className="text-center mb-6">
            {tokenData?.imageUrl && (
              <div className="mb-3">
                <img
                  src={tokenData.imageUrl}
                  alt={tokenData.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white mb-1">
              ${tokenData?.symbol || 'TOKEN'}
            </h1>
            <h2 className="text-base text-gray-400 mb-1">
              {tokenData?.name || 'Token Name'}
            </h2>
            {tokenData?.description && (
              <p className="text-gray-400 text-xs max-w-xs mx-auto line-clamp-3 overflow-hidden">
                {tokenData.description}
              </p>
            )}
          </div>

          {/* Key Metrics */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">MCAP</div>
                <div className="text-sm font-bold text-white">
                  {formatMarketCap(tokenData?.marketCap || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">24H VOL</div>
                <div className="text-sm font-bold text-white">
                  {formatVolume(tokenData?.volume24h || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">PRICE</div>
                <div className="text-sm font-bold text-white">
                  {formatPrice(tokenData?.usdPrice || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs text-gray-300">
                {truncateAddress(baseMint)}
              </span>
              <Copy 
                size={12} 
                className="cursor-pointer hover:text-white transition-colors text-gray-400"
                onClick={handleCopyTokenAddress}
              />
            </div>
          </div>

          {/* Social Links */}
          {(tokenData?.twitter || tokenData?.website) && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tokenData?.twitter && (
                <a
                  href={tokenData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl px-3 py-2 text-xs font-medium text-gray-300 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                  </svg>
                  twitter
                </a>
              )}
              {tokenData?.website && (
                <a
                  href={tokenData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl px-3 py-2 text-xs font-medium text-gray-300 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Globe size={16} />
                  website
                </a>
              )}
            </div>
          )}

          {/* Created By */}
          <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400 text-xs block">created by</span>
                <span className="text-gray-400 text-xs">
                  earns {tokenData?.creatorFeesEnabled ? '25%' : '0%'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white font-mono">
                  {tokenData?.creator ? truncateAddress(tokenData.creator) : 'Unknown'}
                </span>
                {tokenData?.creator && (
                  <Copy 
                    size={12} 
                    className="cursor-pointer hover:text-white transition-colors text-gray-400"
                    onClick={handleCopyCreatorAddress}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Total Fees Earned */}
          <div className="bg-[#1a1a1a] rounded-xl p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">total raised</span>
              <span className="text-sm font-bold text-white">
                {formatFees(tokenData?.totalTradingFees || 0)}
              </span>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mb-4">
            <GMGNChart tokenAddress={baseMint} theme="dark" interval="15" height={300} />
          </div>
        </div>
      </main>
    </div>
  );
}
