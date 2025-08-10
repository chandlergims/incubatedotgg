'use client';

interface CreatorRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatorRewardsModal({ isOpen, onClose }: CreatorRewardsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-black mb-4">creator rewards</h2>
          
          {/* Compact Comparison Table */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 text-[9px] font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                <div>PLATFORM</div>
                <div>TRADING FEE</div>
                <div>CREATOR ROYALTIES</div>
                <div>PLATFORM ROYALTIES</div>
                <div>CREATOR EARNS/$1M</div>
                <div>PLATFORM EARNS/$1M</div>
              </div>
              
              {/* Rows */}
              <div className="space-y-2 text-[9px]">
                <div className="grid grid-cols-6 gap-2 items-center py-1 bg-green-50 rounded">
                  <div className="flex items-center gap-1">
                    <img src="/Untitled design (60).png" alt="receipts.fun" className="w-3 h-3 rounded object-cover" />
                    <span className="font-medium text-[8px] text-green-800">receipts.fun</span>
                  </div>
                  <div className="font-mono text-gray-700">2%</div>
                  <div className="font-mono text-green-700 font-bold">1.8%</div>
                  <div className="font-mono text-gray-700">0.2%</div>
                  <div className="font-mono text-green-700 font-bold">$18,000</div>
                  <div className="font-mono text-gray-700">$2,000</div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 items-center py-1">
                  <div className="flex items-center gap-1">
                    <img src="/believe.jpg" alt="Believe" className="w-3 h-3 rounded object-cover" />
                    <span className="text-[8px]">Believe.app</span>
                  </div>
                  <div className="font-mono text-gray-600">2%</div>
                  <div className="font-mono text-blue-600">1.4%</div>
                  <div className="font-mono text-gray-600">0.6%</div>
                  <div className="font-mono text-blue-600">$14,000</div>
                  <div className="font-mono text-gray-600">$6,000</div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 items-center py-1">
                  <div className="flex items-center gap-1">
                    <img src="/bags-icon.png" alt="Bags" className="w-3 h-3 rounded object-cover" />
                    <span className="text-[8px]">Bags.fm</span>
                  </div>
                  <div className="font-mono text-gray-600">2%</div>
                  <div className="font-mono text-purple-600">1%</div>
                  <div className="font-mono text-gray-600">1%</div>
                  <div className="font-mono text-purple-600">$10,000</div>
                  <div className="font-mono text-gray-600">$10,000</div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 items-center py-1">
                  <div className="flex items-center gap-1">
                    <img src="/bonk_fun.png" alt="LetsBonk" className="w-3 h-3 rounded object-cover" />
                    <span className="text-[8px]">LetsBonk</span>
                  </div>
                  <div className="font-mono text-gray-600">1%</div>
                  <div className="font-mono text-orange-600">0.1%</div>
                  <div className="font-mono text-gray-600">0.9%</div>
                  <div className="font-mono text-orange-600">$1,000</div>
                  <div className="font-mono text-gray-600">$9,000</div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 items-center py-1">
                  <div className="flex items-center gap-1">
                    <img src="/Pump-fun-logo.png" alt="Pump.fun" className="w-3 h-3 rounded object-cover" />
                    <span className="text-[8px]">Pump.fun</span>
                  </div>
                  <div className="font-mono text-gray-600">0.3%</div>
                  <div className="font-mono text-red-600">0.05%</div>
                  <div className="font-mono text-gray-600">0.25%</div>
                  <div className="font-mono text-red-600">$500</div>
                  <div className="font-mono text-gray-600">$2,500</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="space-y-2 text-gray-800 text-sm leading-relaxed mb-4">
            <p>
              <strong>receipts.fun</strong> offers the highest creator rewards - up to 90% of trading fees generated from the LP.
            </p>
            <p>
              upon migration, the creator will receive a DAMM V2 LP position representing their share of the locked liquidity and can claim fees directly from <a href="https://app.meteora.ag/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">app.meteora.ag</a>.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center">
            <button 
              onClick={onClose}
              className="bg-blue-500 text-white font-semibold py-3 px-10 min-w-[200px] rounded-full hover:bg-blue-600 transition-colors text-base cursor-pointer"
            >
              understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
