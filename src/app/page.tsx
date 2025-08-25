'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Robot } from 'phosphor-react';
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
  
  // Check if creation is enabled
  const creationEnabled = process.env.NEXT_PUBLIC_CREATION_ENABLED === 'true';

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
    <div className="bg-[#0a0a0a] min-h-full">
      <main className="container mx-auto px-6 py-8">

        {/* Loading State */}
        {loading && (
          <div className="max-w-7xl mx-auto pt-8">
            {/* Mint Agent Button Skeleton */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-12 bg-[#1a1a1a] rounded-xl w-40 animate-pulse"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <div className="h-12 bg-[#1a1a1a] rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Recent Section Skeleton */}
            <div className="mb-6">
              <div className="h-4 bg-[#2a2a2a] rounded w-16 animate-pulse"></div>
            </div>
            
            {/* Token Cards Skeleton - Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-lg p-3 animate-pulse aspect-square relative overflow-hidden"
                >
                  {/* Token Image Skeleton - Full background */}
                  <div className="absolute inset-0 bg-[#2a2a2a] rounded-lg"></div>
                  
                  {/* Overlay content at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    {/* Token Symbol Skeleton */}
                    <div className="h-4 bg-[#2a2a2a] rounded w-3/4 mb-1"></div>
                    {/* Token Address Skeleton */}
                    <div className="h-3 bg-[#2a2a2a] rounded w-1/2 mb-1"></div>
                    {/* Creator Fees Skeleton */}
                    <div className="h-3 bg-[#2a2a2a] rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchTokens(sortBy)}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-lg transition-colors"
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
            <h3 className="text-lg font-medium text-white mb-2">No agents yet</h3>
            <p className="text-gray-400 mb-4">
              Be the first to mint an AI agent on our platform!
            </p>
            <button
              onClick={() => router.push('/create')}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mint First Agent
            </button>
          </div>
        )}

        {/* Header Section with Mint Agent Button */}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto pt-8 mb-8">
            {/* Top button row */}
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={creationEnabled ? () => router.push('/create') : undefined}
                disabled={!creationEnabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-colors ${
                  creationEnabled 
                    ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] cursor-pointer' 
                    : 'bg-[#2a2a2a] cursor-not-allowed opacity-60'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">{creationEnabled ? 'mint an agent' : 'coming soon'}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter mint address..."
                  value={mintSearchQuery}
                  onChange={(e) => setMintSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-10 bg-[#1a1a1a] rounded-xl text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
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
          </div>
        )}

        {/* Tokens List */}
        {!loading && !error && filteredTokens.length > 0 && (
          <div className="max-w-7xl mx-auto pt-8">
            {/* Agents We Brought to Life Section */}
            <div className="mb-8">
              <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">
                AGENTS WE BROUGHT TO LIFE
              </h2>
              <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Robot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No Agents Yet</h3>
                <p className="text-gray-400 text-sm">
                  Incubated agents show up here. Learn how you can have your agent incubated and brought to life.
                  <br />
                  <button
                    onClick={() => {
                      // Trigger the sidebar modal by dispatching a custom event
                      window.dispatchEvent(new CustomEvent('openIncubationTips'));
                    }}
                    className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Incubation Tips
                  </button>
                </p>
              </div>
            </div>

            {/* Recent Tokens Section */}
            <div className="mb-6">
              <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                RECENT
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
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
