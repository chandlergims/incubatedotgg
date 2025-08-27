'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Robot, TwitterLogo, Globe } from 'phosphor-react';
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
      
      // Fetch recent tokens (limit 100)
      const recentParams = new URLSearchParams({
        search: '',
        sortBy: sort,
        limit: '100'
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
      {/* Contract Address Banner */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] py-2">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <span className="text-white text-sm">Protocol Token: </span>
            <span className="text-white text-sm font-mono">
              {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== 'YOUR_CONTRACT_ADDRESS_HERE' 
                ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS 
                : ''}
            </span>
          </div>
        </div>
      </div>
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {/* Myla card with flashing animation */}
                <div className="bg-[#1a1a1a] rounded-lg p-3 aspect-square relative overflow-hidden">
                  {/* Flashing border animation */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse opacity-50"></div>
                  <div className="absolute inset-[2px] bg-[#1a1a1a] rounded-lg"></div>
                  
                  {/* Agent Image Background */}
                  <div className="absolute inset-[2px] rounded-lg overflow-hidden">
                    <img 
                      src="/yyBnnJ73_400x400.jpg" 
                      alt="Myla Agent"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Online Status Indicator - Top Right */}
                    <div className="flex justify-end">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    
                    {/* Agent Info - Bottom */}
                    <div className="text-center">
                      <h3 className="text-white text-sm font-bold mb-2">Myla</h3>
                      {/* Social Icons - Under Name */}
                      <div className="flex justify-center gap-2">
                        <a 
                          href="https://x.com/MylaLovesLife" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="text-white" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                          </svg>
                        </a>
                        <a 
                          href="https://mylasworld.app/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <Globe className="w-3 h-3 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blue card with incubating status */}
                <div className="bg-[#1a1a1a] rounded-lg p-3 aspect-square relative overflow-hidden">
                  {/* Incubating border animation - blue theme */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-pulse opacity-50"></div>
                  <div className="absolute inset-[2px] bg-[#1a1a1a] rounded-lg"></div>
                  
                  {/* Agent Image Background */}
                  <div className="absolute inset-[2px] rounded-lg overflow-hidden">
                    <img 
                      src="/67249994a30cdd794564cffa_39960946-573f-4ad7-b289-b0368e7db572.png" 
                      alt="Blue Agent"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Incubating Status Indicator - Top Right */}
                    <div className="flex justify-end">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    
                    {/* Agent Info - Bottom */}
                    <div className="text-center">
                      <h3 className="text-white text-sm font-bold mb-2">Blue</h3>
                      <div className="text-xs text-blue-300 animate-pulse">
                        Incubating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                  Learn how you can have your agent incubated and brought to life.{' '}
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
