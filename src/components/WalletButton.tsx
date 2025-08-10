'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { SignOut } from 'phosphor-react';
import Link from 'next/link';

export default function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center mb-3">
        {connected && publicKey ? (
          // Connected state: Show avatar + address + SignOut icon
          <div className="flex items-center text-md px-4 py-2 rounded-lg transition-colors min-w-[140px] justify-center text-black hover:bg-gray-100">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mr-2"></div>
            <span className="text-sm mr-2">
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
            className="flex items-center text-md px-4 py-2 rounded-lg transition-colors min-w-[140px] justify-center text-black hover:bg-gray-100 cursor-pointer"
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
      
      {/* Terms and Privacy Policy Links */}
      <div className="flex justify-center space-x-6 text-xs text-gray-500">
        <Link href="/terms" className="hover:text-gray-700 transition-colors cursor-pointer">
          terms
        </Link>
        <Link href="/privacy" className="hover:text-gray-700 transition-colors cursor-pointer">
          privacy policy
        </Link>
      </div>
    </div>
  );
}
