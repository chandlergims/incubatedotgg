'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import TokenCard from '@/components/TokenCard';

interface Token {
  id: string;
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
  totalTradingFees?: number;
}

export default function Home() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mintSearchQuery, setMintSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchTokens = async (sort = 'newest') => {
    try {
      setLoading(true);
      
      // Fetch recent tokens (limit 20)
      const recentParams = new URLSearchParams({
        search: '',
        sortBy: sort,
        limit: '20'
      });
      
      const recentResponse = await fetch(`/api/get-tokens?${recentParams}`);

      if (recentResponse.ok) {
        const recentResult = await recentResponse.json();
        setAllTokens(recentResult.tokens || []);
        setFilteredTokens(recentResult.tokens || []);
        setError(null);
      } else {
        setError('Failed to load tokens');
      }
    } catch (err) {
      setError('Failed to load tokens');
      console.error('Error fetching tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens(sortBy);
  }, [connected, publicKey]);

  const isValidSolanaMint = (address: string) => {
    // Basic Solana address validation: 32-44 characters, base58 encoded
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  };

  const handleMintSearch = () => {
    const trimmedQuery = mintSearchQuery.trim();
    
    if (!trimmedQuery) {
      return;
    }

    // Navigate to token detail page
    router.push(`/coin/${trimmedQuery}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMintSearch();
    }
  };


  return (
    <div className="bg-white min-h-full">
      <main className="container mx-auto px-6 py-8">

        {/* Loading State */}
        {loading && (
          <div className="max-w-7xl mx-auto pt-8">
            {/* Search Bar Skeleton */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Recent Section Skeleton */}
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            
            {/* Token Cards Skeleton - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Token Image Skeleton */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      
                      <div>
                        {/* Token Symbol Skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                        {/* Token Address Skeleton */}
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {/* Timestamp Skeleton */}
                      <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                      {/* Total Raised Skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                      {/* Label Skeleton */}
                      <div className="h-3 bg-gray-200 rounded w-14"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchTokens(sortBy)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Tokens State */}
        {!loading && !error && filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tokens yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to create a token on our platform!
            </p>
            <button
              onClick={() => router.push('/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create First Token
            </button>
          </div>
        )}

        {/* Search Bar */}
        {!loading && !error && (
          <div className="max-w-lg mx-auto pt-8 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter mint address..."
                value={mintSearchQuery}
                onChange={(e) => setMintSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg 
                  className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  onClick={handleMintSearch}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Tokens List */}
        {!loading && !error && filteredTokens.length > 0 && (
          <div className="max-w-7xl mx-auto pt-8">
            {/* Recent Tokens Section */}
            <div className="mb-6">
              <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                RECENT
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTokens.map((token: Token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
