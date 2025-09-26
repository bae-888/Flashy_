
import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { View } from '../types';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-15.02 1.202A2.25 2.25 0 0 1 3 18.25v-4.286c0-.97.616-1.813 1.5-2.097m16.5 0a2.25 2.25 0 0 0-1.883-2.185l-15.02-1.202A2.25 2.25 0 0 0 3 6.25v4.286" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const MyPageIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const navItems: { view: View; label: string; icon: (props: { active: boolean }) => JSX.Element }[] = [
    { view: 'home', label: '홈', icon: HomeIcon },
    { view: 'chat', label: '채팅', icon: ChatIcon },
    { view: 'my-page', label: '마이페이지', icon: MyPageIcon },
];

export const BottomNav = () => {
    const { view, setView } = useAppContext();

    return (
        <div className="flex-shrink-0 bg-gray-900 border-t border-gray-700">
            <nav className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = view === item.view;
                    return (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-fuchsia-400' : 'text-gray-400 hover:text-fuchsia-400'}`}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <item.icon active={isActive} />
                            <span className={`text-xs font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};