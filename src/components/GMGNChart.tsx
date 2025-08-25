'use client';

import { useState } from 'react';

interface GMGNChartProps {
  tokenAddress: string;
  theme?: 'light' | 'dark';
  interval?: '1' | '5' | '15' | '1H' | '4H' | '1D';
  height?: number;
}

export default function GMGNChart({ 
  tokenAddress, 
  theme = 'light', 
  interval = '15',
  height = 400 
}: GMGNChartProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const chartUrl = `https://www.gmgn.cc/kline/sol/${tokenAddress}?theme=${theme}&interval=${interval}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="w-full bg-[#1a1a1a] rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium">Chart unavailable</p>
          <p className="text-sm">Unable to load price chart for this token</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-[#1a1a1a]" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-lg flex items-center justify-center z-10">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading chart...</p>
          </div>
        </div>
      )}
      <iframe
        src={chartUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ borderRadius: '8px' }}
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        className={isLoading ? 'opacity-0' : 'opacity-100'}
      />
      {/* Custom branding overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-t border-[#1a1a1a] flex items-center justify-center shadow-sm">
        <span className="text-sm font-medium text-gray-300">powered by incubate.gg</span>
      </div>
    </div>
  );
}
