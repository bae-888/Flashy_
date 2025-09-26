
import React from 'react';
import { useAppContext } from './context/AppContext';
import { HomeScreen } from './components/HomeScreen';
import { PhotographersScreen } from './components/PhotographersScreen';
import { ChatScreen } from './components/ChatScreen';
import { MyPageScreen } from './components/MyPageScreen';
import { BottomNav } from './components/BottomNav';
import { PhotographerDetailScreen } from './components/PhotographerDetailScreen';
import { BookingScreen } from './components/BookingScreen';

export const App = () => {
  const { view } = useAppContext();

  const renderView = () => {
    switch (view) {
      case 'photographers':
        return <PhotographersScreen />;
      case 'photographer-detail':
        return <PhotographerDetailScreen />;
      case 'booking':
          return <BookingScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'my-page':
        return <MyPageScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };
  
  // Show bottom nav only on the main top-level screens
  const showBottomNav = view === 'home' || view === 'chat' || view === 'my-page';

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black font-sans">
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-gray-900 text-gray-200 rounded-3xl shadow-2xl shadow-fuchsia-500/20 overflow-hidden flex flex-col relative">
        {/* Phone Notch */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex items-center justify-center z-20">
            <div className="w-24 h-5 bg-black rounded-b-xl"></div>
        </div>
        
        {/* App Content */}
        <div className="flex-grow overflow-y-auto pt-8">
            {renderView()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};