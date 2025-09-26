
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Photographer, Review } from '../types';

// Redesigned Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const LoginIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const StarIcon = ({ filled, className = 'w-4 h-4' }: { filled: boolean, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-600'}`}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  );

// Category Icons
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const BodyProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const ConceptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a12.062 12.062 0 0 1-3.75 0M14.25 18v-5.25m0 0a6.01 6.01 0 0 0-1.5-.189m1.5.189a6.01 6.01 0 0 1 1.5-.189M12 5.25a3 3 0 0 0-3 3v3.75a3 3 0 0 0 3 3h.008a3 3 0 0 0 3-3V8.25a3 3 0 0 0-3-3H12Z" /></svg>;
const HanbokIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 3l-3 3v15h18V6l-3-3H6zm12 15H6v-3h12v3zm-3-6H9v3h6v-3zm0-6h-3v3h3V6z" /></svg>;
const WeddingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>;
const FamilyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1 4.5 0m-4.5 0a4.5 4.5 0 0 0-4.5 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 4.5h.008v.008H12v-.008Z" /></svg>;
const CoupleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1 4.5 0m-4.5 0a4.5 4.5 0 0 0-4.5 0M12 12.75a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" /></svg>;
const CreatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>;
const StudioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>;
const SnapshotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" /></svg>;

const categories = [
  { name: '기본프로필', icon: <ProfileIcon />, key: 'profile' },
  { name: '바디프로필', icon: <BodyProfileIcon />, key: 'body-profile' },
  { name: '컨셉촬영', icon: <ConceptIcon />, key: 'concept' },
  { name: '한복촬영', icon: <HanbokIcon />, key: 'hanbok' },
  { name: '웨딩촬영', icon: <WeddingIcon />, key: 'wedding' },
  { name: '가족/돌잔치', icon: <FamilyIcon />, key: 'family' },
  { name: '커플 촬영', icon: <CoupleIcon />, key: 'couple' },
  { name: '크리에이터', icon: <CreatorIcon />, key: 'creator' },
  { name: '스튜디오 대여', icon: <StudioIcon />, key: 'studio' },
  { name: '스냅촬영', icon: <SnapshotIcon />, key: 'snapshot' },
];

const bannerContent = [
    {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3",
        title: "가장 빛나는 순간의 기록",
        subtitle: "플래시의 웨딩 전문 작가와 함께 평생 간직할 추억을 만드세요.",
    },
    {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3",
        title: "나를 가장 나답게,",
        subtitle: "당신의 숨겨진 매력을 담아내는 프로필 사진을 경험하세요.",
    },
    {
        src: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3",
        title: "일상 속 특별한 순간들",
        subtitle: "사랑하는 사람과의 모든 순간이 작품이 됩니다.",
    },
];

const PhotographerSliderCard = ({ photographer }: { photographer: Photographer }) => {
  const { setView, setSelectedPhotographerId } = useAppContext();

  const handleClick = () => {
    setSelectedPhotographerId(photographer.id);
    setView('photographer-detail');
  };

  return (
    <button onClick={handleClick} className="flex-shrink-0 w-28 text-center group">
        <img src={photographer.profileImage} alt={photographer.name} className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-700 group-hover:border-fuchsia-500 transition-colors" />
        <h3 className="mt-2 text-sm font-bold text-gray-200 truncate">{photographer.name}</h3>
        <p className="text-xs text-gray-400">{photographer.category}</p>
    </button>
  );
};

interface EnhancedReview extends Review {
    photographerName: string;
    photographerProfileImage: string;
}

const ReviewCard = ({ review }: { review: EnhancedReview }) => {
    return (
        <div className="flex-shrink-0 w-72 bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-700/50 flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                </div>
                <p className="text-gray-200 text-sm h-12 overflow-hidden text-ellipsis">"{review.comment}"</p>
            </div>
            <div className="flex items-center pt-3 border-t border-gray-700">
                <img src={review.photographerProfileImage} alt={review.photographerName} className="w-8 h-8 rounded-full object-cover mr-3" />
                <div>
                    <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-200">{review.author}</span>님이 남긴 후기
                    </p>
                    <p className="text-xs text-gray-500">{review.photographerName} 작가</p>
                </div>
            </div>
        </div>
    );
}


export const HomeScreen = () => {
  const { setView, setSelectedCategory, photographers } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setView('photographers');
  };

  const allReviews = useMemo(() => {
    const reviewsWithPhotographer = photographers.flatMap(photographer =>
        photographer.reviews.map(review => ({
            ...review,
            photographerName: photographer.name,
            photographerProfileImage: photographer.profileImage
        }))
    );
    return reviewsWithPhotographer.sort(() => 0.5 - Math.random());
  }, [photographers]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerContent.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className="bg-gray-900 text-white min-h-full">
      <header className="px-4 pt-0 flex items-center justify-between">
        <button className="p-2 hover:text-fuchsia-400" aria-label="Menu"><MenuIcon /></button>
        <h1 className="text-2xl font-bold tracking-wider text-fuchsia-400">FLASHY</h1>
        <button className="p-2 hover:text-fuchsia-400" aria-label="Login"><LoginIcon /></button>
      </header>
      
      <main className="p-4 space-y-8">
        {/* Search Bar */}
        <div className="relative">
            <input type="text" placeholder="어떤 작가를 찾으시나요?" className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><SearchIcon /></div>
        </div>

        {/* Hero Banner Slider */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl group">
             {bannerContent.map((item, index) => (
                <img key={item.src} src={item.src} alt={`Banner ${index + 1}`} className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: index === currentSlide ? 1 : 0 }} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <h2 className="text-xl font-bold drop-shadow-lg transition-all duration-500" key={`title-${currentSlide}`}>
                    {bannerContent[currentSlide].title}
                </h2>
                <p className="text-sm drop-shadow-lg transition-all duration-500" key={`subtitle-${currentSlide}`}>
                    {bannerContent[currentSlide].subtitle}
                </p>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
                {bannerContent.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-fuchsia-400 w-4' : 'bg-white/50 w-2'}`} aria-label={`Go to slide ${index + 1}`}></button>
                ))}
            </div>
        </div>

        {/* Category Menu Slider */}
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">카테고리</h2>
                 <button onClick={() => {}} className="text-sm text-fuchsia-400 font-semibold">전체보기</button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category.key}
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex-shrink-0 flex flex-col items-center justify-center space-y-2 w-20 text-center group"
                        aria-label={`Select ${category.name} category`}
                    >
                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-400 transition-all duration-200">
                            <div className="w-8 h-8">{category.icon}</div>
                        </div>
                        <span className="font-medium text-xs text-gray-300 group-hover:text-fuchsia-400 transition-colors">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Famous Photographers Slider */}
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">주목받는 작가</h2>
                 <button onClick={() => {}} className="text-sm text-fuchsia-400 font-semibold">전체보기</button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {photographers.map((photographer) => (
                    <PhotographerSliderCard key={photographer.id} photographer={photographer} />
                ))}
            </div>
        </div>

        {/* Customer Reviews Slider */}
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">생생한 이용 후기</h2>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {allReviews.map((review, index) => (
                    <ReviewCard key={`${review.id}-${index}`} review={review} />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};
