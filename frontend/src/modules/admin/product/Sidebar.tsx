import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const menuItems = [
        { id: 'overview', label: 'Tổng quan', icon: 'fa-chart-pie', path: '/admin' }, 
        { id: 'products', label: 'Sản phẩm', icon: 'fa-gem', path: '/admin/products' },
        { id: 'categories', label: 'Danh mục', icon: 'fa-layer-group', path: '/admin/categories' },
        { id: 'orders', label: 'Đơn hàng', icon: 'fa-shopping-bag', path: '/admin/orders' },
        { id: 'users', label: 'Người dùng', icon: 'fa-users', path: '/admin/users' },
    ];

    const baseClass = "w-full flex items-center space-x-3 px-4 py-3 rounded text-sm transition-all duration-150 ";

    return (
        <aside className="w-64 bg-[#f4f4f4] border-r border-gray-200 flex flex-col justify-between sticky top-0 h-screen z-10">
            <div>
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Management</h2>
                    <p className="text-base font-bold text-[#4a1525] mt-0.5 font-serif">LuxuryPortal</p>
                </div>

                <nav className="mt-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            // end={item.id === 'overview'} // Thêm cái này nếu trang Tổng quan trùng lặp active với trang khác
                            className={({ isActive }) =>
                                isActive
                                    ? baseClass + "font-semibold text-[#4a1525] bg-white border-r-4 border-[#4a1525] shadow-sm"
                                    : baseClass + "font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                            }
                        >
                            <i className={`fa-solid ${item.icon} w-5 text-center text-xs`}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-200 space-y-2">
                <button className="w-full bg-[#4a1525] text-white text-[11px] uppercase tracking-widest py-2.5 px-4 rounded hover:bg-[#360f1b] transition-colors font-medium">
                    View Boutique
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-xs text-gray-400 hover:text-gray-700">
                    <i className="fa-solid fa-circle-question w-4"></i>
                    <span>Trợ giúp</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-xs text-red-500 hover:text-red-700" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket w-4"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}