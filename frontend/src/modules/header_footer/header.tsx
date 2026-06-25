import { Heart, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
    const { cartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-20 bg-[#faf9f7] border-b border-black/5">
            <div className="relative max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-4">

                <Link to="/" className="font-['Playfair_Display',serif] text-[1.15rem] font-semibold tracking-[0.02em] text-[#1a1a1a] no-underline whitespace-nowrap">
                    L&apos;éclat Heritage
                </Link>

                <nav aria-label="Chính" className="hidden min-[900px]:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <a href="/collection" className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-[#1a1a1a] no-underline transition-opacity duration-200 hover:opacity-55">
                        Collections
                    </a>
                    <a href="#heritage" className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-[#1a1a1a] no-underline transition-opacity duration-200 hover:opacity-55">
                        Our Story
                    </a>
                    <a href="#stores" className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-[#1a1a1a] no-underline transition-opacity duration-200 hover:opacity-55">
                        Stores
                    </a>
                    <a href="#search" className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-[#1a1a1a] no-underline transition-opacity duration-200 hover:opacity-55">
                        Search
                    </a>
                </nav>

                <div className="flex items-center gap-[0.35rem]">

                    <button
                        type="button"
                        aria-label="Tìm kiếm"
                        className="inline-flex items-center justify-center w-10 h-10 border-none bg-transparent text-[#1a1a1a] cursor-pointer rounded transition-all duration-200 hover:bg-black/5"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3-3" strokeLinecap="round" />
                        </svg>
                    </button>

                    <button
                        onClick={() => navigate("/wishlist")}
                        aria-label="Danh sách yêu thích"
                        className="inline-flex items-center justify-center w-10 h-10 border-none bg-transparent text-[#1a1a1a] cursor-pointer rounded transition-all duration-200 hover:bg-black/5"
                    >
                        <Heart size={20} />
                    </button>

                    <Link
                        to="/cart"
                        aria-label="Giỏ hàng"
                        className="relative inline-flex items-center justify-center w-10 h-10 border-none bg-transparent text-[#1a1a1a] cursor-pointer rounded transition-all duration-200 hover:bg-black/5"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 7h15l-1.5 9h-12L6 7z" />
                            <path d="M6 7L5 3H2" strokeLinecap="round" />
                            <circle cx="9" cy="20" r="1" fill="currentColor" />
                            <circle cx="18" cy="20" r="1" fill="currentColor" />
                        </svg>

                        {cartCount > 0 && (
                            <span className="absolute top-[0.2rem] right-[0.15rem] min-w-[1.35rem] h-[1.35rem] px-1 rounded-full bg-[#5b0f16] text-white text-[0.65rem] font-bold inline-flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated && user ? (
                        <div className="relative ml-2 inline-block group">

                            <button className="inline-flex items-center gap-2 h-10 px-3 border border-black/10 bg-transparent text-[#1a1a1a] cursor-pointer rounded text-[0.75rem] font-semibold tracking-[0.04em] transition-all duration-200 hover:bg-black/[0.04] hover:border-black/20">
                                <UserIcon size={18} />
                                <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {user.fullName || user.username}
                                </span>
                            </button>

                            <div className="absolute top-[calc(100%+8px)] right-0 w-[240px] bg-white/95 backdrop-blur-[10px] border border-black/10 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-4 z-[100] opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">

                                <div className="flex flex-col gap-1">
                                    <div className="text-[0.85rem] font-bold text-[#1a1a1a] text-left">
                                        {user.fullName}
                                    </div>

                                    <div className="text-[0.75rem] text-[#5c5c5c] font-mono text-left">
                                        @{user.username}
                                    </div>

                                    <div className="text-[0.75rem] text-[#5c5c5c] break-all mt-[0.15rem] text-left">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="h-px bg-black/5 my-3" />

                                <button
                                    onClick={() => navigate("/profile")}
                                    className="w-full p-2 border border-[#5c2434]/20 bg-transparent text-[#5c2434] rounded text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 text-center hover:bg-[#5c2434] hover:text-white mb-2"
                                >
                                    Thông tin tài khoản
                                </button>

                                <button
                                    onClick={() => navigate("/order-history")}
                                    className="w-full p-2 border border-[#5c2434]/20 bg-transparent text-[#5c2434] rounded text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 text-center hover:bg-[#5c2434] hover:text-white mb-2"
                                >
                                    Lịch sử đơn hàng
                                </button>

                                <button
                                    onClick={() => navigate("/wishlist")}
                                    className="w-full p-2 border border-[#5c2434]/20 bg-transparent text-[#5c2434] rounded text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 text-center hover:bg-[#5c2434] hover:text-white"
                                >
                                    Danh sách yêu thích
                                </button>

                                <div className="h-px bg-black/5 my-3" />

                                <button
                                    onClick={logout}
                                    className="w-full p-2 border border-[#5c2434]/20 bg-transparent text-[#5c2434] rounded text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 text-center hover:bg-[#5c2434] hover:text-white"
                                >
                                    Đăng xuất
                                </button>

                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="ml-1 text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-[#1a1a1a] no-underline px-[0.65rem] py-2 border border-black/15 rounded-sm transition-all duration-200 hover:bg-black/5 hover:border-black/25"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;