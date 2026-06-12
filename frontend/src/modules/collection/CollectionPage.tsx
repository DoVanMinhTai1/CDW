import './CollectionPage.css';

import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useApiRequest } from '../../hooks/useApiRequest';
import { debounce } from '../../utils/debounce';
import { collectionService } from './service/collectionService';

const CollectionPage = () => {
    const { id } = useParams<{ id: string }>();
    const [search, setSearch] = useState('');

    const { data: products, loading, error, refetch } = useApiRequest(
        () => id ? collectionService.getProductsByCollection(id) : Promise.resolve([]),
        [id]
    );

    const handleSearch = debounce((value: string) => {
        setSearch(value);
    }, 300);

    useEffect(() => {
        refetch().catch(() => {});
    }, [search, id]);

    if (error && !loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-600">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="collection-page">
            <Header />
            <section className="hero">
                <h1>L'Héritage Collection</h1>
                <p>A curated assembly of timeless masterpieces, where every facet reflects a century of craftsmanship and the quiet elegance of modern heritage.</p>
            </section>

            <div className="top-bar">
                <span>Displaying {products?.length ?? 0} items</span>
                <div className="sort">
                    <span>Sort by:</span>
                    <button>
                        Featured <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            <section className="content">
                <aside className="sidebar">
                    <div className="filter-group">
                        <h4>Category</h4>
                        <label><input type="checkbox" /> All Pieces</label>
                        <label><input type="checkbox" /> Necklaces</label>
                        <label className="active-check"><input type="checkbox" checked readOnly /> Earrings</label>
                        <label><input type="checkbox" /> Rings</label>
                        <label><input type="checkbox" /> Bracelets</label>
                    </div>

                    <div className="filter-group">
                        <h4>Price Range</h4>
                        <div className="range-line"></div>
                        <div className="price-values"><span>$1,000</span><span>$50,000+</span></div>
                    </div>

                    <div className="filter-group">
                        <h4>Material</h4>
                        <label><span className="dot gold"></span> Yellow Gold</label>
                        <label><span className="dot platinum"></span> Platinum</label>
                        <label><span className="dot rose"></span> Rose Gold</label>
                    </div>

                    <button className="reset-btn">Reset Filters</button>
                </aside>

                <div className="products-grid">
                    {loading && <div className="text-center py-8">Loading products...</div>}
                    {!loading && (products ?? []).length === 0 && <div className="text-center py-8 text-gray-600">No products found</div>}
                    {!loading && (products ?? []).map((item, index) => (
                        <Link to={`/product/${item.id ?? index}`} key={index} className="product-card">
                            <img src={item.image} alt={item.name} />
                            <span className="product-category">{item.category}</span>
                            <h3>{item.name}</h3>
                            <p>{item.price ? `$${item.price}` : item.price}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="pagination">
                <button>← Previous</button>
                <div className="pages">
                    <span className="active">01</span>
                    <span>02</span>
                    <span>03</span>
                </div>
                <button>Next <ArrowRight size={14} /></button>
            </div>

            <Footer />
        </div>
    );
};

export default CollectionPage;