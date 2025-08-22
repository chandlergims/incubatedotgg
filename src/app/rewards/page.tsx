'use client';

export default function RewardsPage() {
  return (
    <div className="bg-white min-h-full">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Creator Rewards Comparison</h1>
            <p className="text-sm text-gray-500">See how much you can earn on different platforms</p>
          </div>

          {/* Platform Comparison */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Comparison</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              {/* Table Header */}
              <div className="grid grid-cols-6 border-b-2 border-dashed border-gray-300 pb-3 mb-4">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  PLATFORM
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  TRADING FEE
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  CREATOR ROYALTIES
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  PLATFORM ROYALTIES
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  CREATOR EARNS PER $1M
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  PLATFORM EARNS PER $1M
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4">
                <div className="grid grid-cols-6 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold" title="metpad.fun">
                      M
                    </div>
                    metpad.fun
                  </div>
                  <div className="text-sm font-mono text-gray-900">2%</div>
                  <div className="text-sm font-mono text-green-600 font-bold">1.8%</div>
                  <div className="text-sm font-mono text-gray-900">0.2%</div>
                  <div className="text-sm font-mono text-green-600 font-bold">$18,000</div>
                  <div className="text-sm font-mono text-gray-900">$2,000</div>
                </div>
                
                <div className="grid grid-cols-6 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                    <img src="/believe.jpg" alt="Believe.app" className="w-5 h-5 rounded object-cover" title="Believe.app" />
                    Believe.app
                  </div>
                  <div className="text-sm font-mono text-gray-900">2%</div>
                  <div className="text-sm font-mono text-blue-600">1.4%</div>
                  <div className="text-sm font-mono text-gray-900">0.6%</div>
                  <div className="text-sm font-mono text-blue-600">$14,000</div>
                  <div className="text-sm font-mono text-gray-900">$6,000</div>
                </div>
                
                <div className="grid grid-cols-6 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                    <img src="/bags-icon.png" alt="Bags.fm" className="w-5 h-5 rounded object-cover" title="Bags.fm" />
                    Bags.fm
                  </div>
                  <div className="text-sm font-mono text-gray-900">2%</div>
                  <div className="text-sm font-mono text-purple-600">1%</div>
                  <div className="text-sm font-mono text-gray-900">1%</div>
                  <div className="text-sm font-mono text-purple-600">$10,000</div>
                  <div className="text-sm font-mono text-gray-900">$10,000</div>
                </div>
                
                <div className="grid grid-cols-6 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                    <img src="/bonk_fun.png" alt="LetsBonk" className="w-5 h-5 rounded object-cover" title="LetsBonk" />
                    LetsBonk
                  </div>
                  <div className="text-sm font-mono text-gray-900">1%</div>
                  <div className="text-sm font-mono text-orange-600">0.1%</div>
                  <div className="text-sm font-mono text-gray-900">0.9%</div>
                  <div className="text-sm font-mono text-orange-600">$1,000</div>
                  <div className="text-sm font-mono text-gray-900">$9,000</div>
                </div>
                
                <div className="grid grid-cols-6 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                    <img src="/Pump-fun-logo.png" alt="Pump.fun" className="w-5 h-5 rounded object-cover" title="Pump.fun" />
                    Pump.fun
                  </div>
                  <div className="text-sm font-mono text-gray-900">0.3%</div>
                  <div className="text-sm font-mono text-red-600">0.05%</div>
                  <div className="text-sm font-mono text-gray-900">0.25%</div>
                  <div className="text-sm font-mono text-red-600">$500</div>
                  <div className="text-sm font-mono text-gray-900">$2,500</div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Fee Structure */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Our Fee Structure</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              {/* Table Header */}
              <div className="grid grid-cols-3 border-b-2 border-dashed border-gray-300 pb-3 mb-4">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  SERVICE
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  FEE
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  NOTES
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 py-2 border-b border-dashed border-gray-300">
                  <div className="text-sm text-gray-900 font-medium">Migration fee</div>
                  <div className="text-sm font-mono text-green-600 font-bold">FREE</div>
                  <div className="text-sm text-gray-600">No cost to migrate to Raydium</div>
                </div>
                
                <div className="grid grid-cols-3 py-2">
                  <div className="text-sm text-gray-900 font-medium">Creator royalties</div>
                  <div className="text-sm font-mono text-green-600 font-bold">0-90%</div>
                  <div className="text-sm text-gray-600">You choose your share (slider in create page)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Calculator */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Why Choose Our Platform?</h3>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-green-700">
                  🚀 FREE migration to Raydium
                </p>
                <p className="text-lg font-semibold text-green-700">
                  💰 Up to 90% of trading fees go to YOU
                </p>
                <p className="text-lg font-semibold text-green-700">
                  📈 Earn up to $18,000 per $1M in trading volume
                </p>
                <p className="text-base text-green-600 mt-4">
                  36x more than Pump.fun!
                </p>
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>
              Earnings are calculated based on trading fees collected after migration. Creator percentage is set during token creation.
              All fees are subject to change.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
