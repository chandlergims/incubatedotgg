'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';

export default function CreatePage() {
  const router = useRouter();
  const { connected, publicKey, signAllTransactions } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    website: '',
    telegram: '',
    twitter: '',
  });
  const [creatorFeePercentage, setCreatorFeePercentage] = useState(0); // Default 0%
  const [initialBuyAmount, setInitialBuyAmount] = useState(''); // Default empty
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    website: '',
    telegram: '',
    twitter: ''
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate on blur for social media links
    if (name === 'website' || name === 'telegram' || name === 'twitter') {
      let error = '';
      
      if (value.trim()) { // Only validate if there's a value
        if (name === 'website') {
          if (!value.startsWith('http://') && !value.startsWith('https://')) {
            error = 'Website URL must start with http:// or https://';
          }
        } else if (name === 'telegram') {
          if (!value.startsWith('https://t.me/')) {
            error = 'Telegram link must be in format: https://t.me/username';
          }
        } else if (name === 'twitter') {
          if (!value.startsWith('https://twitter.com/') && !value.startsWith('https://x.com/')) {
            error = 'Twitter link must be in format: https://twitter.com/username or https://x.com/username';
          }
        }
      }

      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey || !signAllTransactions) {
      alert('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.symbol || !selectedFile) {
      alert('Please fill in all fields and select an image');
      return;
    }

    // Prevent multiple rapid submissions
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Create FormData and send to backend
      const uploadFormData = new FormData();
      uploadFormData.append('name', formData.name);
      uploadFormData.append('symbol', formData.symbol);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('poolCreator', publicKey.toString());
      uploadFormData.append('image', selectedFile);
      uploadFormData.append('website', formData.website);
      uploadFormData.append('telegram', formData.telegram);
      uploadFormData.append('twitter', formData.twitter);
      uploadFormData.append('creatorFeePercentage', creatorFeePercentage.toString());
      uploadFormData.append('initialBuyAmount', initialBuyAmount.toString());

      const response = await fetch('/api/create-token', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to create token');
      }

      const result = await response.json();
      
      // Step 2: Sign transactions with Phantom wallet
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);

      // Deserialize transactions
      const createConfigTx = Transaction.from(Buffer.from(result.transactions.createConfigTx, 'base64'));
      const createPoolTx = Transaction.from(Buffer.from(result.transactions.createPoolTx, 'base64'));
      const swapBuyTx = result.transactions.swapBuyTx ? 
        Transaction.from(Buffer.from(result.transactions.swapBuyTx, 'base64')) : null;

      // Sign all transactions at once
      const transactionsToSign = swapBuyTx ? [createConfigTx, createPoolTx, swapBuyTx] : [createConfigTx, createPoolTx];
      const signedTransactions = await signAllTransactions(transactionsToSign);
      
      const signedCreateConfigTx = signedTransactions[0];
      const signedCreatePoolTx = signedTransactions[1];
      const signedSwapBuyTx = swapBuyTx ? signedTransactions[2] : null;

      // Step 3: Send signed transactions back to backend for submission
      const submitResponse = await fetch('/api/submit-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createConfigTx: signedCreateConfigTx.serialize().toString('base64'),
          createPoolTx: signedCreatePoolTx.serialize().toString('base64'),
          swapBuyTx: signedSwapBuyTx ? signedSwapBuyTx.serialize().toString('base64') : null,
          baseMint: result.baseMint,
          config: result.config,
        }),
      });

      if (submitResponse.ok) {
        const submitResult = await submitResponse.json();
        console.log('Transactions submitted successfully:', submitResult);

        // Step 4: Save token data to database after successful transaction submission
        const saveResponse = await fetch('/api/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            creator: publicKey.toString(),
            imageUrl: result.imageUrl,
            metadataUrl: result.metadataUrl,
            metadata: result.metadata,
            baseMint: submitResult.baseMint,
            configAddress: submitResult.config,
            transactions: submitResult.transactions,
            website: formData.website,
            telegram: formData.telegram,
            twitter: formData.twitter,
            creatorFeePercentage: creatorFeePercentage
          }),
        });

        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          console.log('Token data saved to database:', saveResult);
        } else {
          console.warn('Token created but failed to save to database');
        }

        // Redirect to coin page with baseMint
        router.push(`/coin/${submitResult.baseMint}`);
      } else {
        throw new Error('Failed to submit transactions');
      }
    } catch (error) {
      console.error('Error creating token:', error);
      // Removed alert - user may have cancelled intentionally
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
              {/* Circular File Upload */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file type
                        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
                        if (!validTypes.includes(file.type)) {
                          alert('Please select a valid image file (PNG, JPEG, JPG, GIF, or WebP)');
                          e.target.value = '';
                          return;
                        }
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        // Create preview URL
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                      } else {
                        setPreviewUrl(null);
                      }
                      setSelectedFile(file || null);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                    maxLength={32}
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="Ticker"
                    className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                    maxLength={10}
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Description"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-3xl focus:outline-none resize-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                    autoComplete="off"
                  />
              </div>

              {/* Initial Buy Amount */}
              <div>
                <div className="relative">
                  <input
                    type="number"
                    id="initialBuyAmount"
                    value={initialBuyAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                        setInitialBuyAmount(value);
                      }
                    }}
                    placeholder="Initial buy amount (optional)"
                    min="0"
                    max="10"
                    step="0.01"
                    className="w-full px-4 py-3 pr-12 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                    autoComplete="off"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-sm">
                    SOL
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-4">
                  Amount of SOL to buy initially (0-10 SOL)
                </p>
              </div>

              {/* Creator Fees Selection */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-3">Creator Fees</label>
                
                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="1"
                    value={creatorFeePercentage}
                    onChange={(e) => setCreatorFeePercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(creatorFeePercentage / 90) * 100}%, #e5e7eb ${(creatorFeePercentage / 90) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>

                {/* Share Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Your Share Card - Left */}
                  <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {creatorFeePercentage}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Your share
                      </div>
                    </div>
                  </div>

                  {/* Platform Share Card - Right */}
                  <div className="p-4 rounded-xl border-2 border-gray-200 bg-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {100 - creatorFeePercentage}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Platform share
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Choose your percentage of locked LP fees (0-90%)
                </p>
              </div>

              {/* More Options Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showMoreOptions ? 'Less options' : 'More options'}
                </button>
              </div>

              {/* Optional Fields - Hidden by default */}
              {showMoreOptions && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Website link (optional)"
                      className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                      autoComplete="off"
                    />
                    {validationErrors.website && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.website}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Twitter/X link (optional)"
                      className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                      autoComplete="off"
                    />
                    {validationErrors.twitter && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.twitter}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="url"
                      id="telegram"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Telegram link (optional)"
                      className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-full focus:outline-none placeholder:font-bold placeholder:text-gray-500 font-bold"
                      autoComplete="off"
                    />
                    {validationErrors.telegram && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.telegram}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading || 
                  !connected ||
                  !formData.name || 
                  !formData.symbol || 
                  !selectedFile ||
                  Object.values(validationErrors).some(error => error !== '')
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-full transition-colors text-base"
              >
                {!connected ? 'Connect Wallet First' : isLoading ? 'Creating Token...' : 'Create Token'}
              </button>
            </form>
        </div>
      </main>
    </div>
  );
}
