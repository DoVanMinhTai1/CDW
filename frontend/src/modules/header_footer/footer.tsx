// components/Footer/Footer.tsx

import "./footer.css";
import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
    return (
        <footer id="stores" className="home-page__footer">
            <div className="home-page__footer-top">
                <div className="home-page__footer-brand">
                    <span className="home-page__logo home-page__logo--footer">L&apos;éclat Heritage</span>
                    <p>
                        Chúng tôi tin vào vẻ đẹp bền vững — nơi mỗi chi tiết đều mang dấu ấn của thời gian
                        và bàn tay con người.
                    </p>
                </div>
                <div className="home-page__footer-columns">
                    <div>
                        <h3>Shop</h3>
                        <ul>
                            <li>
                                <a href="#new-arrivals">New arrivals</a>
                            </li>
                            <li>
                                <a href="#collections">Collections</a>
                            </li>
                            <li>
                                <a href="#heritage">High jewelry</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>About</h3>
                        <ul>
                            <li>
                                <a href="#heritage">Our heritage</a>
                            </li>
                            <li>
                                <a href="#search">Craftsmanship</a>
                            </li>
                            <li>
                                <a href="#stores">Boutiques</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>Support</h3>
                        <ul>
                            <li>
                                <Link to="/login">Account</Link>
                            </li>
                            <li>
                                <a href="#footer-newsletter">Contact</a>
                            </li>
                            <li>
                                <a href="#search">FAQ</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="footer-newsletter" className="home-page__footer-newsletter">
                    <h3>Join our world</h3>
                    <form className="home-page__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="newsletter-email" className="visually-hidden">
                            Email
                        </label>
                        <input id="newsletter-email" type="email" placeholder="Your email" autoComplete="email" />
                        <button type="submit" aria-label="Đăng ký">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            <div className="home-page__footer-bottom">
                <p>© {new Date().getFullYear()} L&apos;éclat Heritage. All rights reserved.</p>
                <div className="home-page__social">
                    <a href="#search" aria-label="Instagram">
                        <span aria-hidden>IG</span>
                    </a>
                    <a href="#search" aria-label="Facebook">
                        <span aria-hidden>FB</span>
                    </a>
                    <a href="#search" aria-label="Pinterest">
                        <span aria-hidden>Pi</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;