
import React, { useState, useEffect, useRef } from 'react';
import { Booking } from '../types';

const MyPageListItem = ({ icon, label, hasArrow = true }: { icon: React.ReactNode, label: string, hasArrow?: boolean }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50">
        <div className="flex items-center">
            <div className="w-6 h-6 mr-4 text-gray-400">{icon}</div>
            <span className="text-gray-200">{label}</span>
        </div>
        {hasArrow && (
             <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        )}
    </div>
);

const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
        <img src={booking.photographerImage} alt={booking.photographerName} className="w-16 h-16 rounded-md object-cover" />
        <div className="ml-4 flex-grow">
            <p className="font-bold text-gray-100">{booking.photographerName}</p>
            <p className="text-sm text-gray-300">{booking.date}</p>
            <p className="text-sm text-gray-400">{booking.time}</p>
        </div>
        <div className="text-right">
             <p className="font-semibold text-gray-100">{booking.price.toLocaleString()}원</p>
             <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">예약완료</span>
        </div>
    </div>
)

const ReviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-3.152a.563.563 0 0 0-.652 0l-4.725 3.152a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.242 1.434l-1.005.827c-.292.24-.437.613-.43.992a6.759 6.759 0 0 1 0 1.905c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.242 1.434l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .242-1.434l1.005-.827c.292-.24.437.613.43-.992a6.759 6.759 0 0 1 0-1.905c.007-.378-.138-.75-.43-.99l-1.005-.828a1.125 1.125 0 0 1-.242-1.434l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white"><path d="M1 8a2 2 0 0 1 2-2h1.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 9.07 3h1.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 15.07 6H17a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /><path d="M10.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>;

const DEFAULT_PROFILE_IMAGE = "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=300";

export const MyPageScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load bookings and profile image from localStorage when the component mounts
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings.reverse()); // Show most recent first

    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        setProfileImage(storedImage);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              setProfileImage(base64String);
              localStorage.setItem('profileImage', base64String);
          };
          reader.readAsDataURL(file);
      }
      setIsModalOpen(false);
  };
  
  const handleChooseFromLibrary = () => fileInputRef.current?.click();
  const handleTakePhoto = () => cameraInputRef.current?.click();
  
  const handleRemovePhoto = () => {
      setProfileImage(DEFAULT_PROFILE_IMAGE);
      localStorage.removeItem('profileImage');
      setIsModalOpen(false);
  }

  return (
    <>
      <div className="h-full bg-gray-900 overflow-y-auto">
        <header className="bg-gray-800 p-4 border-b border-gray-700 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-center text-white">마이페이지</h1>
        </header>
        <main className="p-4">
          {/* Profile Section */}
          <div className="flex items-center p-4 bg-gray-800 rounded-xl mb-6">
              <button onClick={() => setIsModalOpen(true)} className="relative" aria-label="프로필 사진 변경">
                  <img 
                      src={profileImage}
                      alt="User profile"
                      className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-fuchsia-600 rounded-full p-1 border-2 border-gray-800 flex items-center justify-center">
                    <CameraIcon />
                  </div>
              </button>
              <div className="ml-4">
                  <h2 className="text-lg font-bold text-gray-100">홍길동</h2>
                  <p className="text-sm text-gray-400">gildong.hong@email.com</p>
              </div>
          </div>
          
          {/* Booking History Section */}
          <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-100 mb-3">예약 내역</h3>
              <div className="space-y-3">
                  {bookings.length > 0 ? (
                      bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
                  ) : (
                      <div className="text-center py-8 px-4 bg-gray-800 rounded-lg border border-gray-700">
                          <p className="text-gray-400">아직 예약 내역이 없습니다.</p>
                      </div>
                  )}
              </div>
          </div>


          {/* Menu List */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
              <MyPageListItem icon={<ReviewIcon />} label="작성한 후기" />
              <MyPageListItem icon={<SettingsIcon />} label="계정 설정" />
          </div>
        </main>
      </div>
      
      {/* Hidden File Inputs */}
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleImageChange} accept="image/*" capture="user" className="hidden" />
      
      {/* Profile Picture Modal */}
      {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
            aria-modal="true"
            role="dialog"
          >
              <div className="bg-gray-800 rounded-t-2xl w-full max-w-sm shadow-xl border-t border-gray-700" onClick={e => e.stopPropagation()}>
                  <div className="p-4 space-y-2">
                      <button onClick={handleChooseFromLibrary} className="w-full text-center text-lg p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-fuchsia-400 transition-colors">라이브러리에서 선택</button>
                      <button onClick={handleTakePhoto} className="w-full text-center text-lg p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-fuchsia-400 transition-colors">사진 찍기</button>
                      {profileImage !== DEFAULT_PROFILE_IMAGE && (
                          <button onClick={handleRemovePhoto} className="w-full text-center text-lg p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-red-500 transition-colors">현재 사진 삭제</button>
                      )}
                       <button onClick={() => setIsModalOpen(false)} className="w-full text-lg p-3 mt-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold text-white transition-colors">취소</button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
