'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, Connection } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';

export default function FeesPage() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [loadingPools, setLoadingPools] = useState(false);
  const [userPools, setUserPools] = useState<any[]>([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchedPools, setSearchedPools] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [poolFees, setPoolFees] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  
  // Form states for partner fee claiming
  const [partnerForm, setPartnerForm] = useState({
    pool: '',
    maxBaseAmount: '111111111111111',
    maxQuoteAmount: '111111111111111',
    receiver: '',
    tempWSolAcc: ''
  });

  // Hardcoded fee claimer address
  const FEE_CLAIMER = '7sc8NEd2vkp8ZQgfMgo1HWJJC45Q7P9CFb6zbK8QL4mr';

  // Form states for creator fee claiming
  const [creatorForm, setCreatorForm] = useState({
    creator: '',
    pool: '',
    maxBaseAmount: '111111111',
    maxQuoteAmount: '111111111',
    receiver: '',
    tempWSolAcc: ''
  });

  // Fetch pools created by the connected user
  const fetchUserPools = async () => {
    if (!connected || !publicKey) return;

    setLoadingPools(true);
    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const pools = await client.state.getPoolsByCreator(publicKey.toString());
      
      console.log('Found pools for creator:', pools);
      setUserPools(pools);
      
      // Auto-fill creator address if user has pools
      if (pools.length > 0) {
        setCreatorForm(prev => ({
          ...prev,
          creator: publicKey.toString()
        }));
      }
    } catch (error) {
      console.error('Error fetching user pools:', error);
    } finally {
      setLoadingPools(false);
    }
  };

  // Fetch pools when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchUserPools();
    } else {
      setUserPools([]);
      setCreatorForm(prev => ({ ...prev, creator: '' }));
    }
  }, [connected, publicKey]);

  // Search for pools by creator address
  const searchPoolsByCreator = async () => {
    if (!searchAddress.trim()) {
      alert('Please enter a creator address');
      return;
    }

    setLoadingSearch(true);
    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const pools = await client.state.getPoolsByCreator(searchAddress.trim());
      
      console.log('Found pools for searched creator:', pools);
      setSearchedPools(pools);
      
      // Also fetch fees for the pools
      await fetchPoolFees(searchAddress.trim());
    } catch (error) {
      console.error('Error searching pools:', error);
      alert('Error searching for pools. Please check the address and try again.');
      setSearchedPools([]);
      setPoolFees([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Fetch pool fees by creator address
  const fetchPoolFees = async (creatorAddress: string) => {
    setLoadingFees(true);
    try {
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const fees = await client.state.getPoolsFeesByCreator(new PublicKey(creatorAddress));
      
      console.log('Found fees for creator:', fees);
      setPoolFees(fees);
    } catch (error) {
      console.error('Error fetching pool fees:', error);
      setPoolFees([]);
    } finally {
      setLoadingFees(false);
    }
  };

  // Format fee amounts for display
  const formatFeeAmount = (amount: any) => {
    if (!amount) return '0';
    try {
      const num = amount.toString();
      return parseFloat(num).toLocaleString();
    } catch {
      return '0';
    }
  };

  // Helper function to select a pool
  const selectPool = (poolAddress: string, isCreator: boolean = false, creatorAddress?: string) => {
    if (isCreator) {
      setCreatorForm(prev => ({
        ...prev,
        pool: poolAddress,
        creator: creatorAddress || prev.creator
      }));
    } else {
      setPartnerForm(prev => ({
        ...prev,
        pool: poolAddress
      }));
    }
  };

  const handlePartnerClaim = async () => {
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    if (!partnerForm.pool) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/claim-partner-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...partnerForm,
          feeClaimer: FEE_CLAIMER,
          payer: publicKey.toString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create transaction');
      }

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(result.transaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);

      // Submit the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      alert(`Partner fee claimed successfully! Signature: ${signature}`);
      
      // Reset form
      setPartnerForm({
        pool: '',
        maxBaseAmount: '111111111',
        maxQuoteAmount: '111111111',
        receiver: '',
        tempWSolAcc: ''
      });

    } catch (error) {
      console.error('Error claiming partner fee:', error);
      alert(error instanceof Error ? error.message : 'Failed to claim partner fee');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorClaim = async () => {
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    if (!creatorForm.creator || !creatorForm.pool) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/claim-creator-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...creatorForm,
          payer: publicKey.toString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create transaction');
      }

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(result.transaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);

      // Submit the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      alert(`Creator fee claimed successfully! Signature: ${signature}`);
      
      // Reset form
      setCreatorForm({
        creator: '',
        pool: '',
        maxBaseAmount: '111111111',
        maxQuoteAmount: '111111111',
        receiver: '',
        tempWSolAcc: ''
      });

    } catch (error) {
      console.error('Error claiming creator fee:', error);
      alert(error instanceof Error ? error.message : 'Failed to claim creator fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-full">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Trading Fees</h1>
            <p className="text-gray-600">
              Claim your earned trading fees from tokens you've created or partnered with.
            </p>
          </div>

          {/* User's Pools Section */}
          {userPools.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-semibold text-purple-900">Your Pools ({userPools.length})</h3>
                </div>
                {loadingPools && (
                  <div className="flex items-center text-purple-600">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                )}
              </div>
              
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {userPools.map((pool, index) => (
                  <div key={index} className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Pool: {pool.publicKey?.toString() || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Base Mint: {pool.account?.baseMint?.toString() || 'Unknown'}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => selectPool(pool.publicKey?.toString() || '', false)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Partner
                        </button>
                        <button
                          onClick={() => selectPool(pool.publicKey?.toString() || '', true)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Creator
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-purple-600">
                Click "Partner" or "Creator" to auto-fill the pool address in the respective form below.
              </div>
            </div>
          )}

          {loadingPools && userPools.length === 0 && (
            <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading your pools...</span>
              </div>
            </div>
          )}

          {/* Search Pools by Creator Section */}
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-orange-900">Search Pools by Creator</h3>
            </div>
            
            <p className="text-sm text-orange-700 mb-4">
              Enter any creator address to view their pools and claim fees (works without wallet connection).
            </p>
            
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter creator wallet address..."
                className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchPoolsByCreator()}
              />
              <button
                onClick={searchPoolsByCreator}
                disabled={loadingSearch}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors font-medium"
              >
                {loadingSearch ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {searchedPools.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">Found {searchedPools.length} pools</span>
                </div>
                
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {searchedPools.map((pool, index) => (
                    <div key={index} className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Pool: {pool.publicKey?.toString() || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Base Mint: {pool.account?.baseMint?.toString() || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => selectPool(pool.publicKey?.toString() || '', false)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Partner
                          </button>
                          <button
                            onClick={() => selectPool(pool.publicKey?.toString() || '', true, searchAddress)}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Creator
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchedPools.length === 0 && searchAddress && !loadingSearch && (
              <div className="text-center py-4">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No pools found for this creator address</p>
              </div>
            )}
          </div>

          {/* Pool Fees Display Section */}
          {poolFees.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="text-lg font-semibold text-emerald-900">Pool Fees Summary</h3>
                </div>
                {loadingFees && (
                  <div className="flex items-center text-emerald-600">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading fees...
                  </div>
                )}
              </div>
              
              <p className="text-sm text-emerald-700 mb-4">
                Detailed fee breakdown for all pools created by: <span className="font-mono text-xs">{searchAddress}</span>
              </p>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {poolFees.map((feeData, index) => (
                  <div key={index} className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Pool: <span className="font-mono text-xs">{feeData.poolAddress?.toString() || 'Unknown'}</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-900 mb-1">Partner Fees</p>
                        <p className="text-blue-700">Base: {formatFeeAmount(feeData.partnerBaseFee)}</p>
                        <p className="text-blue-700">Quote: {formatFeeAmount(feeData.partnerQuoteFee)}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-medium text-green-900 mb-1">Creator Fees</p>
                        <p className="text-green-700">Base: {formatFeeAmount(feeData.creatorBaseFee)}</p>
                        <p className="text-green-700">Quote: {formatFeeAmount(feeData.creatorQuoteFee)}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg col-span-2 md:col-span-1">
                        <p className="font-medium text-purple-900 mb-1">Total Trading</p>
                        <p className="text-purple-700">Base: {formatFeeAmount(feeData.totalTradingBaseFee)}</p>
                        <p className="text-purple-700">Quote: {formatFeeAmount(feeData.totalTradingQuoteFee)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => selectPool(feeData.poolAddress?.toString() || '', false)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Claim Partner
                      </button>
                      <button
                        onClick={() => selectPool(feeData.poolAddress?.toString() || '', true, searchAddress)}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Claim Creator
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-emerald-600">
                💡 Click "Claim Partner" or "Claim Creator" to auto-fill the forms below with the pool address.
              </div>
            </div>
          )}

          {loadingFees && (
            <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading fee details...</span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Partner Fee Claiming */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-blue-900">Partner Trading Fees</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Pool Address *</label>
                  <input
                    type="text"
                    value={partnerForm.pool}
                    onChange={(e) => setPartnerForm({ ...partnerForm, pool: e.target.value })}
                    placeholder="Enter pool address"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Fee Claimer</label>
                  <input
                    type="text"
                    value={FEE_CLAIMER}
                    disabled
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-blue-600 mt-1">This is the platform fee claimer address</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Max Base Amount</label>
                    <input
                      type="number"
                      value={partnerForm.maxBaseAmount}
                      onChange={(e) => setPartnerForm({ ...partnerForm, maxBaseAmount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Max Quote Amount</label>
                    <input
                      type="number"
                      value={partnerForm.maxQuoteAmount}
                      onChange={(e) => setPartnerForm({ ...partnerForm, maxQuoteAmount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Receiver (Optional)</label>
                  <input
                    type="text"
                    value={partnerForm.receiver}
                    onChange={(e) => setPartnerForm({ ...partnerForm, receiver: e.target.value })}
                    placeholder="Leave empty to use your wallet"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handlePartnerClaim}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  {loading ? 'Processing...' : 'Claim Partner Fees'}
                </button>
              </div>
            </div>

            {/* Creator Fee Claiming */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-xl font-semibold text-green-900">Creator Trading Fees</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">Creator Address *</label>
                  <input
                    type="text"
                    value={creatorForm.creator}
                    onChange={(e) => setCreatorForm({ ...creatorForm, creator: e.target.value })}
                    placeholder="Enter creator address"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">Pool Address *</label>
                  <input
                    type="text"
                    value={creatorForm.pool}
                    onChange={(e) => setCreatorForm({ ...creatorForm, pool: e.target.value })}
                    placeholder="Enter pool address"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Max Base Amount</label>
                    <input
                      type="number"
                      value={creatorForm.maxBaseAmount}
                      onChange={(e) => setCreatorForm({ ...creatorForm, maxBaseAmount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Max Quote Amount</label>
                    <input
                      type="number"
                      value={creatorForm.maxQuoteAmount}
                      onChange={(e) => setCreatorForm({ ...creatorForm, maxQuoteAmount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">Receiver (Optional)</label>
                  <input
                    type="text"
                    value={creatorForm.receiver}
                    onChange={(e) => setCreatorForm({ ...creatorForm, receiver: e.target.value })}
                    placeholder="Leave empty to use your wallet"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleCreatorClaim}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  {loading ? 'Processing...' : 'Claim Creator Fees'}
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Claim Fees</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Partner Fees</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You must be the designated fee claimer in the pool config</li>
                  <li>• Enter the pool address and your fee claimer address</li>
                  <li>• Set max amounts to limit how much you claim (0 = no limit)</li>
                  <li>• Optionally specify a different receiver address</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Creator Fees</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You must be the creator of the pool</li>
                  <li>• Pool must have creatorTradingFeePercentage &gt; 0</li>
                  <li>• Enter your creator address and the pool address</li>
                  <li>• Set max amounts to limit how much you claim (0 = no limit)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
