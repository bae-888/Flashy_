
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

type BookingStep = 'date' | 'confirm' | 'payment' | 'success';

// A simple calendar component
const Calendar = ({ selectedDate, onDateSelect }: { selectedDate: Date | null, onDateSelect: (date: Date) => void }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const today = new Date();
    today.setHours(0,0,0,0);

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < startDate; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isPast = date < today;

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => onDateSelect(date)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                        isSelected ? 'bg-fuchsia-600 text-white' :
                        isPast ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-gray-700 text-gray-200'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&lt;</button>
                <h3 className="font-bold text-white">{currentMonth.toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {renderDays()}
            </div>
        </div>
    );
};


export const BookingScreen = () => {
  const { setView, selectedPhotographer } = useAppContext();
  const [step, setStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const timeSlots = useMemo(() => ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"], []);

  const handleBack = () => {
    if (step === 'date') {
        setView('photographer-detail');
    } else if (step === 'confirm') {
        setStep('date');
    } else if (step === 'payment') {
        setStep('confirm');
    }
  };
  
  const handleBooking = () => {
    if (!selectedPhotographer || !selectedDate || !selectedTime) return;
    setStep('confirm');
  }

  const handlePayment = () => {
    // Simulate payment processing
    setStep('success');
    
    if (!selectedPhotographer || !selectedDate || !selectedTime) return;

    const newBooking = {
      id: new Date().toISOString(),
      photographerId: selectedPhotographer.id,
      photographerName: selectedPhotographer.name,
      photographerImage: selectedPhotographer.profileImage,
      date: selectedDate.toLocaleDateString('ko-KR'),
      time: selectedTime,
      price: selectedPhotographer.price
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

    setTimeout(() => {
        setView('my-page');
    }, 2500);
  }

  if (!selectedPhotographer) {
    return (
      <div className="p-4 text-center text-gray-400">
          작가 정보를 찾을 수 없습니다.
          <button onClick={() => setView('home')} className="text-fuchsia-400 mt-4">홈으로</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'date':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-lg mb-2 text-white">날짜 선택</h2>
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>
            {selectedDate && (
                <div>
                    <h2 className="font-bold text-lg mb-2 text-white">시간 선택</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-lg border text-sm transition-colors ${selectedTime === time ? 'bg-fuchsia-600 text-white border-fuchsia-600' : 'bg-gray-800 border-gray-600 text-gray-200'}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={handleBooking} disabled={!selectedDate || !selectedTime} className="w-full bg-fuchsia-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-fuchsia-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors">
                다음
            </button>
          </div>
        );
       case 'confirm':
        return (
            <div className="space-y-6">
                <h2 className="font-bold text-xl text-white">예약 정보를 확인해주세요</h2>
                
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    {/* Photographer Info */}
                    <div className="flex items-center pb-4 border-b border-gray-700">
                        <img src={selectedPhotographer.profileImage} alt={selectedPhotographer.name} className="w-14 h-14 rounded-full object-cover" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">선택한 작가</p>
                            <p className="font-bold text-lg text-white">{selectedPhotographer.name}</p>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-300">날짜</p>
                            <p className="font-semibold text-white">{selectedDate?.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-300">시간</p>
                            <p className="font-semibold text-white">{selectedTime}</p>
                        </div>
                    </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                     <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-lg">최종 결제 금액</p>
                        <p className="font-bold text-2xl text-fuchsia-400">{selectedPhotographer.price.toLocaleString()}원</p>
                    </div>
                </div>

                <button onClick={() => setStep('payment')} className="w-full bg-fuchsia-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-fuchsia-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                    결제하기
                </button>
            </div>
        );
      case 'payment':
        return (
           <div className="space-y-6">
                <h2 className="font-bold text-xl text-white">결제를 진행해주세요</h2>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 text-center">
                    <p className="text-gray-300">최종 결제 금액</p>
                    <p className="font-bold text-4xl text-fuchsia-400 my-2">{selectedPhotographer.price.toLocaleString()}원</p>
                </div>
                
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h3 className="font-semibold text-lg mb-3 text-white">결제 수단</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 border border-fuchsia-500 rounded-lg flex items-center bg-fuchsia-500/10 text-white">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span className="font-semibold">신용카드</span>
                        </button>
                        <button className="w-full text-left p-3 border border-gray-700 rounded-lg flex items-center hover:bg-gray-700 text-gray-300">
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                            <span>다른 결제수단 추가</span>
                        </button>
                    </div>
                     <p className="text-xs text-center text-gray-500 mt-4">실제 결제는 진행되지 않습니다.</p>
                </div>

                <button onClick={handlePayment} className="w-full bg-fuchsia-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-fuchsia-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                    {selectedPhotographer.price.toLocaleString()}원 결제
                </button>
            </div>
        );
      case 'success':
        return (
            <div className="text-center flex flex-col items-center justify-center h-full">
                <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-xl font-bold text-white">예약 완료!</h2>
                <p className="text-gray-300 mt-2">예약이 성공적으로 완료되었습니다.</p>
                 <p className="text-gray-400 text-sm mt-1">마이페이지로 이동합니다.</p>
            </div>
        );
    }
  }
  
  return (
    <div className="p-4 h-full flex flex-col bg-gray-900 text-gray-200">
      <header className="flex-shrink-0 flex items-center mb-6">
        <button 
          onClick={handleBack} 
          className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-0"
          aria-label="뒤로가기"
          disabled={step === 'success'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-center flex-grow mr-8 text-white">예약 및 결제</h1>
      </header>
      <main className="flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};