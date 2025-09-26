
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatMessage } from '../types';

const initialMessages: ChatMessage[] = [
  { id: 1, sender: 'user', content: { type: 'text', text: '안녕하세요' } },
  { id: 2, sender: 'photographer', content: { type: 'text', text: '안녕하세요! 문의주셔서 감사합니다. 무엇을 도와드릴까요?' } },
  { id: 3, sender: 'user', content: { type: 'text', text: '안녕하세요! 제가 갖고갈 준비물이 있을까요?' } },
  { id: 4, sender: 'photographer', content: { type: 'text', text: '특별한 준비물은 없지만, 촬영하고 싶은 의상이나 소품을 가져오시면 더 멋진 사진을 남길 수 있어요.' } },
  { id: 5, sender: 'photographer', content: { type: 'text', text: '예약을 원하시면 아래에서 원하시는 날짜와 시간을 선택해주세요.' } },
  { id: 6, sender: 'photographer', content: { type: 'calendar' } },
];

const InlineCalendar = ({ selectedDate, onDateSelect }: { selectedDate: Date | null, onDateSelect: (date: Date) => void }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    return (
        <div className="bg-gray-700 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-7 text-center text-xs text-gray-400">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {Array(days[0].getDay()).fill(0).map((_, i) => <div key={`empty-${i}`}></div>)}
                {days.map(date => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateSelect(date)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors text-gray-200 ${
                                isSelected ? 'bg-fuchsia-600 text-white' : 'hover:bg-gray-600'
                            }`}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export const ChatScreen = () => {
  const { selectedPhotographer, setView } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Remove calendar and add confirmation + time options
    setMessages(prev => {
        const filtered = prev.filter(m => m.content.type !== 'calendar');
        return [
            ...filtered,
            { id: Date.now(), sender: 'user', content: { type: 'text', text: `${date.toLocaleDateString('ko-KR')} 선택했어요.` } },
            { id: Date.now() + 1, sender: 'photographer', content: { type: 'options', text: '선택하신 날짜에 가능한 시간대입니다.', options: ["10:00", "11:00", "14:00", "15:00"] } }
        ];
    });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setMessages(prev => {
        // Remove options
        const filtered = prev.filter(m => m.content.type !== 'options');
        return [
            ...filtered,
            { id: Date.now(), sender: 'user', content: { type: 'text', text: `${time} 선택했어요.` } },
            { id: Date.now() + 1, sender: 'photographer', content: { type: 'text', text: `네, ${selectedDate?.toLocaleDateString('ko-KR')} ${time}으로 예약 도와드리겠습니다! 잠시만 기다려주세요.` } }
        ];
    });
  };

  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: { type: 'text', text: trimmedInput },
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const photographerResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'photographer',
        content: { type: 'text', text: '확인했습니다. 잠시만요.' },
      };
      setIsTyping(false);
      setMessages(prev => [...prev, photographerResponse]);
    }, 1200);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  if (!selectedPhotographer) {
    return (
        <div className="p-4 text-center text-gray-400 flex flex-col items-center justify-center h-full">
            <p>채팅할 작가를 선택해주세요.</p>
            <button onClick={() => setView('home')} className="mt-4 bg-fuchsia-600 text-white font-semibold py-2 px-4 rounded-lg">홈으로 돌아가기</button>
        </div>
    );
  }

  const renderMessageContent = (message: ChatMessage) => {
    switch (message.content.type) {
      case 'text':
        return <p>{message.content.text}</p>;
      case 'calendar':
        return <InlineCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />;
      case 'options':
        return (
            <div>
                <p className="mb-2">{message.content.text}</p>
                <div className="flex flex-wrap gap-2">
                    {message.content.options.map(option => (
                        <button key={option} onClick={() => handleTimeSelect(option)} disabled={!!selectedTime} className="bg-fuchsia-600 text-white text-sm font-semibold py-1 px-3 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
        <header className="flex-shrink-0 flex items-center p-3 border-b border-gray-700 bg-gray-800">
            <button onClick={() => setView('photographer-detail')} className="p-2 rounded-full hover:bg-gray-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={selectedPhotographer.profileImage} alt={selectedPhotographer.name} className="w-10 h-10 rounded-full object-cover ml-2" />
            <h1 className="text-lg font-bold ml-3 text-white">{selectedPhotographer.name}</h1>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.sender === 'photographer' && (
                            <img src={selectedPhotographer.profileImage} alt={selectedPhotographer.name} className="w-8 h-8 rounded-full object-cover self-start" />
                        )}
                        <div className={`max-w-[70%] rounded-2xl p-3 ${
                            message.sender === 'user' 
                            ? 'bg-fuchsia-600 text-white rounded-br-none' 
                            : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}>
                            {renderMessageContent(message)}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <img src={selectedPhotographer.profileImage} alt={selectedPhotographer.name} className="w-8 h-8 rounded-full object-cover self-start" />
                        <div className="max-w-[70%] rounded-2xl p-3 bg-gray-700 text-gray-200 rounded-bl-none flex items-center justify-center">
                           <div className="flex items-center space-x-1">
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </main>

        <footer className="flex-shrink-0 p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-400"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    aria-label="Chat message input"
                />
                <button
                    className="ml-2 p-1 text-gray-400 hover:text-fuchsia-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </footer>
    </div>
  );
};