import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
    return (
        <footer id="stores" className="bg-[var(--footer-bg)] px-6 pt-[clamp(3rem,7vw,4.5rem)] pb-6">
            <div className="max-w-[1280px] mx-auto mb-10 grid gap-10 lg:grid-cols-[1.1fr_2fr_1fr] lg:items-start">

                <div>
                    <span className="home-page__logo home-page__logo--footer">
                        L&apos;éclat Heritage
                    </span>

                    <p className="mt-4 max-w-[22rem] text-[0.9rem] leading-[1.65] text-[var(--muted)]">
                        Chúng tôi tin vào vẻ đẹp bền vững — nơi mỗi chi tiết đều mang dấu ấn của thời gian
                        và bàn tay con người.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-6">

                    <div>
                        <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em]">
                            Shop
                        </h3>

                        <ul className="list-none p-0 m-0">
                            <li className="mb-[0.55rem]">
                                <a href="#new-arrivals" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    New arrivals
                                </a>
                            </li>

                            <li className="mb-[0.55rem]">
                                <a href="#collections" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Collections
                                </a>
                            </li>

                            <li>
                                <a href="#heritage" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    High jewelry
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em]">
                            About
                        </h3>

                        <ul className="list-none p-0 m-0">
                            <li className="mb-[0.55rem]">
                                <a href="#heritage" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Our heritage
                                </a>
                            </li>

                            <li className="mb-[0.55rem]">
                                <a href="#search" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Craftsmanship
                                </a>
                            </li>

                            <li>
                                <a href="#stores" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Boutiques
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em]">
                            Support
                        </h3>

                        <ul className="list-none p-0 m-0">
                            <li className="mb-[0.55rem]">
                                <Link to="/login" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Account
                                </Link>
                            </li>

                            <li className="mb-[0.55rem]">
                                <a href="#footer-newsletter" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    Contact
                                </a>
                            </li>

                            <li>
                                <a href="#search" className="text-[0.88rem] text-[var(--muted)] no-underline transition-colors duration-200 hover:text-[var(--ink)]">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div id="footer-newsletter">
                    <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em]">
                        Join our world
                    </h3>

                    <form
                        className="flex items-stretch overflow-hidden rounded-[2px] border border-[rgba(26,26,26,0.15)] bg-white max-w-full"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label
                            htmlFor="newsletter-email"
                            className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0"
                        >
                            Email
                        </label>

                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Your email"
                            autoComplete="email"
                            className="flex-1 min-w-0 border-none px-4 py-3 text-[0.9rem] focus:outline-none"
                        />

                        <button
                            type="submit"
                            aria-label="Đăng ký"
                            className="inline-flex items-center justify-center bg-[var(--ink)] px-4 text-white transition-colors duration-200 hover:bg-[var(--burgundy)]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>

            </div>

            <div className="max-w-[1280px] mx-auto pt-6 border-t border-[rgba(26,26,26,0.08)] flex flex-wrap items-center justify-between gap-4">

                <p className="m-0 text-[0.8rem] text-[var(--muted)]">
                    © {new Date().getFullYear()} L&apos;éclat Heritage. All rights reserved.
                </p>

                <div className="flex gap-3">

                    <a
                        href="#search"
                        aria-label="Instagram"
                        className="w-9 h-9 inline-flex items-center justify-center text-[0.65rem] font-bold tracking-[0.05em] text-[var(--ink)] no-underline border border-[rgba(26,26,26,0.12)] rounded-full transition-all duration-200 hover:bg-white hover:border-[var(--ink)]"
                    >
                        <span aria-hidden>IG</span>
                    </a>

                    <a
                        href="#search"
                        aria-label="Facebook"
                        className="w-9 h-9 inline-flex items-center justify-center text-[0.65rem] font-bold tracking-[0.05em] text-[var(--ink)] no-underline border border-[rgba(26,26,26,0.12)] rounded-full transition-all duration-200 hover:bg-white hover:border-[var(--ink)]"
                    >
                        <span aria-hidden>FB</span>
                    </a>

                    <a
                        href="#search"
                        aria-label="Pinterest"
                        className="w-9 h-9 inline-flex items-center justify-center text-[0.65rem] font-bold tracking-[0.05em] text-[var(--ink)] no-underline border border-[rgba(26,26,26,0.12)] rounded-full transition-all duration-200 hover:bg-white hover:border-[var(--ink)]"
                    >
                        <span aria-hidden>Pi</span>
                    </a>

                </div>

            </div>
        </footer>
    );
};

export default Footer;