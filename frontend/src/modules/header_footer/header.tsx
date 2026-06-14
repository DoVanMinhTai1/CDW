// components/Header/Header.tsx

import { Heart, ShoppingBag, User as UserIcon, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./header.css";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
    const { cartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="home-page__header">
            <div className="home-page__header-inner">
                <Link to="/" className="home-page__logo">
                    L&apos;éclat Heritage
                </Link>
                <nav className="home-page__nav" aria-label="Chính">
                    <a href="/collection">Collections</a>
                    <a href="#heritage">Our Story</a>
                    <a href="#stores">Stores</a>
                    <a href="#search">Search</a>
                </nav>
                <div className="home-page__header-actions">
                    <button type="button" className="home-page__icon-btn" aria-label="Tìm kiếm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3-3" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => navigate('/wishlist')}
                        className="home-page__icon-btn" 
                        aria-label="Danh sách yêu thích">
                        <Heart size={20} />
                    </button>
                    <Link to="/cart" className="home-page__icon-btn home-page__cart-link" aria-label="Giỏ hàng">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 7h15l-1.5 9h-12L6 7z" />
                            <path d="M6 7L5 3H2" strokeLinecap="round" />
                            <circle cx="9" cy="20" r="1" fill="currentColor" />
                            <circle cx="18" cy="20" r="1" fill="currentColor" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="home-page__cart-badge">{cartCount}</span>
                        )}
                    </Link>
                    
                    {isAuthenticated && user ? (
                        <div className="home-page__profile-container">
                            <button className="home-page__profile-trigger">
                                <UserIcon size={18} />
                                <span className="home-page__profile-name">{user.fullName || user.username}</span>
                            </button>
                            <div className="home-page__profile-dropdown">
                                <div className="profile-dropdown__info">
                                    <div className="profile-dropdown__fullname">{user.fullName}</div>
                                    <div className="profile-dropdown__username">@{user.username}</div>
                                    <div className="profile-dropdown__email">{user.email}</div>
                                </div>
                                <div className="profile-dropdown__divider"></div>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="profile-dropdown__logout-btn">
                                    Thông tin tài khoản
                                </button>
                                <button 
                                    onClick={() => navigate('/order-history')}
                                    className="profile-dropdown__logout-btn">
                                    Lịch sử đơn hàng
                                </button>
                                <button 
                                    onClick={() => navigate('/wishlist')}
                                    className="profile-dropdown__logout-btn">
                                    Danh sách yêu thích
                                </button>
                                <div className="profile-dropdown__divider"></div>
                                <button onClick={logout} className="profile-dropdown__logout-btn">
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="home-page__account">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;