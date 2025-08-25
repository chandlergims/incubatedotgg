'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { SignOut } from 'phosphor-react';
import { useState } from 'react';

export default function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center mb-3">
        {connected && publicKey ? (
          // Connected state: Show address + SignOut icon
          <div className="flex items-center text-md px-4 py-2 bg-[#1a1a1a] rounded-lg transition-colors min-w-[140px] justify-center text-white hover:bg-[#2a2a2a]">
            <span 
              className="text-sm mr-2 cursor-pointer hover:text-blue-400 transition-colors flex-1"
              onClick={handleCopyAddress}
              title="Click to copy full address"
            >
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
            <SignOut 
              className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" 
              onClick={handleDisconnect}
            />
          </div>
        ) : (
          // Disconnected state: Show wallet icon + text
          <button 
            onClick={handleConnect}
            className="flex items-center text-md px-4 py-2 bg-[#1a1a1a] rounded-lg transition-colors min-w-[140px] justify-center text-white hover:bg-[#2a2a2a] cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              aria-hidden="true" 
              className="w-4 h-4 stroke-[2]"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" 
              />
            </svg>
            <span className="text-sm ml-2">connect wallet</span>
          </button>
        )}
      </div>
      
    </div>
  );
}
