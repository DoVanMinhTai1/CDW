import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProfilePageHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="border-b border-[#EAE6E2] bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Navigation Bar */}
                <div className="h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div 
                        className="text-2xl tracking-[0.2em] font-semibold text-[#4A1513] uppercase cursor-pointer hover:text-[#360f1b] transition-colors"
                        onClick={() => navigate('/')}
                    >
                        L'Éclat Héritage
                    </div>

                    {/* Center Menu */}
                    <nav className="hidden md:flex space-x-8 text-xs tracking-[0.15em] uppercase text-[#736863]">
                        <a href="/" className="hover:text-[#4A1513] transition-colors">Trang chủ</a>
                        <a href="/collection" className="hover:text-[#4A1513] transition-colors">Collections</a>
                        <a href="#high-jewelry" className="hover:text-[#4A1513] transition-colors">High Jewelry</a>
                        <a href="#legacy" className="hover:text-[#4A1513] transition-colors">Legacy</a>
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-6 text-[#514642]">
                        <button 
                            onClick={() => navigate('/wishlist')}
                            aria-label="Wishlist" 
                            className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        </button>
                        <button 
                            onClick={() => navigate('/cart')}
                            aria-label="Cart" 
                            className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                        </button>
                        <button 
                            onClick={() => navigate('/profile')}
                            aria-label="Account" 
                            className={`hover:text-[#4A1513] transition-colors ${isActive('/profile') ? 'text-[#4A1513]' : ''}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Secondary Navigation Tabs */}
                <div className="flex items-center space-x-8 border-t border-[#EAE6E2]">
                    <button
                        onClick={() => navigate('/profile')}
                        className={`px-4 py-4 text-xs tracking-widest uppercase font-medium transition-all relative ${
                            isActive('/profile')
                                ? 'text-[#4A1513] font-semibold'
                                : 'text-[#736863] hover:text-[#4A1513]'
                        }`}
                    >
                        Thông tin tài khoản
                        {isActive('/profile') && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4A1513]"></div>}
                    </button>
                    <button
                        onClick={() => navigate('/order-history')}
                        className={`px-4 py-4 text-xs tracking-widest uppercase font-medium transition-all relative ${
                            isActive('/order-history')
                                ? 'text-[#4A1513] font-semibold'
                                : 'text-[#736863] hover:text-[#4A1513]'
                        }`}
                    >
                        Lịch sử đơn hàng
                        {isActive('/order-history') && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4A1513]"></div>}
                    </button>
                    <button
                        onClick={() => navigate('/wishlist')}
                        className={`px-4 py-4 text-xs tracking-widest uppercase font-medium transition-all relative ${
                            isActive('/wishlist')
                                ? 'text-[#4A1513] font-semibold'
                                : 'text-[#736863] hover:text-[#4A1513]'
                        }`}
                    >
                        Danh sách yêu thích
                        {isActive('/wishlist') && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4A1513]"></div>}
                    </button>
                </div>
            </div>
        </header>
    );
}
