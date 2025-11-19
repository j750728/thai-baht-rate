import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ArrowDown, ArrowUp, MapPin, Menu, MoreVertical, ArrowUpRight, Banknote, DollarSign, List, Map as MapIcon, Navigation, Crown, Share, Download } from 'lucide-react';

// --- Web App 專用設定 ---
const WEB_APP_TITLE = "即時泰銖匯率";

// 分店座標 (模擬曼谷) - 用於前端補完座標資訊
const LOCATION_COORDS = {
  'Headquarter Rajdamri 1': { x: 50, y: 50 },
  'Vibhavadi 22': { x: 55, y: 25 },
  'The Mall Thaphra 3rd floor (Opp. Tisco Bank)': { x: 30, y: 65 },
  'Central Rama 2 G floor (Opp. Cafe Amazon)': { x: 25, y: 85 },
  'Gaysorn Centre 2nd floor (Chitlom BTS Skywalk)': { x: 52, y: 49 },
  'The Platinum Fashion Mall 1st floor (Parking Lot Entrance)': { x: 51, y: 48 },
  'MBK Center 3rd floor (National Stadium BTS Skywalk)': { x: 47, y: 51 },
  'Central World 1st Floor, Eden Zone, near Pirom Specialty Bar': { x: 51, y: 50 },
  'Central Ramindra 3rd floor (Opp. Amazon)': { x: 75, y: 10 },
  'Central Ladprao, 2nd Floor, Banking Zone, near Aeon': { x: 55, y: 20 },
  'Central Westgate, 3rd Floor, Banking Zone, opposite TTB Bank': { x: 10, y: 20 },
  'Central Westville, 1st Floor (Zone Semi Outdoor)': { x: 15, y: 35 },
  'Terminal 21 Asok G Floor': { x: 60, y: 52 },
  'Central Chidlom G Floor (Nearby Tops Food Hall)': { x: 54, y: 50 },
  'Ratchadamri 1': { x: 50, y: 51 },
  'MRT Phahon Yothin': { x: 56, y: 19 },
  'MRT Phra Ram 9': { x: 65, y: 45 },
  'MRT Sukhumvit': { x: 61, y: 53 },
  'One Bangkok': { x: 53, y: 58 },
  'Silom': { x: 48, y: 62 },
  'Suvarnabhumi Airport': { x: 90, y: 75 },
  'Central World': { x: 51, y: 51 },
  'BTS Chit Lom': { x: 53, y: 49 },
  'BTS Asok': { x: 60, y: 53 }
};

