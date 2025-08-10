'use client';

import { useState } from 'react';
import { useSidebar } from './SidebarContext';
import { House, Sparkle, Question, User, ArrowSquareLeft, ArrowSquareRight, Coins } from 'phosphor-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import WalletButton from './WalletButton';
import CreatorRewardsModal from './CreatorRewardsModal';

export default function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showCreatorRewards, setShowCreatorRewards] = useState(false);

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 z-40 hidden md:flex flex-col transition-[width] duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top section (logo + expanded toggle) */}
      <div className="relative p-4 flex items-center justify-center min-h-[72px]">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img 
            src="/Untitled design (60).png" 
            alt="Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Toggle when expanded */}
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="absolute right-4 p-1 rounded-md transition-colors cursor-pointer group"
            aria-label="Collapse sidebar"
          >
            <ArrowSquareLeft size={20} className="text-gray-600 group-hover:text-black transition-colors" />
          </button>
        )}
      </div>

      {/* Toggle when collapsed */}
      {!isExpanded && (
        <div className="relative pb-4">
          <div className="absolute left-1/2 -translate-x-1/2 mt-2">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md transition-colors cursor-pointer group"
              aria-label="Expand sidebar"
            >
              <ArrowSquareRight size={20} className="text-gray-600 group-hover:text-black transition-colors" />
            </button>
          </div>
        </div>
      )}

      {/* Rest of sidebar */}
      <div className={`flex-1 px-3 py-6 ${!isExpanded ? 'mt-4' : ''}`}>
        {/* Navigation */}
        <nav className="space-y-1">
          {/* Home Link */}
          <Link
            href="/"
            className={`group flex items-center ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <House className={`w-6 h-6 transition-colors ${
                pathname === '/' 
                  ? 'text-black' 
                  : 'text-gray-500 group-hover:text-gray-900'
              }`} />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } ${
              pathname === '/' 
                ? 'text-black' 
                : 'text-[#979797] group-hover:text-black'
            }`}>
              home
            </span>
          </Link>

          {/* How it works Button */}
          <button
            onClick={() => setShowHowItWorks(true)}
            className={`group flex items-center w-full cursor-pointer ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <Question className="w-6 h-6 transition-colors text-gray-500 group-hover:text-gray-900" />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } text-[#979797] group-hover:text-black`}>
              how it works
            </span>
          </button>

          {/* Creator rewards Button */}
          <button
            onClick={() => setShowCreatorRewards(true)}
            className={`group flex items-center w-full cursor-pointer ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <Coins className="w-6 h-6 transition-colors text-gray-500 group-hover:text-gray-900" />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } text-[#979797] group-hover:text-black`}>
              creator rewards
            </span>
          </button>

          {/* Profile Link */}
          <Link
            href="/profile"
            className={`group flex items-center ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <User className={`w-6 h-6 transition-colors ${
                pathname === '/profile' 
                  ? 'text-black' 
                  : 'text-gray-500 group-hover:text-gray-900'
              }`} />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } ${
              pathname === '/profile' 
                ? 'text-black' 
                : 'text-[#979797] group-hover:text-black'
            }`}>
              profile
            </span>
          </Link>

          {/* Create Link - Special Blue Button */}
          <Link
            href="/create"
            className={`group transition-colors rounded-xl mt-4 ${
              isExpanded 
                ? 'bg-blue-500 hover:bg-blue-600 flex items-center justify-center px-4 py-4' 
                : 'flex items-center justify-center py-2'
            }`}
          >
            {isExpanded ? (
              <div className="flex items-center">
                <Sparkle className="w-5 h-5 text-white mr-2" />
                <span className="font-semibold text-base tracking-wide text-white">
                  create
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-xl">
                <Sparkle className="w-6 h-6 text-gray-500 group-hover:text-gray-900" />
              </div>
            )}
          </Link>
        </nav>
      </div>

      {/* Wallet Button - Bottom of sidebar */}
      {isExpanded && (
        <div className="p-3">
          <WalletButton />
        </div>
      )}

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowHowItWorks(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Title */}
              <h2 className="text-lg font-bold text-black mb-4">how it works</h2>
              
              {/* Content */}
              <div className="space-y-4 text-gray-700 leading-tight">
                <p>
                  receipts.fun creates dynamic bonding curves with meteora integration, offering the most creator-friendly token launch platform in the industry.
                </p>
                <p>
                  our platform features 2% trading fees after migration, where creators can choose their share up to 90% - the highest in the industry.
                </p>
                <p>
                  We believe sustainable tokenomics benefit everyone. Short-term greed undermines long-term success, which is why we offer the highest creator incentives in the industry while maintaining professional standards and quality content.
                </p>
                <p>
                  tokens launch with a bonding curve mechanism that provides initial liquidity and price discovery, then seamlessly migrate to meteora for enhanced trading.
                </p>
                <p>
                  creators maintain control over their project's economics while benefiting from professional-grade infrastructure and the highest revenue share available.
                </p>
                
                <p>
                  <strong>step 1: create your token with custom parameters</strong>
                </p>
                <p>
                  <strong>step 2: token launches on bonding curve</strong>
                </p>
                <p>
                  <strong>step 3: automatic migration to meteora for enhanced liquidity</strong>
                </p>
                
              </div>
              
              {/* Action Button */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setShowHowItWorks(false)}
                  className="bg-blue-500 text-white font-semibold py-3 px-10 min-w-[200px] rounded-full hover:bg-blue-600 transition-colors text-base cursor-pointer"
                >
                  understood
                </button>
              </div>
              
              {/* Footer Links */}
              <div className="mt-6">
                <div className="flex justify-center space-x-6 text-xs text-gray-500">
                  <Link href="/terms" className="hover:text-gray-700 transition-colors cursor-pointer">
                    terms
                  </Link>
                  <Link href="/privacy" className="hover:text-gray-700 transition-colors cursor-pointer">
                    privacy policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator Rewards Modal */}
      <CreatorRewardsModal 
        isOpen={showCreatorRewards} 
        onClose={() => setShowCreatorRewards(false)} 
      />

    </aside>
  );
}
