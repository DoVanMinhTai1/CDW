import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import ProfilePageHeader from '../profile/ProfilePageHeader';

// --- Interfaces ---
interface OrderItem {
    id: string;
    orderCode: string;
    image?: string;
    date: string;
    createdAt?: string;
    total: number;
    totalPrice?: number;
    status: string;
}

export default function OrderHistory() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch orders từ API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await apiCall<any>(`/api/orders/history?page=${currentPage}&size=4`, {
                    method: 'GET',
                    raw: true
                });

                if (data && data.content) {
                    const mappedOrders = data.content.map((order: any) => ({
                        id: order.id,
                        orderCode: order.orderCode || order.id,
                        date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
                        createdAt: order.createdAt,
                        total: order.totalPrice || 0,
                        totalPrice: order.totalPrice || 0,
                        status: order.status || 'PENDING',
                        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200'
                    }));
                    setOrders(mappedOrders);
                    setTotalPages(data.totalPages || 1);
                }
            } catch (error: any) {
                showToast('Lỗi tải lịch sử đơn hàng: ' + error.message, 'error');
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#2C2523] font-serif">

            {/* 1. HEADER */}
            <header className="border-b border-[#EAE6E2] bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div 
                        className="text-2xl tracking-[0.2em] font-semibold text-[#4A1513] uppercase cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        L'Éclat Héritage
                    </div>
                    <nav className="hidden md:flex space-x-8 text-[11px] tracking-[0.2em] uppercase text-[#736863]">
                        <a href="/" className="hover:text-[#4A1513] transition-colors">Trang chủ</a>
                        <a href="/collection" className="hover:text-[#4A1513] transition-colors">Collections</a>
                        <a href="#" className="hover:text-[#4A1513] transition-colors">High Jewelry</a>
                        <a href="#" className="hover:text-[#4A1513] transition-colors">Legacy</a>
                    </nav>
                    <div className="flex items-center space-x-5 text-[#514642]">
                        <button onClick={() => navigate('/wishlist')} aria-label="Wishlist" className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        </button>
                        <button onClick={() => navigate('/cart')} aria-label="Cart" className="hover:text-[#4A1513] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                        </button>
                        <button onClick={() => navigate('/profile')} aria-label="Account" className="text-[#4A1513] hover:text-[#360f1b] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. BREADCRUMBS & TITLE */}
            <section className="max-w-7xl mx-auto px-6 pt-12">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#968C87] mb-4 font-sans">
                    <span className="cursor-pointer hover:text-[#4A1513]" onClick={() => navigate('/')}>Trang chủ</span> / <span className="text-[#4A1513]">Lịch sử đơn hàng</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-[#EAE6E2] pb-6">
                    <h1 className="text-4xl font-light tracking-tight text-[#2C2523]">Lịch Sử Đơn Hàng</h1>
                    <span className="text-xs uppercase tracking-widest text-[#736863] font-sans">{orders.length} Đơn Hàng</span>
                </div>
            </section>

            {/* 3. MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-16">

                {/* Sidebar */}
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
                            className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] bg-[#4A1513] text-white rounded shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            <span>Lịch sử đơn hàng</span>
                        </button>
                        <button 
                            onClick={() => navigate('/wishlist')}
                            className="flex items-center space-x-3 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-[#736863] hover:bg-[#F4F1EE] rounded transition-all">
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

                    {/* Support Box */}
                    <div className="bg-[#F8F5F2] border border-[#EAE6E2] p-8 rounded-sm">
                        <h3 className="text-sm uppercase tracking-widest font-semibold text-[#4A1513] mb-3">Hỗ trợ khách hàng</h3>
                        <p className="text-[12px] leading-relaxed text-[#736863] mb-6 font-sans">
                            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn về bất kỳ thắc mắc nào liên quan đến đơn hàng.
                        </p>
                        <button className="w-full py-3 border border-[#4A1513] text-[#4A1513] text-[10px] uppercase tracking-[0.2em] font-sans hover:bg-[#4A1513] hover:text-white transition-all duration-300">
                            Liên hệ với chúng tôi
                        </button>
                    </div>
                </aside>

                {/* Orders List */}
                <div className="lg:col-span-3 space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-[#968C87]">
                            <p>Đang tải lịch sử đơn hàng...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <>
                            {orders.map((order) => (
                                <div key={order.id} className="group bg-white border border-[#F0ECE9] p-5 flex flex-col md:flex-row items-center justify-between hover:shadow-xl hover:border-[#CCBDB5] transition-all duration-500 rounded-sm">
                                    <div className="flex items-center space-x-8 w-full md:w-auto">
                                        {/* Product Thumbnail */}
                                        <div className="w-24 h-24 bg-[#F8F5F2] overflow-hidden shrink-0">
                                            <img src={order.image} alt={order.orderCode} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>

                                        {/* Order Details */}
                                        <div className="grid grid-cols-2 md:flex md:space-x-12 gap-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-widest text-[#968C87] font-sans">Mã đơn hàng</p>
                                                <p className="text-sm font-medium text-[#4A1513] font-sans">{order.orderCode}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-widest text-[#968C87] font-sans">Ngày đặt</p>
                                                <p className="text-sm text-[#736863] font-sans">{order.date}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-widest text-[#968C87] font-sans">Tổng tiền</p>
                                                <p className="text-sm font-medium text-[#2C2523] font-sans">${(order.totalPrice || 0).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Action */}
                                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-6 md:mt-0 space-x-8">
                                        <span className={`text-[10px] uppercase tracking-widest font-sans font-medium px-3 py-1 rounded-full ${
                                            order.status === 'DELIVERED' ? 'text-green-700 bg-green-50' :
                                            order.status === 'SHIPPED' ? 'text-blue-700 bg-blue-50' :
                                            order.status === 'CONFIRMED' ? 'text-orange-700 bg-orange-50' :
                                            'text-red-700 bg-red-50'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <button className="p-2 hover:bg-[#F8F5F2] rounded-full transition-colors">
                                            <svg className="w-5 h-5 text-[#CCBDB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            <div className="flex justify-center items-center space-x-4 pt-10 font-sans">
                                <button 
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="p-2 text-[#CCBDB5] hover:text-[#4A1513] transition-colors disabled:opacity-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <span 
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-8 h-8 flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors ${
                                            currentPage === i ? 'bg-[#4A1513] text-white' : 'text-[#736863] hover:bg-[#F4F1EE]'
                                        }`}>
                                        {i + 1}
                                    </span>
                                ))}
                                <button 
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="p-2 text-[#CCBDB5] hover:text-[#4A1513] transition-colors disabled:opacity-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-[#968C87]">
                            <p>Chưa có đơn hàng nào</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. FOOTER (Giữ nguyên phong cách từ trang trước) */}
            <footer className="bg-[#F8F5F2] border-t border-[#EAE6E2] mt-24 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 space-y-6">
                        <h2 className="text-xl tracking-[0.2em] font-semibold text-[#4A1513] uppercase">L'Éclat Héritage</h2>
                        <p className="text-[12px] leading-relaxed text-[#80726C]">
                            Được thành lập từ năm 1924, chúng tôi mang đến những món trang sức vượt thời gian, kết tinh từ đôi bàn tay của những nghệ nhân bậc thầy.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6">The Maison</h4>
                        <ul className="space-y-3 text-[11px] text-[#80726C] uppercase tracking-wider">
                            <li><a href="#" className="hover:text-[#4A1513]">Lịch sử Maison</a></li>
                            <li><a href="#" className="hover:text-[#4A1513]">Nghệ thuật chế tác</a></li>
                            <li><a href="#" className="hover:text-[#4A1513]">Sự bền vững</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6">Hỗ trợ</h4>
                        <ul className="space-y-3 text-[11px] text-[#80726C] uppercase tracking-wider">
                            <li><a href="#" className="hover:text-[#4A1513]">Hướng dẫn bảo quản</a></li>
                            <li><a href="#" className="hover:text-[#4A1513]">Giao nhận & Trả hàng</a></li>
                            <li><a href="#" className="hover:text-[#4A1513]">Liên hệ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#2C2523] mb-6">Đăng ký bản tin</h4>
                        <div className="flex border-b border-[#CCBDB5] pb-2">
                            <input type="text" placeholder="Địa chỉ email của bạn" className="bg-transparent border-none text-[11px] w-full focus:outline-none placeholder-[#BAAFAB]" />
                            <button className="text-[11px] uppercase tracking-widest text-[#4A1513] font-bold">Gửi</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}