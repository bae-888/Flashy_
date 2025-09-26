
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const StarIcon = ({ filled, className = 'w-4 h-4' }: { filled: boolean, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-600'}`}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
  </svg>
);


export const PhotographerDetailScreen = () => {
    const { setView, selectedPhotographer } = useAppContext();
    const [activeTab, setActiveTab] = useState('portfolio');

    if (!selectedPhotographer) {
        return (
            <div className="p-4 text-center text-gray-400">
                <p>사진 작가 정보를 불러올 수 없습니다.</p>
                <button onClick={() => setView('photographers')} className="mt-4 text-fuchsia-400">목록으로 돌아가기</button>
            </div>
        );
    }
    
    const { name, profileImage, location, rating, reviewCount, tags, bio, portfolio, reviews, price } = selectedPhotographer;

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="p-4 space-y-4">
                        <h3 className="font-bold text-lg text-white">소개</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{bio}</p>
                    </div>
                );
            case 'reviews':
                return (
                    <div className="p-4 space-y-4">
                       <h3 className="font-bold text-lg mb-2 text-white">후기 ({reviewCount})</h3>
                       {reviews.map(review => (
                           <div key={review.id} className="border-b border-gray-800 pb-3">
                               <div className="flex items-center mb-1">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                                    <span className="font-bold ml-2 text-sm text-gray-200">{review.author}</span>
                               </div>
                               <p className="text-gray-300 text-sm">{review.comment}</p>
                               <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                           </div>
                       ))}
                    </div>
                );
            case 'portfolio':
            default:
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                        {portfolio.map(item => (
                            <div key={item.id} className="aspect-square">
                                <img src={item.imageUrl} alt={item.description} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                );
        }
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-200">
            <header className="absolute top-0 left-0 right-0 flex items-center p-4 bg-gray-900/80 backdrop-blur-sm z-20 pt-10">
                <button
                    onClick={() => setView('photographers')}
                    className="p-2 rounded-full hover:bg-gray-800"
                    aria-label="작가 목록으로 돌아가기"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </header>
            
            <div className="flex-grow overflow-y-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center p-6 pt-16">
                    <img src={profileImage} alt={name} className="w-24 h-24 rounded-full object-cover shadow-lg" />
                    <h1 className="text-2xl font-bold mt-4 text-white">{name}</h1>
                    <p className="text-gray-400 mt-1">{location}</p>
                    <div className="flex items-center mt-2">
                        <StarIcon filled={true} className="w-5 h-5" />
                        <span className="text-md font-bold text-gray-100 ml-1">{rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-400 ml-2">({reviewCount}개의 후기)</span>
                    </div>
                     <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {tags.map(tag => (
                            <span key={tag} className="text-sm bg-gray-800 text-gray-200 px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <nav className="flex justify-around">
                        <button onClick={() => setActiveTab('portfolio')} className={`py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'portfolio' ? 'border-b-2 border-fuchsia-500 text-white' : 'text-gray-400'}`}>포트폴리오</button>
                        <button onClick={() => setActiveTab('info')} className={`py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'info' ? 'border-b-2 border-fuchsia-500 text-white' : 'text-gray-400'}`}>소개</button>
                        <button onClick={() => setActiveTab('reviews')} className={`py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-fuchsia-500 text-white' : 'text-gray-400'}`}>후기</button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                {renderContent()}

            </div>

             {/* Sticky Booking Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">1시간 기준</p>
                        <p className="font-bold text-xl text-white">{price.toLocaleString()}원</p>
                    </div>
                    <button onClick={() => setView('booking')} className="bg-fuchsia-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-fuchsia-500 transition-colors">
                        예약하기
                    </button>
                </div>
            </div>
        </div>
    );
};