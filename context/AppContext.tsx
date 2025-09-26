import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { AppContextType, View, Photographer, FilterOptions } from '../types';

// Mock Data
const MOCK_PHOTOGRAPHERS: Photographer[] = [
  {
    id: 1,
    name: '김민준',
    category: '기본프로필',
    location: '서울',
    rating: 4.9,
    reviewCount: 120,
    tags: ['#인생샷', '#자연광', '#감성사진'],
    bio: '자연스러운 순간을 포착하는 포토그래퍼, 김민준입니다. 당신의 가장 빛나는 순간을 담아드립니다.',
    price: 150000,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    gender: '남성',
    portfolio: [
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600', description: '강남 스튜디오 촬영' },
      { id: 2, imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600', description: '야외 프로필' },
      { id: 3, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600', description: '배우 프로필' },
    ],
    reviews: [
      { id: 1, author: '박서연', rating: 5, comment: '정말 편안하게 해주셔서 인생샷 건졌어요!', date: '2023-10-15' },
      { id: 2, author: '이정훈', rating: 5, comment: '결과물 퀄리티가 대박입니다. 추천해요!', date: '2023-10-12' },
    ],
  },
  {
    id: 2,
    name: '이수아',
    category: '바디프로필',
    location: '부산',
    rating: 4.8,
    reviewCount: 85,
    tags: ['#헬스', '#운동', '#조명장인'],
    bio: '당신의 노력을 가장 아름답게 기록합니다. 바디프로필 전문 포토그래퍼 이수아입니다.',
    price: 350000,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
    gender: '여성',
    portfolio: [
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600', description: '피트니스 센터' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1581009137052-c0a72a072723?q=80&w=600', description: '요가 프로필' },
    ],
    reviews: [
      { id: 1, author: '최지우', rating: 5, comment: '조명을 정말 잘 쓰셔서 몸이 훨씬 좋아보여요!', date: '2023-09-20' },
    ],
  },
   {
    id: 3,
    name: '박지훈',
    category: '웨딩촬영',
    location: '제주',
    rating: 5.0,
    reviewCount: 210,
    tags: ['#제주스냅', '#데이트스냅', '#감성'],
    bio: '두 분의 가장 행복한 순간을 영화처럼 담아드립니다. 제주 웨딩스냅 전문 박지훈입니다.',
    price: 800000,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    gender: '남성',
    portfolio: [
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1523438943934-ed1395f5434e?q=80&w=600', description: '제주 해변 웨딩' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1597388223321-4f19b01d3c8c?q=80&w=600', description: '숲속 웨딩' },
        { id: 3, imageUrl: 'https://images.unsplash.com/photo-1515934751635-c8a5b36c16c8?q=80&w=600', description: '노을 웨딩 촬영' },
    ],
    reviews: [
      { id: 1, author: '김예신', rating: 5, comment: '사진작가님 덕분에 평생 잊지 못할 추억 만들었어요. 결과물은 말할 것도 없구요!', date: '2023-10-05' },
    ],
  },
  {
    id: 4,
    name: '정하윤',
    category: '기본프로필',
    location: '서울',
    rating: 4.7,
    reviewCount: 95,
    tags: ['#증명사진', '#개인화보', '#가성비'],
    bio: '정형화된 프로필이 아닌, 당신만의 개성을 담은 사진을 만듭니다.',
    price: 90000,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300',
    gender: '여성',
    portfolio: [
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=600', description: '컬러 증명사진' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1617127365659-1229f3c4d7e8?q=80&w=600', description: '스튜디오 개인화보' },
    ],
    reviews: [
      { id: 1, author: '백민재', rating: 5, comment: '가격도 합리적이고 결과물도 만족스러워요.', date: '2023-10-18' },
    ],
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    location: 'all',
    gender: 'all',
    priceRange: [0, 1000000],
  });

  const selectedPhotographer = useMemo(() => {
    if (selectedPhotographerId === null) return null;
    return MOCK_PHOTOGRAPHERS.find(p => p.id === selectedPhotographerId) || null;
  }, [selectedPhotographerId]);

  const value = {
    view,
    setView,
    selectedCategory,
    setSelectedCategory,
    photographers: MOCK_PHOTOGRAPHERS,
    selectedPhotographer,
    setSelectedPhotographerId,
    filters,
    setFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
