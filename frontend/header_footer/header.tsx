// components/Header/Header.tsx

import "./Header.css";
import { Heart, ShoppingBag, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import "./header.css";

const Header = () => {
    const location = useLocation();

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
                    <button type="button" className="home-page__icon-btn" aria-label="Giỏ hàng">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 7h15l-1.5 9h-12L6 7z" />
                            <path d="M6 7L5 3H2" strokeLinecap="round" />
                            <circle cx="9" cy="20" r="1" fill="currentColor" />
                            <circle cx="18" cy="20" r="1" fill="currentColor" />
                        </svg>
                    </button>
                    <Link to="/login" className="home-page__account">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;