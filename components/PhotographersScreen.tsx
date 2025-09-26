
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Photographer, FilterOptions } from '../types';

// Star Icon for Ratings
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.681 3.462a1 1 0 0 0 .951.692h3.632c.712 0 1.008.972.454 1.414l-2.938 2.14a1 1 0 0 0-.364 1.118l1.11 3.843c.245.848-.691 1.558-1.442 1.118l-3.235-1.995a1 1 0 0 0-1.175 0l-3.235 1.995c-.751.44-1.687-.27-1.442-1.118l1.11-3.843a1 1 0 0 0-.364-1.118L2.044 8.452c-.554-.442-.258-1.414.454-1.414h3.632a1 1 0 0 0 .951-.692l1.681-3.462Z" clipRule="evenodd" />
  </svg>
);

// Photographer Card Component
const PhotographerCard = ({ photographer }: { photographer: Photographer }) => {
  const { setView, setSelectedPhotographerId } = useAppContext();
  
  const handleCardClick = () => {
    setSelectedPhotographerId(photographer.id);
    setView('photographer-detail');
  };
  
  return (
    <div onClick={handleCardClick} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-fuchsia-500/20 hover:-translate-y-1">
      <img src={photographer.profileImage} alt={photographer.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-100">{photographer.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{photographer.location}</p>
        <div className="flex items-center mb-2">
          <StarIcon filled={true} />
          <span className="text-sm font-semibold text-gray-200 ml-1">{photographer.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-400 ml-2">({photographer.reviewCount})</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {photographer.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Filter Modal Component
const FilterModal = ({ isVisible, onClose, filters, setFilters, applyFilters }: { isVisible: boolean, onClose: () => void, filters: FilterOptions, setFilters: (f: FilterOptions) => void, applyFilters: () => void }) => {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-11/12 p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-white">필터</h2>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300">지역</label>
                        <select value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md">
                            <option value="all">전체</option>
                            <option value="서울">서울</option>
                            <option value="부산">부산</option>
                            <option value="제주">제주</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">작가 성별</label>
                         <div className="flex gap-2 mt-1">
                            <button onClick={() => setFilters({...filters, gender: 'all'})} className={`px-4 py-2 text-sm rounded-full transition-colors ${filters.gender === 'all' ? 'bg-fuchsia-600 text-white' : 'bg-gray-700 text-gray-300'}`}>전체</button>
                            <button onClick={() => setFilters({...filters, gender: 'male'})} className={`px-4 py-2 text-sm rounded-full transition-colors ${filters.gender === 'male' ? 'bg-fuchsia-600 text-white' : 'bg-gray-700 text-gray-300'}`}>남성</button>
                            <button onClick={() => setFilters({...filters, gender: 'female'})} className={`px-4 py-2 text-sm rounded-full transition-colors ${filters.gender === 'female' ? 'bg-fuchsia-600 text-white' : 'bg-gray-700 text-gray-300'}`}>여성</button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500">취소</button>
                    <button onClick={applyFilters} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-500">적용</button>
                </div>
            </div>
        </div>
    );
}

export const PhotographersScreen = () => {
  const { setView, selectedCategory, photographers, filters, setFilters: setGlobalFilters } = useAppContext();
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const filteredPhotographers = useMemo(() => {
    return photographers
      .filter(p => p.category === selectedCategory)
      .filter(p => filters.location === 'all' || p.location === filters.location)
      .filter(p => {
          if (filters.gender === 'all') return true;
          return (filters.gender === 'male' && p.gender === '남성') || (filters.gender === 'female' && p.gender === '여성');
      });
  }, [photographers, selectedCategory, filters]);

  const applyFilters = () => {
      setGlobalFilters(localFilters);
      setFilterVisible(false);
  }

  return (
    <div className="p-4 bg-gray-900 min-h-full text-gray-200">
       <header className="flex items-center mb-6">
        <button 
          onClick={() => setView('home')} 
          className="p-2 rounded-full hover:bg-gray-800"
          aria-label="홈으로 돌아가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-center flex-grow">{selectedCategory}</h1>
        <button onClick={() => { setLocalFilters(filters); setFilterVisible(true); }} className="p-2 hover:bg-gray-800 rounded-full" aria-label="필터 열기">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {filteredPhotographers.length > 0 ? (
          filteredPhotographers.map(p => <PhotographerCard key={p.id} photographer={p} />)
        ) : (
          <div className="col-span-full text-center text-gray-400 mt-16">
            <p>해당 조건의 작가를 찾을 수 없습니다.</p>
          </div>
        )}
      </main>
      <FilterModal 
        isVisible={isFilterVisible} 
        onClose={() => setFilterVisible(false)}
        filters={localFilters}
        setFilters={setLocalFilters}
        applyFilters={applyFilters}
      />
    </div>
  );
};