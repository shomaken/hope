import React, { useState, useEffect, useCallback } from 'react';

function App() {
     const [data, setData] = useState({
     price: 'Loading...',
     marketCap: 'Loading...',
     volume: 'Loading...',
     donationAmount: 'Loading...'
   });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAPIHealthy, setIsAPIHealthy] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState({});
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastSuccessfulData, setLastSuccessfulData] = useState(null);


  const contractAddress = '3ofiPaQdD6GcspNXSk6xQqB1wzEtJALikfcSmeqqBAGS';
  const walletAddress = 'HgumbJ177nwwbSXApgXdv6vZQeW1pwehQbjzqdNRwDTy';
  
  // Detect mobile device for performance optimization
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    return '$' + value.toLocaleString();
  };



  const fetchLiveData = useCallback(async () => {
    setApiCallCount(prev => prev + 1);
    
    try {
      console.log(`API Call #${apiCallCount + 1} - Fetching data...`);
      
      // Fetch Dexscreener data (public API, no key required)
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const dexData = await response.json();
      console.log('Dexscreener API Response:', dexData);
      
      // Simplified wallet balance fetch (removed for mobile performance)
      let walletBalance = 0;
      
             if (dexData && dexData.pairs && dexData.pairs.length > 0) {
         console.log(`📊 Found ${dexData.pairs.length} trading pairs`);
         
                   // Calculate TOTAL COMBINED VOLUME from ALL pairs
          let totalVolume24h = 0;
          
          dexData.pairs.forEach((pair, index) => {
            let pairVolume = 0;
            if (pair.volume && pair.volume.h24) {
              pairVolume = parseFloat(pair.volume.h24);
            } else if (pair.volume24h) {
              pairVolume = parseFloat(pair.volume24h);
            } else if (pair.volumeUsd24h) {
              pairVolume = parseFloat(pair.volumeUsd24h);
            }
            
            totalVolume24h += pairVolume;
            
            console.log(`Pair ${index}: ${pair.dexId} - $${pairVolume.toLocaleString()}`);
          });
         
                   console.log('💯 TOTAL COMBINED VOLUME:', totalVolume24h);
          

          
          // Use the highest volume pair for price and market cap
          const bestPair = dexData.pairs.sort((a, b) => {
            const volumeA = parseFloat(a.volume?.h24 || 0);
            const volumeB = parseFloat(b.volume?.h24 || 0);
            return volumeB - volumeA;
          })[0];
         
         // Update price (from highest volume pair)
         const price = parseFloat(bestPair.priceUsd) || 0;
         
         // Update market cap (from highest volume pair)
         const marketCap = parseFloat(bestPair.fdv || bestPair.marketCap) || 0;
         
                   // Use TOTAL COMBINED VOLUME (removed unused variable)
         
         
        
         // Calculate raised amount as 0.897% of 24h volume
         const percent = 0.00897; // 0.897%
         let donationAmount = totalVolume24h * percent;
         let donationSource = 'calculated (0.897% of 24h volume)';
         console.log('💰 DONATION CALCULATION: 24h Volume:', totalVolume24h, '× 0.897% =', donationAmount);
        
        // Also show wallet balance for verification
        console.log('🏆 WALLET BALANCE FOR VERIFICATION:', walletBalance);
        
                           const newData = {
            price: '$' + price.toFixed(8),
            marketCap: formatCurrency(marketCap),
            volume: formatCurrency(totalVolume24h),
            donationAmount: formatCurrency(donationAmount)
          };
        
        setData(newData);
        setIsLoading(false);
        setIsAPIHealthy(true);
        
                 // Store successful data
                   const successfulData = {
            price,
            marketCap,
            volume24h: totalVolume24h,
            donationAmount,
            timestamp: Date.now(),
            volumeSource: 'Dexscreener API (24h volume)',
            donationSource: donationSource,
            walletBalance: walletBalance
          };
        
        setLastSuccessfulData(successfulData);
        setDebugData(successfulData);
        
             } else {
         throw new Error('No pair data found in Dexscreener API response');
       }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsAPIHealthy(false);
      
             // If we have recent successful data, use it with a warning
       if (lastSuccessfulData && (Date.now() - lastSuccessfulData.timestamp) < 300000) { // 5 minutes cache
         console.log('Using cached data due to API error');
         setData({
           price: '$' + lastSuccessfulData.price.toFixed(8),
           marketCap: formatCurrency(lastSuccessfulData.marketCap),
           volume: formatCurrency(lastSuccessfulData.volume24h),
           donationAmount: formatCurrency(lastSuccessfulData.donationAmount)
         });
      } else {
        // Show error state
                 setData({
           price: 'Error',
           marketCap: 'Error',
           volume: 'Error',
           donationAmount: 'Error'
         });
      }
      
      setIsLoading(false);
    }
  }, [contractAddress, apiCallCount, lastSuccessfulData]);

  useEffect(() => {
    fetchLiveData();
    const updateInterval = isMobile ? 600000 : 300000; // 10 minutes on mobile, 5 minutes on desktop
    const interval = setInterval(fetchLiveData, updateInterval);
    
    return () => clearInterval(interval);
  }, [fetchLiveData, isMobile]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'd' || event.key === 'D') {
        setShowDebug(!showDebug);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showDebug]);

  return (
    <div className="App">
      <div className="container">
        <div className="api-status">
          <div className={`status-dot ${isAPIHealthy ? 'healthy' : 'unhealthy'}`}></div>
          <span>API {isAPIHealthy ? 'Connected' : 'Error'}</span>
        </div>
        
        <div className="header">
          <div className="logo">
            <img src="/logo.png" alt="HOPE Logo" />
          </div>
          <h1 className="title">$HOPE</h1>
          <p className="subtitle">Supporting Children Cancer Center of Lebanon</p>
        </div>
        
        <div className="data-grid">
          <div className="data-card">
            <div className="data-label">Token Price</div>
            <div className={`data-value ${isLoading ? 'loading' : ''}`}>
              {data.price}
            </div>
          </div>
          
          <div className="data-card">
            <div className="data-label">Market Cap</div>
            <div className={`data-value ${isLoading ? 'loading' : ''}`}>
              {data.marketCap}
            </div>
          </div>
          
          <div className="data-card">
            <div className="data-label">24h Volume</div>
            <div className={`data-value ${isLoading ? 'loading' : ''}`}>
              {data.volume}
            </div>
          </div>
        </div>
        
        <div className="donation-tracker">
          <div className="donation-label">💝 Funds raised for CCCL</div>
          <div className={`donation-amount ${isLoading ? 'loading' : ''}`}>
            {data.donationAmount}
          </div>
        </div>
        
        <div className="actions">
          <a 
            href="https://bags.fm/3ofiPaQdD6GcspNXSk6xQqB1wzEtJALikfcSmeqqBAGS" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            💎 Buy $HOPE
          </a>
          <a 
            href="https://x.com/i/communities/1951384431601598665" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
          >
            🤝 Join Community
          </a>
        </div>
      </div>
      
      {showDebug && (
        <div className="debug-panel">
        <div><strong>🔧 Debug Panel (Press 'D' to toggle)</strong></div>
        <div><strong>📊 API Calls:</strong> {apiCallCount}</div>
        <div><strong>📈 Price:</strong> ${debugData.price || 'N/A'}</div>
        <div><strong>💰 Market Cap:</strong> {formatCurrency(debugData.marketCap || 0)}</div>
                 <div><strong>📈 24h Volume:</strong> {formatCurrency(debugData.volume24h || 0)}</div>
 
         <div style={{marginTop: '8px'}}><strong>🎯 Total Raised:</strong> {formatCurrency(debugData.donationAmount || 0)}</div>
         <div><strong>📊 Source:</strong> {debugData.donationSource || 'calculated'}</div>

        <div><strong>💼 Wallet Balance:</strong> {walletAddress}</div>
                 <div><strong>⏰ Update Frequency:</strong> {isMobile ? 'Every 10 minutes (mobile)' : 'Every 5 minutes (desktop)'}</div>
        <div><strong>🕒 Last Update:</strong> {debugData.timestamp ? new Date(debugData.timestamp).toLocaleTimeString() : 'N/A'}</div>
        </div>
      )}
    </div>
  );
}

export default App; 
