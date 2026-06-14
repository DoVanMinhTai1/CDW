import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../auth/AuthContext';
import ProfilePageHeader from './ProfilePageHeader';

// --- Types & Interfaces ---
interface Order {
    id: string;
    orderCode: string;
    date: string;
    createdAt: string;
    status: string;
    total: number;
    totalPrice: number;
}

interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    address: string;
    username: string;
    memberSince?: string;
}

interface UserProfileResponse {
    id: number;
    fullName: string;
    email: string;
    address: string;
    username: string;
    createdAt: string;
}

export default function AccountDashboard() {
    // --- State ---
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'wishlist'>('account');
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    const [profile, setProfile] = useState<UserProfile>({
        fullName: '',
        email: '',
        address: '',
        username: '',
        id: 0,
    });

    const { showToast } = useToast();

    // Fetch profile và orders từ API
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileData = await apiCall<UserProfileResponse>('/api/profile', {
                    method: 'GET',
                    raw: true
                });

                if (profileData) {
                    setProfile({
                        id: profileData.id || 0,
                        fullName: profileData.fullName || '',
                        email: profileData.email || '',
                        address: profileData.address || '',
                        username: profileData.username || '',
                        memberSince: profileData.createdAt
                    });
                }

                // Fetch orders
                const ordersData = await apiCall<any[]>('/api/profile/orders?page=0&size=10', {
                    method: 'GET',
                    raw: true
                });

                if (Array.isArray(ordersData)) {
                    const mappedOrders = ordersData.map(order => ({
                        id: order.id || order.orderCode,
                        orderCode: order.orderCode,
                        date: new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }),
                        createdAt: order.createdAt,
                        status: order.status || 'Processing',
                        total: order.totalPrice || 0,
                        totalPrice: order.totalPrice || 0
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error: any) {
                showToast('Lỗi tải thông tin: ' + error.message, 'error');
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Cập nhật profile
    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true);
            await apiCall('/api/profile/update', {
                method: 'PUT',
                body: JSON.stringify({
                    fullName: profile.fullName,
                    email: profile.email,
                    address: profile.address
                })
            });
            showToast('Cập nhật thông tin thành công!', 'success');
        } catch (error: any) {
            showToast('Lỗi cập nhật: ' + error.message, 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#2C2523] font-serif selection:bg-[#4A1513] selection:text-white">

            <ProfilePageHeader />

            {/* 2. MAIN CONTENT */}
            <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">

                {/* User Profile Overview */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-16 h-16 bg-[#EAE6E2] rounded-md flex items-center justify-center text-[#4A1513] font-sans font-medium text-lg tracking-wider mb-4">
                        {profile.fullName
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'U'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[#2C2523] mb-1">
                        Welcome, {profile.fullName || 'User'}
                    </h1>
                    <p className="text-xs tracking-widest text-[#968C87] uppercase font-sans">
                        {profile.memberSince
                            ? `Member since ${new Date(profile.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
                            : 'Member'}
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1 flex flex-col space-y-1">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'account' ? 'bg-[#4A1513] text-white' : 'text-[#736863] hover:bg-[#F4F1EE]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 01-7.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            <span>Account Info</span>
                        </button>

                        <button
                            onClick={() => navigate('/order-history')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'orders' ? 'bg-[#4A1513] text-white' : 'text-[#736863] hover:bg-[#F4F1EE]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                            <span>Lịch sử đơn hàng</span>
                        </button>

                        <button
                            onClick={() => navigate('/wishlist')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'wishlist' ? 'bg-[#4A1513] text-white' : 'text-[#736863] hover:bg-[#F4F1EE]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                            <span>Danh sách yêu thích</span>
                        </button>

                        <div className="pt-6 border-t border-[#EAE6E2] mt-4">
                            <button 
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="flex items-center space-x-3 px-4 py-3 text-xs tracking-widest uppercase font-sans text-[#A34A46] hover:bg-[#FFF5F5] rounded w-full transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </aside>

                    {/* Forms & Data Sections */}
                    <section className="lg:col-span-3 space-y-12 bg-white border border-[#F0ECE9] p-8 rounded-lg shadow-sm">

                        {/* Account Information Form */}
                        {activeTab === 'account' && (
                        <div>
                            <h2 className="text-xl font-light text-[#4A1513] tracking-wide border-b border-[#EAE6E2] pb-3 mb-6">
                                Account Information
                            </h2>

                            {loading ? (
                                <div className="text-center py-8 text-[#968C87]">Đang tải thông tin...</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-[#968C87] mb-2 font-sans">Fullname</label>
                                            <input
                                                type="text"
                                                value={profile.fullName}
                                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                                className="w-full border-b border-[#EAE6E2] py-2 text-sm focus:outline-none focus:border-[#4A1513] bg-transparent transition-colors font-sans"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-[#968C87] mb-2 font-sans">Email Address</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full border-b border-[#EAE6E2] py-2 text-sm focus:outline-none focus:border-[#4A1513] bg-transparent transition-colors font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-[10px] uppercase tracking-widest text-[#968C87] mb-2 font-sans">Primary Shipping Address</label>
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                            className="w-full border-b border-[#EAE6E2] py-2 text-sm focus:outline-none focus:border-[#4A1513] bg-transparent transition-colors font-sans"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button 
                                            onClick={() => window.location.reload()}
                                            className="px-6 py-2.5 border border-[#CCBDB5] text-xs uppercase tracking-widest font-sans text-[#736863] hover:bg-[#FDFDFD] hover:text-[#4A1513] transition-colors">
                                            Discard Changes
                                        </button>
                                        <button 
                                            onClick={handleSaveProfile}
                                            disabled={savingProfile}
                                            className="px-6 py-2.5 bg-[#4A1513] text-white text-xs uppercase tracking-widest font-sans hover:bg-[#340E0D] transition-colors disabled:opacity-50">
                                            {savingProfile ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        )}

                        {/* Recent Orders Section */}
                        {activeTab === 'orders' && (
                        <div>
                            <div className="flex items-center justify-between border-b border-[#EAE6E2] pb-3 mb-6">
                                <h2 className="text-xl font-light text-[#4A1513] tracking-wide">
                                    Recent Orders
                                </h2>
                                <button className="text-xs uppercase tracking-widest font-sans text-[#736863] hover:text-[#4A1513] transition-colors underline underline-offset-4">
                                    View All Orders
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-[#968C87]">Đang tải đơn hàng...</div>
                            ) : orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#F4F1EE] text-[10px] uppercase tracking-widest text-[#968C87] font-sans">
                                                <th className="pb-3 font-normal">Order ID</th>
                                                <th className="pb-3 font-normal">Date</th>
                                                <th className="pb-3 font-normal">Status</th>
                                                <th className="pb-3 font-normal text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-sans divide-y divide-[#F4F1EE]">
                                            {orders.map((order) => {
                                                const statusColor = 
                                                    order.status === 'DELIVERED' ? 'bg-[#EBF7EE] text-[#1E6B34]' :
                                                    order.status === 'PENDING' ? 'bg-[#FFF7E6] text-[#8B5A00]' :
                                                    order.status === 'CONFIRMED' ? 'bg-[#E3F2FD] text-[#1565C0]' :
                                                    order.status === 'SHIPPED' ? 'bg-[#F3E5F5] text-[#6A1B9A]' :
                                                    'bg-[#FFF0F0] text-[#A34A46]';

                                                return (
                                                    <tr key={order.id} className="hover:bg-[#FCFAFA] transition-colors">
                                                        <td className="py-4 text-[#4A1513] font-medium">{order.orderCode}</td>
                                                        <td className="py-4 text-[#736863]">{order.date}</td>
                                                        <td className="py-4">
                                                            <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider rounded font-medium ${statusColor}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right text-[#2C2523] font-medium">
                                                            ${(order.totalPrice || 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-[#968C87]">Chưa có đơn hàng nào</div>
                            )}
                        </div>
                        )}

                        {/* Wishlist Section */}
                        {activeTab === 'wishlist' && (
                        <div>
                            <h2 className="text-xl font-light text-[#4A1513] tracking-wide border-b border-[#EAE6E2] pb-3 mb-6">
                                My Wishlist
                            </h2>
                            <div className="text-center py-12">
                                <svg className="w-12 h-12 mx-auto text-[#D4C4BE] mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                                <p className="text-[#968C87] text-sm">Your wishlist is empty</p>
                                <button className="mt-4 px-6 py-2.5 bg-[#4A1513] text-white text-xs uppercase tracking-widest font-sans hover:bg-[#340E0D] transition-colors">
                                    Start Exploring
                                </button>
                            </div>
                        </div>
                        )}

                    </section>
                </div>
            </main>

            {/* 3. FOOTER */}
            <footer className="bg-[#F8F5F2] border-t border-[#EAE6E2] mt-24 text-[#514642]">
                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand Col */}
                    <div className="space-y-4">
                        <h3 className="text-lg tracking-widest uppercase font-semibold text-[#4A1513]">L'Éclat Héritage</h3>
                        <p className="text-xs text-[#80726C] leading-relaxed max-w-xs">
                            Crafting timeless legacies through artisanal excellence and sustainable luxury since 1924.
                        </p>
                    </div>

                    {/* Links Col 1 */}
                    <div>
                        <h4 className="text-xs tracking-widest uppercase font-semibold text-[#2C2523] mb-4 font-sans">The Maison</h4>
                        <ul className="space-y-2 text-xs text-[#80726C]">
                            <li><a href="#maison" className="hover:text-[#4A1513] transition-colors">The Maison</a></li>
                            <li><a href="#craftsmanship" className="hover:text-[#4A1513] transition-colors">Craftsmanship</a></li>
                            <li><a href="#sustainability" className="hover:text-[#4A1513] transition-colors">Sustainability</a></li>
                        </ul>
                    </div>

                    {/* Links Col 2 */}
                    <div>
                        <h4 className="text-xs tracking-widest uppercase font-semibold text-[#2C2523] mb-4 font-sans">Client Care</h4>
                        <ul className="space-y-2 text-xs text-[#80726C]">
                            <li><a href="#contact" className="hover:text-[#4A1513] transition-colors">Contact</a></li>
                            <li><a href="#care-guide" className="hover:text-[#4A1513] transition-colors">Care Guide</a></li>
                            <li><a href="#shipping" className="hover:text-[#4A1513] transition-colors">Shipping</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Col */}
                    <div>
                        <h4 className="text-xs tracking-widest uppercase font-semibold text-[#2C2523] mb-4 font-sans">Newsletter</h4>
                        <p className="text-xs text-[#80726C] mb-4 leading-relaxed">
                            Join our inner circle for exclusive previews.
                        </p>
                        <div className="flex border-b border-[#CCBDB5] pb-1">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-[#BAAFAB]"
                            />
                            <button className="text-xs uppercase tracking-widest font-sans font-medium text-[#4A1513] hover:text-[#250A09] transition-colors pl-2">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#EAE6E2] py-6 text-center md:flex md:justify-between max-w-7xl mx-auto px-6 text-[11px] text-[#968C87] font-sans">
                    <p>© 2026 L'Éclat Héritage. All rights reserved.</p>
                    <div className="space-x-4 mt-2 md:mt-0">
                        <a href="#privacy" className="hover:text-[#4A1513]">Privacy Policy</a>
                        <a href="#terms" className="hover:text-[#4A1513]">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}