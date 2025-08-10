'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Copy } from 'phosphor-react';
import Link from 'next/link';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  creator: string;
  imageUrl: string;
  baseMint: string;
  configAddress: string;
  poolAddress?: string;
  status: string;
  createdAt: any;
  marketCap?: number;
  totalTradingFees?: number;
  creatorFeesEnabled?: boolean;
  creatorFeePercentage?: number;
}

interface FeeData {
  poolAddress: string;
  creatorBaseFee: string;
  creatorQuoteFee: string;
  totalTradingBaseFee: string;
  totalTradingQuoteFee: string;
}

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [totalFeesEarned, setTotalFeesEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tokens' | 'portfolio'>('tokens');
  const [walletInitialized, setWalletInitialized] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [connected, publicKey]);

  const fetchUserData = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      
      // Fetch user's created tokens (limit to 20)
      const tokensResponse = await fetch(`/api/get-tokens?creator=${publicKey.toString()}&limit=20`);
      if (tokensResponse.ok) {
        const tokensResult = await tokensResponse.json();
        setUserTokens(tokensResult.tokens || []);
      }

      // Fetch creator fees using getPoolsFeesByCreator
      const feesResponse = await fetch(`/api/get-fees?creatorAddress=${publicKey.toString()}`);
      if (feesResponse.ok) {
        const feesResult = await feesResponse.json();
        if (feesResult.success && feesResult.data) {
          let totalCreatorFees = 0;
          
          for (const feeData of feesResult.data) {
            // Convert from lamports to SOL and add creator fees
            const creatorBaseFeeSOL = parseInt(feeData.creatorBaseFee) / 1e9;
            const creatorQuoteFeeSOL = parseInt(feeData.creatorQuoteFee) / 1e9;
            totalCreatorFees += creatorBaseFeeSOL + creatorQuoteFeeSOL;
          }
          
          setTotalFeesEarned(totalCreatorFees);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
    }
  };

  const handleConnect = () => {
    setVisible(true);
  };

  const formatFees = (value: number) => {
    return `${value.toFixed(4)} SOL`;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl text-gray-900 mb-4">Not authenticated, please login</h1>
          <div className="flex justify-center">
            <button 
              onClick={handleConnect}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {publicKey.toString().slice(0, 1).toUpperCase()}
            </div>
            
            {/* Address and Copy */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {truncateAddress(publicKey.toString())}
              </h1>
              <div className="flex items-center text-gray-500">
                <span className="text-sm font-mono mr-2">
                  {truncateAddress(publicKey.toString())}
                </span>
                <Copy 
                  size={16} 
                  className="cursor-pointer hover:text-gray-900 transition-colors" 
                  onClick={handleCopyAddress}
                />
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="mb-6">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('tokens')}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'tokens' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                tokens created
              </button>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  activeTab === 'portfolio' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                wallet portfolio
              </button>
            </div>
          </div>

          {/* Fee Balance Notice */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              upon migration, the creator will receive a DAMM V2 LP position representing their share of the locked liquidity and can claim fees directly from{' '}
              <a 
                href="https://app.meteora.ag" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 no-underline"
              >
                app.meteora.ag
              </a>.
            </p>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'portfolio' ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">Wallet portfolio feature is coming soon.</p>
              </div>
            ) : loading ? (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200">
                  <div>token</div>
                  <div>market cap</div>
                  <div>fee authority</div>
                  <div>total fees</div>
                  <div>claim</div>
                </div>
                
                {/* Skeleton Rows */}
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 px-4 py-4 rounded-lg animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : userTokens.length > 0 ? (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200">
                  <div>token</div>
                  <div>market cap</div>
                  <div>fee authority</div>
                  <div>total fees</div>
                  <div>claim</div>
                </div>
                
                {/* Token List */}
                <div className="space-y-2">
                  {userTokens.map((token) => (
                    <div
                      key={token.id}
                      className="grid grid-cols-5 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      <Link href={`/coin/${token.baseMint}`} className="flex items-center">
                        {token.imageUrl && (
                          <img
                            src={token.imageUrl}
                            alt={token.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{token.symbol}</div>
                        </div>
                      </Link>
                      <div className="flex items-center text-gray-900">
                        {formatMarketCap(token.marketCap || 0)}
                      </div>
                      <div className="flex items-center text-gray-900">
                        {token.creatorFeePercentage || 0}%
                      </div>
                      <div className="flex items-center text-gray-900">
                        {formatFees(token.totalTradingFees || 0)}
                      </div>
                      <div className="flex items-center">
                        <a
                          href="https://app.meteora.ag/portfolio"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          claim
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tokens created yet</h3>
                <p className="text-gray-600 mb-6">You haven't created any tokens yet.</p>
                <Link
                  href="/create"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Token
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
