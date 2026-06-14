import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Interfaces ---
interface WishlistItem {
    id: string;
    title: string;
    materials: string;
    price: string;
    image: string;
}

export default function WishlistDashboard() {
    const navigate = useNavigate();
    // State quản lý danh sách yêu thích để người dùng có thể xóa trực tiếp trên giao diện
    const [wishlist, setWishlist] = useState<WishlistItem[]>([
        {
            id: '1',
            title: 'Seraphina Studs',
            materials: 'Platinum • Brilliant Cut',
            price: '$3,850',
            // Hình ảnh trang sức cao cấp (Bông tai kim cương)
            image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400',
        },
        {
            id: '2',
            title: 'Seraphina Studs',
            materials: 'Platinum • Brilliant Cut',
            price: '$3,850',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
        },
        {
            id: '3',
            title: 'Seraphina Studs',
            materials: 'Platinum • Brilliant Cut',
            price: '$3,850',
            image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400',
        },
    ]);

    // State thông báo khi thêm vào giỏ hàng thành công
    const [notification, setNotification] = useState<string | null>(null);

    // Hàm xóa sản phẩm
    const handleRemove = (id: string) => {
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    // Hàm chuyển vào giỏ hàng
    const handleMoveToBag = (title: string, id: string) => {
        setNotification(`Đã chuyển sản phẩm "${title}" vào giỏ hàng của bạn.`);
        setTimeout(() => setNotification(null), 3000);
        // Tùy chọn: Xóa khỏi wishlist sau khi chuyển vào giỏ
        // handleRemove(id);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#2C2523] font-serif relative">

            {/* 1. NOTIFICATION BANNER */}
            {notification && (
                <div className="fixed top-4 right-4 bg-[#4A1513] text-white px-6 py-4 rounded shadow-2xl z-50 transition-all transform animate-bounce text-xs tracking-wider uppercase font-sans">
                    {notification}
                </div>
            )}

            {/* 2. HEADER */}
            <header className="border-b border-[#EAE6E2] bg-white sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div 
                        className="text-2xl tracking-[0.2em] font-semibold text-[#4A1513] uppercase cursor-pointer hover:text-[#360f1b] transition-colors"
                        onClick={() => navigate('/')}
                    >
                        L'Éclat Héritage
                    </div>

                    <nav className="hidden md:flex space-x-8 text-[11px] tracking-[0.2em] uppercase text-[#736863]">
                        <a href="/" className="hover:text-[#4A1513] transition-colors">Trang chủ</a>
                        <a href="/collection" className="hover:text-[#4A1513] transition-colors">Collections</a>
                        <a href="#high-jewelry" className="hover:text-[#4A1513] transition-colors">High Jewelry</a>
                        <a href="#legacy" className="hover:text-[#4A1513] transition-colors">Legacy</a>
                    </nav>

                    <div className="flex items-center space-x-5 text-[#514642]">
                        <button aria-label="Search" className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                        <button 
                            onClick={() => navigate('/wishlist')}
                            aria-label="Wishlist" 
                            className="text-[#4A1513] hover:text-[#360f1b] transition-colors">
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
                            className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* 3. BREADCRUMBS & TITLE */}
            <section className="max-w-7xl mx-auto px-6 pt-12">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#968C87] mb-4 font-sans">
                    Trang chủ — <span className="text-[#4A1513]">Danh sách yêu thích</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-[#EAE6E2] pb-6">
                    <h1 className="text-4xl font-light tracking-tight text-[#2C2523]">Danh Sách Yêu Thích</h1>
                    <span className="text-xs uppercase tracking-widest text-[#736863] font-sans">
                        {wishlist.length.toString().padStart(2, '0')} Sản Phẩm
                    </span>
                </div>
            </section>

            {/* 4. MAIN LAYOUT */}
            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-16">

                {/* Sidebar Left Column */}
                <aside className="lg:col-span-1 space-y-10">
                    <nav className="flex flex-col space-y-1 font-sans">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-[#736863] hover:bg-[#F4F1EE] rounded transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>Thông tin tài khoản</span>
                        </button>
                        <button 
                            onClick={() => navigate('/order-history')}
                            className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-[#736863] hover:bg-[#F4F1EE] rounded transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            <span>Lịch sử đơn hàng</span>
                        </button>
                        <button 
                            onClick={() => navigate('/wishlist')}
                            className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] bg-[#4A1513] text-white rounded shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            <span>Danh sách yêu thích</span>
                        </button>

                        <div className="pt-4 mt-4 border-t border-[#EAE6E2]">
                            <button className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-[#A34A46] hover:bg-[#FFF5F5] rounded transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </nav>

                    {/* Client Care Box */}
                    <div className="bg-[#F8F5F2] border border-[#EAE6E2] p-8 rounded-sm">
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4A1513] mb-3 font-sans">Hỗ trợ khách hàng</h3>
                        <p className="text-[12px] leading-relaxed text-[#736863] mb-6 font-sans">
                            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn với các yêu cầu về đơn hàng và bảo dưỡng trang sức.
                        </p>
                        <button className="w-full py-3 border border-[#4A1513] text-[#4A1513] text-[10px] uppercase tracking-[0.2em] font-sans hover:bg-[#4A1513] hover:text-white transition-all duration-300">
                            Liên hệ chúng tôi
                        </button>
                    </div>
                </aside>

                {/* Wishlist Items Grid Right Column */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Map wishlist items */}
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-[#F0ECE9] flex hover:shadow-xl transition-shadow duration-500 rounded-sm relative group h-64 overflow-hidden"
                            >
                                {/* Product Image (Left Side) */}
                                <div className="w-2/5 bg-[#F8F5F2] relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Details (Right Side) */}
                                <div className="w-3/5 p-6 flex flex-col justify-between">
                                    {/* Delete Button top-right */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="absolute top-4 right-4 text-[#968C87] hover:text-[#4A1513] transition-colors p-1"
                                        aria-label="Xóa khỏi danh sách yêu thích"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="pr-4 space-y-1">
                                        <h3 className="text-lg font-light text-[#2C2523] tracking-wide leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-[#968C87] font-sans">
                                            {item.materials}
                                        </p>
                                        <p className="text-sm font-medium text-[#4A1513] pt-2 font-sans">
                                            {item.price}
                                        </p>
                                    </div>

                                    {/* Add to Cart button */}
                                    <button
                                        onClick={() => handleMoveToBag(item.title, item.id)}
                                        className="w-full py-2.5 bg-[#4A1513] hover:bg-[#340E0D] text-white text-[10px] uppercase tracking-widest font-sans transition-colors duration-300 mt-4"
                                    >
                                        Move to Bag
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Dotted Discover More Box (Empty State / CTA Card) */}
                        <div className="border border-dashed border-[#CCBDB5] bg-[#FDFDFD] flex flex-col items-center justify-center text-center p-8 h-64 rounded-sm">
                            <div className="w-12 h-12 rounded-full border border-[#CCBDB5] flex items-center justify-center text-[#CCBDB5] mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <p className="text-xs text-[#736863] max-w-50 leading-relaxed mb-3 font-sans">
                                Discover more pieces to add to your legacy collection
                            </p>
                            <a
                                href="#catalog"
                                className="text-xs uppercase tracking-widest font-sans font-semibold text-[#4A1513] hover:text-[#250A09] transition-colors underline underline-offset-4"
                            >
                                Browse Catalog
                            </a>
                        </div>

                    </div>
                </div>
            </main>

            {/* 5. FOOTER */}
            <footer className="bg-[#F8F5F2] border-t border-[#EAE6E2] mt-24 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-[#514642]">
                    <div className="space-y-6">
                        <h2 className="text-xl tracking-[0.2em] font-semibold text-[#4A1513] uppercase">L'Éclat Héritage</h2>
                        <p className="text-[12px] leading-relaxed text-[#80726C]">
                            Nơi di sản và sự tinh xảo gặp gỡ để tạo nên những tuyệt tác trang sức vượt thời gian.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6 font-sans">Maison</h4>
                        <ul className="space-y-3 text-[11px] text-[#80726C] uppercase tracking-wider">
                            <li><a href="#maison" className="hover:text-[#4A1513]">The Maison</a></li>
                            <li><a href="#craftsmanship" className="hover:text-[#4A1513]">Craftsmanship</a></li>
                            <li><a href="#sustainability" className="hover:text-[#4A1513]">Sustainability</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6 font-sans">Dịch vụ</h4>
                        <ul className="space-y-3 text-[11px] text-[#80726C] uppercase tracking-wider">
                            <li><a href="#care-guide" className="hover:text-[#4A1513]">Care Guide</a></li>
                            <li><a href="#shipping" className="hover:text-[#4A1513]">Shipping</a></li>
                            <li><a href="#contact" className="hover:text-[#4A1513]">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6 font-sans">Đăng ký bản tin</h4>
                        <div className="flex border-b border-[#CCBDB5] pb-2">
                            <input
                                type="text"
                                placeholder="Địa chỉ email của bạn"
                                className="bg-transparent border-none text-[11px] w-full focus:outline-none placeholder-[#BAAFAB]"
                            />
                            <button className="text-[11px] uppercase tracking-widest text-[#4A1513] font-bold">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#EAE6E2] mt-12 pt-6 max-w-7xl mx-auto px-6 flex justify-between text-[11px] text-[#968C87] font-sans">
                    <p>© 2026 L'Éclat Héritage. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#privacy" className="hover:text-[#4A1513]">Privacy Policy</a>
                        <a href="#terms" className="hover:text-[#4A1513]">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}