// Map Component
const MapView = ({ allRates, activeCurrency }) => {
    const maxRate = Math.max(...allRates.map(r => r.rate));
    const locationMap = new Map();
    allRates.forEach(r => {
        const isBest = r.rate === maxRate;
        if (!locationMap.has(r.location) || isBest) {
             locationMap.set(r.location, { ...r, isBest: locationMap.get(r.location)?.isBest || isBest });
        }
    });
    const locations = Array.from(locationMap.values());
    const [selectedLoc, setSelectedLoc] = useState(null);

    return (
        <div className="w-full h-full bg-[#e5e3df] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-0 left-[35%] w-[10%] h-full bg-[#aadaff] opacity-50 transform -skew-x-12 border-l-4 border-r-4 border-[#fff]"></div>

            {locations.map((loc) => (
                <button
                    key={`pin-${loc.id}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedLoc(loc); }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:z-50 ${loc.isBest ? 'z-30 scale-110' : 'z-10 hover:scale-110'}`}
                    style={{ left: `${loc.lng}%`, top: `${loc.lat}%` }}
                >
                    {loc.isBest ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
                            <div className="relative bg-yellow-500 p-1.5 rounded-full border-2 border-white shadow-lg">
                                <Crown className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-yellow-500"></div>
                        </div>
                    ) : (
                        <>
                            <MapPin className={`w-8 h-8 drop-shadow-md ${loc.brand === 'green' ? 'text-[#009E60] fill-[#009E60]' : 'text-[#F58220] fill-[#F58220]'}`} stroke="white" strokeWidth={1.5} />
                            <div className={`w-2 h-1 mx-auto bg-black/20 rounded-full blur-[1px]`}></div>
                        </>
                    )}
                </button>
            ))}

            {/* Current Location Mock */}
            <div className="absolute top-[55%] left-[48%] z-20 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="w-20 bg-white/90 backdrop-blur text-[10px] text-center rounded-md shadow-sm absolute -bottom-8 left-1/2 -translate-x-1/2 px-1 py-0.5 font-bold text-blue-600">
                    目前位置
                </div>
            </div>

            {selectedLoc && (
                <div className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl z-50 animate-in slide-in-from-bottom-4 border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 pr-6">{selectedLoc.location}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${selectedLoc.brand === 'green' ? 'bg-[#009E60]' : 'bg-[#F58220]'}`}>
                                    {selectedLoc.brand === 'green' ? 'SuperRich Thailand' : 'SuperRich 1965'}
                                </div>
                                {selectedLoc.isBest && (
                                    <span className="text-[10px] bg-yellow-500 text-white px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <Crown className="w-3 h-3 fill-white" /> 最佳匯率
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setSelectedLoc(null)} className="text-slate-400 hover:text-slate-600">
                            <ArrowDown className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400">當前匯率 ({selectedLoc.currency})</span>
                            <span className="text-xl font-black text-slate-800">{selectedLoc.rate}</span>
                        </div>
                        <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95">
                            <Navigation className="w-4 h-4" /> 導航
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
  const [viewMode, setViewMode] = useState('list');
  const [rates, setRates] = useState([]); // 統一存放所有匯率
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [activeBrand, setActiveBrand] = useState('green');

  const [sortConfig, setSortConfig] = useState({
    green: 'desc',
    orange: 'desc'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  
  // Touch swipe handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
        // 呼叫我們建立的 API
        const response = await fetch('/api/rates');
        if (!response.ok) throw new Error('Failed to fetch');
        
        let data = await response.json();
        
        // 前端補上座標資訊 (如果後端沒給)
        data = data.map(item => ({
            ...item,
            lat: item.lat || LOCATION_COORDS[item.location]?.y || 50,
            lng: item.lng || LOCATION_COORDS[item.location]?.x || 50
        }));

        setRates(data);
        
        const now = new Date();
        const timeString = now.toLocaleString('zh-TW', { 
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false 
        }).replace(/\//g, '/');
        setLastUpdated(timeString);

    } catch (error) {
        console.error("Error fetching rates:", error);
        // 錯誤處理：這裡可以顯示錯誤提示
    } finally {
        setIsLoading(false);
    }
  };

  const getDenominationValue = (denom) => {
    const match = denom.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const applySort = (data, direction) => {
    return [...data].sort((a, b) => {
       if (Math.abs(b.rate - a.rate) > 0.0001) {
        return direction === 'desc' ? b.rate - a.rate : a.rate - b.rate;
      }
      const aIsHQ = a.location.includes('Headquarter') || a.location.includes('Head Office') || a.location.includes('Ratchadamri') || a.location.includes('Silom');
      const bIsHQ = b.location.includes('Headquarter') || b.location.includes('Head Office') || b.location.includes('Ratchadamri') || b.location.includes('Silom');
      if (aIsHQ && !bIsHQ) return -1;
      if (!aIsHQ && bIsHQ) return 1;
      return a.location.localeCompare(b.location);
    });
  };

  const toggleSort = (brand) => {
    const currentDir = sortConfig[brand];
    const newDir = currentDir === 'desc' ? 'asc' : 'desc';
    setSortConfig(prev => ({ ...prev, [brand]: newDir }));
  };

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50 && activeBrand === 'green') setActiveBrand('orange');
    if (distance < -50 && activeBrand === 'orange') setActiveBrand('green');
  };

  // 匯率卡片元件
  const RateCard = ({ item, isBest }) => {
    const colorClass = item.brand === 'green' ? 'bg-[#009E60]' : 'bg-[#F58220]';
    const textColorClass = item.brand === 'green' ? 'text-[#009E60]' : 'text-[#F58220]';
    
    return (
      <div className={`flex justify-between items-center p-4 mb-3 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all relative overflow-hidden group ${isBest ? 'border-yellow-400 ring-1 ring-yellow-400/50 bg-yellow-50/30' : 'border-slate-100'}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorClass}`}></div>
        <div className="flex items-center gap-3 pl-3 flex-1 min-w-0"> 
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.brand === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
               {isBest ? <Crown className="w-5 h-5 fill-current" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                    {isBest && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-400 text-white flex items-center gap-0.5 shadow-sm">
                            <Crown className="w-3 h-3 fill-white" /> BEST
                        </span>
                    )}
                </div>
                <div className="flex items-start gap-1 text-sm font-bold text-slate-800 leading-tight">
                    <span className="whitespace-normal line-clamp-2">{item.location}</span>
                    {(item.location.includes('Headquarter') || item.location.includes('Head Office') || item.location.includes('Ratchadamri') || item.location.includes('Silom')) && (
                    <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full shrink-0 mt-0.5">HQ</span>
                    )}
                </div>
            </div>
        </div>
        <div className="text-right shrink-0 ml-3">
            <div className={`text-2xl font-black tracking-tight ${isBest ? 'text-slate-900 scale-110 origin-right' : textColorClass}`}>
            {item.rate.toFixed(item.currency === 'TWD' ? 3 : 2)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded inline-block mt-1">
            THB BUY
            </div>
        </div>
      </div>
    );
  };

  const renderGroupedRates = () => {
    const allRates = rates.filter(r => r.currency === activeCurrency);
    const globalMaxRateForCurrency = Math.max(...allRates.map(r => r.rate));
    
    const displayRates = rates.filter(r => r.currency === activeCurrency && r.brand === activeBrand);
    
    const uniqueDenominations = Array.from(new Set(displayRates.map(r => r.denomination)));
    uniqueDenominations.sort((a, b) => getDenominationValue(b) - getDenominationValue(a));

    const brandColorBg = activeBrand === 'green' ? 'bg-[#009E60]' : 'bg-[#F58220]';
    
    return (
      <div className="px-4 pt-4 pb-24">
        {uniqueDenominations.map(denom => {
          let ratesInGroup = displayRates.filter(r => r.denomination === denom);
          if (ratesInGroup.length === 0) return null;
          
          ratesInGroup = applySort(ratesInGroup, sortConfig[activeBrand]);

          return (
            <div key={denom} className="mb-8">
              <div className="flex items-center gap-2 mb-3 pl-1">
                 <div className={`w-1.5 h-6 ${brandColorBg} rounded-full`}></div>
                 <h3 className="text-lg font-black text-slate-700 tracking-wider">
                    面額: {denom}
                 </h3>
                 <div className="h-px bg-slate-200 flex-1 ml-3"></div>
              </div>
              <div className="space-y-2">
                {ratesInGroup.map(rate => (
                  <RateCard 
                    key={rate.id} 
                    item={rate} 
                    isBest={rate.rate === globalMaxRateForCurrency} 
                    colorClass="" 
                    textColorClass="" 
                  />
                ))}
              </div>
            </div>
          );
        })}
        {displayRates.length === 0 && (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-2">
                <Banknote className="w-8 h-8 opacity-20" />
                <span>{isLoading ? '載入中...' : '暫無此幣別匯率資訊'}</span>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col">
        {/* App Container */}
        <div className="w-full h-full max-w-md mx-auto bg-white shadow-2xl flex flex-col relative">
            
            {/* Top Bar */}
            {viewMode === 'list' && (
            <div className="bg-slate-900 text-white px-5 py-4 pb-4 shadow-lg shrink-0 z-30">
                <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-white/10 rounded-full"><Menu className="w-5 h-5 opacity-80" /></div>
                <h1 className="text-lg font-bold tracking-wider">{WEB_APP_TITLE}</h1>
                <div className="p-2 bg-white/10 rounded-full"><Share className="w-5 h-5 opacity-80" /></div>
                </div>
                
                <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-medium">最後更新</p>
                    <p className="font-mono text-sm font-bold flex items-center gap-2 text-blue-200">
                    {lastUpdated}
                    {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-white" />}
                    </p>
                </div>
                <button 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/50 border border-indigo-400/30"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    重新整理
                </button>
                </div>

                <div className="flex p-1 bg-slate-800 rounded-xl">
                <button 
                    onClick={() => setActiveCurrency('USD')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeCurrency === 'USD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <DollarSign className="w-4 h-4" /> USD 美金
                </button>
                <button 
                    onClick={() => setActiveCurrency('TWD')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeCurrency === 'TWD' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <span className="text-xs">NT$</span> TWD 台幣
                </button>
                </div>
            </div>
            )}

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50">
            {viewMode === 'list' ? (
                <div 
                className="flex-1 overflow-y-auto bg-slate-50 scrollbar-hide relative flex flex-col"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                >
                {/* 品牌切換 Tabs */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                    <div className="flex">
                    <button onClick={() => setActiveBrand('green')} className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-colors relative ${activeBrand === 'green' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${activeBrand === 'green' ? 'bg-[#009E60]' : 'bg-slate-300'}`}></div>
                        <span className={`text-sm font-bold ${activeBrand === 'green' ? 'text-[#009E60]' : 'text-slate-400'}`}>SuperRich Thailand</span>
                        </div>
                        {activeBrand === 'green' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009E60]"></div>}
                    </button>
                    <button onClick={() => setActiveBrand('orange')} className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-colors relative ${activeBrand === 'orange' ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${activeBrand === 'orange' ? 'bg-[#F58220]' : 'bg-slate-300'}`}></div>
                        <span className={`text-sm font-bold ${activeBrand === 'orange' ? 'text-[#F58220]' : 'text-slate-400'}`}>SuperRich 1965</span>
                        </div>
                        {activeBrand === 'orange' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F58220]"></div>}
                    </button>
                    </div>
                    <div className="flex justify-end items-center px-4 py-2 bg-slate-50/80 text-xs border-b border-slate-100">
                    <button onClick={() => toggleSort(activeBrand)} className="flex items-center gap-1 text-slate-600 font-bold hover:text-indigo-600 transition-colors active:scale-95">
                        {sortConfig[activeBrand] === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                        {sortConfig[activeBrand] === 'desc' ? '匯率高→低' : '匯率低→高'}
                    </button>
                    </div>
                </div>

                {renderGroupedRates()}
                </div>
            ) : (
                <MapView allRates={rates.filter(r => r.currency === activeCurrency)} activeCurrency={activeCurrency} />
            )}
            </div>

            {/* Bottom Navigation */}
            <div className="bg-white border-t border-slate-200 h-[80px] px-8 flex justify-between items-start pt-4 z-40 pb-safe">
            <button onClick={() => setViewMode('list')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'list' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <List className="w-6 h-6" strokeWidth={viewMode === 'list' ? 3 : 2} />
                <span className="text-[10px] font-bold">列表</span>
            </button>
            <div className="w-px h-8 bg-slate-100"></div>
            <button onClick={() => setViewMode('map')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'map' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <MapIcon className="w-6 h-6" strokeWidth={viewMode === 'map' ? 3 : 2} />
                <span className="text-[10px] font-bold">地圖</span>
            </button>
            </div>

        </div>
    </div>
  );
};

export default App;