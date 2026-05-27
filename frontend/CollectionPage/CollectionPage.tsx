import './CollectionPage.css';

import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import {
    ChevronDown,
    ArrowRight,
} from 'lucide-react';
import { Link } from "react-router-dom";
import React from "react";

const products = [
    {
        category: 'High Jewelry',
        name: 'Lumière Drop Earrings',
        price: '$12,400',
        image:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    },
    {
        category: 'Collections',
        name: 'Solstice Platinum Ring',
        price: '$8,900',
        image:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    },
    {
        category: 'Bespoke',
        name: 'Elysian Gold Choker',
        price: '$15,200',
        image:
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop',
    },
    {
        category: 'Legacy',
        name: 'Heritage Cuff Bracelet',
        price: '$22,000',
        image:
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop',
    },
    {
        category: 'High Jewelry',
        name: 'Celestial Sapphire Studs',
        price: '$9,600',
        image:
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop',
    },
    {
        category: 'Bespoke',
        name: 'Emerald Verdant Necklace',
        price: '$45,000',
        image:
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    },
];

const CollectionPage = () => {
    return (
        <div className="collection-page">
            <Header />
            {/* HERO */}
            <section className="hero">
                <h1>L'Héritage Collection</h1>

                <p>
                    A curated assembly of timeless masterpieces, where every
                    facet reflects a century of craftsmanship and the quiet
                    elegance of modern heritage.
                </p>
            </section>

            {/* TOP BAR */}
            <div className="top-bar">
                <span>Displaying 12 Artifacts</span>

                <div className="sort">
                    <span>Sort by:</span>

                    <button>
                        Featured <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <section className="content">
                {/* SIDEBAR */}
                <aside className="sidebar">
                    <div className="filter-group">
                        <h4>Category</h4>

                        <label>
                            <input type="checkbox" />
                            All Pieces
                        </label>

                        <label>
                            <input type="checkbox" />
                            Necklaces
                        </label>

                        <label className="active-check">
                            <input type="checkbox" checked readOnly />
                            Earrings
                        </label>

                        <label>
                            <input type="checkbox" />
                            Rings
                        </label>

                        <label>
                            <input type="checkbox" />
                            Bracelets
                        </label>
                    </div>

                    <div className="filter-group">
                        <h4>Price Range</h4>

                        <div className="range-line"></div>

                        <div className="price-values">
                            <span>$1,000</span>
                            <span>$50,000+</span>
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Material</h4>

                        <label>
                            <span className="dot gold"></span>
                            Yellow Gold
                        </label>

                        <label>
                            <span className="dot platinum"></span>
                            Platinum
                        </label>

                        <label>
                            <span className="dot rose"></span>
                            Rose Gold
                        </label>
                    </div>

                    <button className="reset-btn">Reset Filters</button>
                </aside>

                {/* PRODUCTS */}
                <div className="products-grid">
                    {products.map((item, index) => (
                        <Link
                            to={`/product/${index}`}
                            key={index}
                            className="product-card"
                        >
                            <img src={item.image} alt={item.name} />

                            <span className="product-category">
                                {item.category}
                            </span>

                            <h3>{item.name}</h3>

                            <p>{item.price}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PAGINATION */}
            <div className="pagination">
                <button>← Previous</button>

                <div className="pages">
                    <span className="active">01</span>
                    <span>02</span>
                    <span>03</span>
                </div>

                <button>
                    Next <ArrowRight size={14} />
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default CollectionPage;