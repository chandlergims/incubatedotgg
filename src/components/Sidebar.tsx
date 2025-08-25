'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { House, Sparkle, Question, User, ArrowSquareLeft, ArrowSquareRight, Trophy, Lightbulb } from 'phosphor-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import WalletButton from './WalletButton';

export default function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { connected, publicKey } = useWallet();
  const pathname = usePathname();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showGrants, setShowGrants] = useState(false);
  const [showIncubationTips, setShowIncubationTips] = useState(false);

  useEffect(() => {
    const handleOpenIncubationTips = () => {
      setShowIncubationTips(true);
    };

    window.addEventListener('openIncubationTips', handleOpenIncubationTips);
    return () => window.removeEventListener('openIncubationTips', handleOpenIncubationTips);
  }, []);

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 bg-[#0a0a0a] border-r border-[#1a1a1a] z-40 hidden md:flex flex-col transition-[width] duration-300 ${
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
            <ArrowSquareLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
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
              <ArrowSquareRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
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
                  ? 'text-white' 
                  : 'text-white group-hover:text-gray-300'
              }`} />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } ${
              pathname === '/' 
                ? 'text-white' 
                : 'text-white group-hover:text-gray-300'
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
              <Question className="w-6 h-6 transition-colors text-white group-hover:text-gray-300" />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } text-white group-hover:text-gray-300`}>
              how it works
            </span>
          </button>

          {/* Grants Button */}
          <button
            onClick={() => setShowGrants(true)}
            className={`group flex items-center w-full cursor-pointer ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <Trophy className="w-6 h-6 transition-colors text-white group-hover:text-gray-300" />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } text-white group-hover:text-gray-300`}>
              grants
            </span>
          </button>

          {/* Incubation Tips Button */}
          <button
            onClick={() => setShowIncubationTips(true)}
            className={`group flex items-center w-full cursor-pointer ${
              isExpanded 
                ? 'px-3 py-2 rounded-xl' 
                : 'justify-center py-2'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              <Lightbulb className="w-6 h-6 transition-colors text-white group-hover:text-gray-300" />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } text-white group-hover:text-gray-300`}>
              incubation tips
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
                  ? 'text-white' 
                  : 'text-white group-hover:text-gray-300'
              }`} />
            </div>
            <span className={`font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-300 ${
              isExpanded 
                ? 'opacity-100 ml-4 w-auto' 
                : 'opacity-0 ml-0 w-0 overflow-hidden'
            } ${
              pathname === '/profile' 
                ? 'text-white' 
                : 'text-white group-hover:text-gray-300'
            }`}>
              profile
            </span>
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
            className="bg-[#1a1a1a] rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-4">how it works</h2>
              
              {/* Content */}
              <div className="space-y-4 text-gray-300 leading-tight">
                <p>
                  incubate.gg is an AI agent launchpad that allows creators to easily raise SOL through dynamic bonding curves and tokenize their AI agents.
                </p>
                <p>
                  our platform uses dynamic bonding curves where token prices increase automatically as more tokens are purchased, ensuring fair price discovery and guaranteed liquidity.
                </p>
                <p>
                  the description you provide becomes the foundation for your AI agent's identity. we bring top-performing agents with strong communities to life as functional AI entities.
                </p>
                <p>
                  creators can tokenize their AI agent concepts, allowing communities to form around innovative ideas and fund their development through trading.
                </p>
                <p>
                  early supporters get better prices, and there's no need for traditional liquidity pools - the bonding curve provides instant trading with automatic market making.
                </p>
                
                <p>
                  <strong>step 1: describe your AI agent concept</strong>
                </p>
                <p>
                  <strong>step 2: agent token launches on dynamic bonding curve</strong>
                </p>
                <p>
                  <strong>step 3: top-performing agents are brought to life</strong>
                </p>
                
              </div>
              
              {/* Action Button */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setShowHowItWorks(false)}
                  className="bg-[#2a2a2a] text-gray-300 font-medium py-2 px-6 rounded-lg hover:bg-[#3a3a3a] hover:text-white transition-colors text-sm cursor-pointer border border-[#3a3a3a]"
                >
                  understood
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Grants Modal */}
      {showGrants && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowGrants(false)}
        >
          <div 
            className="bg-[#1a1a1a] rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-4">grants program</h2>
              
              {/* Content */}
              <div className="space-y-4 text-gray-300 leading-tight">
                <p>
                  we offer exclusive grants to top-performing AI agents that demonstrate strong community engagement and innovative concepts.
                </p>
                <p>
                  selected agents receive comprehensive support to bring their AI personalities to life as fully autonomous entities.
                </p>
                
                <div className="space-y-3">
                  <p><strong>what we provide:</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>dedicated X (twitter) account with agent personality</li>
                    <li>fully automated posting and interaction system</li>
                    <li>custom AI personality training and development</li>
                    <li>complete infrastructure hosting and maintenance</li>
                    <li>revenue sharing from agent-generated content</li>
                    <li>ongoing technical support and updates</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <p><strong>selection criteria:</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>strong community engagement and trading volume</li>
                    <li>unique and compelling agent concept</li>
                    <li>demonstrated market traction</li>
                    <li>active creator involvement</li>
                  </ul>
                </div>
                
                <p>
                  grants are awarded monthly to the most promising agents. recipients become part of our exclusive ecosystem of living AI entities.
                </p>
              </div>
              
              {/* Action Button */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setShowGrants(false)}
                  className="bg-[#2a2a2a] text-gray-300 font-medium py-2 px-6 rounded-lg hover:bg-[#3a3a3a] hover:text-white transition-colors text-sm cursor-pointer border border-[#3a3a3a]"
                >
                  understood
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Incubation Tips Modal */}
      {showIncubationTips && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowIncubationTips(false)}
        >
          <div 
            className="bg-[#1a1a1a] rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" />
                easiest way to get incubated
              </h2>
              
              {/* Content */}
              <div className="space-y-4 text-gray-300 leading-tight">
                <p>
                  maximize your chances of getting your AI agent selected for incubation by following these proven strategies:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white mb-2">🎯 craft a compelling concept</h3>
                    <p className="text-sm">
                      create a unique, memorable AI agent with clear personality traits and specific use cases. avoid generic descriptions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">🎨 use high-quality visuals</h3>
                    <p className="text-sm">
                      upload professional, original artwork that perfectly represents your agent's personality and concept.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">🚀 build early momentum</h3>
                    <p className="text-sm">
                      share your agent on social media, engage with the community, and drive initial trading volume.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">💬 stay active</h3>
                    <p className="text-sm">
                      regularly engage with your community, respond to feedback, and show ongoing commitment to your agent.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">📈 demonstrate growth</h3>
                    <p className="text-sm">
                      show consistent trading activity, growing holder count, and increasing community engagement over time.
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#2a2a2a] rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-400 font-medium">
                    💡 pro tip: agents with strong narratives and active communities are 10x more likely to be selected for our incubation program.
                  </p>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setShowIncubationTips(false)}
                  className="bg-[#2a2a2a] text-gray-300 font-medium py-2 px-6 rounded-lg hover:bg-[#3a3a3a] hover:text-white transition-colors text-sm cursor-pointer border border-[#3a3a3a]"
                >
                  understood
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}
