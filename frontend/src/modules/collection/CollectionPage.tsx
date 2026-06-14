import './CollectionPage.css';

import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { useApiRequest } from '../../hooks/useApiRequest';
import { collectionService } from './service/collectionService';
import type { Category, Material } from './model';

const CollectionPage = () => {
    const { id } = useParams<{ id: string }>(); 
    
    // Filter states
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState(''); 
    const [selectedCategories, setSelectedCategories] = useState<number[]>(id ? [Number(id)] : []);
    const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(0);

    const [isSortOpen, setIsSortOpen] = useState(false);

    // Fetch filters data (Categories, Materials)
    const { data: categories = [], loading: loadingCategories } = useApiRequest(() => collectionService.getCategories());
    const { data: materials = [], loading: loadingMaterials } = useApiRequest(() => collectionService.getMaterials());

    const { data: pageData, loading: loadingProducts, error, refetch } = useApiRequest(
        () => collectionService.getProducts({
            search: search || undefined,
            categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
            materialIds: selectedMaterials.length > 0 ? selectedMaterials : undefined,
            minPrice,
            maxPrice,
            sortBy: sortBy || undefined,
            page,
            size: 12
        }),
        [search, selectedCategories, selectedMaterials, minPrice, maxPrice, sortBy, page]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(0); 
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Update URL param 'id' to initial selected categories if provided
    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            setSelectedCategories([Number(id)]);
        }
    }, [id]);

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) ? prev.filter(i => i !== categoryId) : [...prev, categoryId]
        );
        setPage(0);
    };

    const handleMaterialToggle = (materialId: number) => {
        setSelectedMaterials(prev => 
            prev.includes(materialId) ? prev.filter(i => i !== materialId) : [...prev, materialId]
        );
        setPage(0);
    };

    const handleResetFilters = () => {
        setSearchInput('');
        setSearch('');
        setSelectedCategories([]);
        setSelectedMaterials([]);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSortBy('');
        setPage(0);
    };

    const products = pageData?.content || [];
    const totalElements = pageData?.totalElements || 0;
    const totalPages = pageData?.totalPages || 0;

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(
                <span 
                    key={i} 
                    className={page === i ? "active" : ""} 
                    onClick={() => setPage(i)}
                    style={{ cursor: 'pointer' }}
                >
                    {(i + 1).toString().padStart(2, '0')}
                </span>
            );
        }

        return (
            <div className="pagination">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    <ArrowLeft size={14} className="mr-1" /> Previous
                </button>
                <div className="pages">
                    {pages}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                    Next <ArrowRight size={14} className="ml-1" />
                </button>
            </div>
        );
    };

    const sortOptions = [
        { label: 'Featured', value: '' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Newest', value: 'newest' },
    ];

    return (
        <div className="collection-page">
            <Header />
            <section className="hero">
                <h1>L'Héritage Collection</h1>
                <p>A curated assembly of timeless masterpieces, where every facet reflects a century of craftsmanship and the quiet elegance of modern heritage.</p>
            </section>

            <div className="top-bar">
                <span>Displaying {totalElements} items</span>
                
                <div className="search-bar" style={{ flex: 1, margin: '0 2rem', maxWidth: '400px' }}>
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div className="sort" style={{ position: 'relative' }}>
                    <span style={{ marginRight: '8px' }}>Sort by:</span>
                    <button onClick={() => setIsSortOpen(!isSortOpen)}>
                        {sortOptions.find(o => o.value === sortBy)?.label || 'Featured'} <ChevronDown size={14} />
                    </button>
                    {isSortOpen && (
                        <div className="sort-dropdown" style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid #ddd', zIndex: 10, width: '160px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {sortOptions.map(opt => (
                                <div 
                                    key={opt.value} 
                                    style={{ padding: '8px 12px', cursor: 'pointer', background: sortBy === opt.value ? '#f5f5f5' : 'white' }}
                                    onClick={() => { setSortBy(opt.value); setIsSortOpen(false); setPage(0); }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <section className="content">
                <aside className="sidebar">
                    <div className="filter-group">
                        <h4>Category</h4>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.length === 0} 
                                onChange={() => { setSelectedCategories([]); setPage(0); }}
                            /> 
                            All Pieces
                        </label>
                        {loadingCategories ? <p>Loading...</p> : categories.map(cat => (
                            <label key={cat.id} className={selectedCategories.includes(cat.id) ? "active-check" : ""}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={() => handleCategoryToggle(cat.id)}
                                /> 
                                {cat.name}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Material</h4>
                        {loadingMaterials ? <p>Loading...</p> : materials.map(mat => (
                            <label key={mat.id} className={selectedMaterials.includes(mat.id) ? "active-check" : ""}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedMaterials.includes(mat.id)}
                                    onChange={() => handleMaterialToggle(mat.id)}
                                /> 
                                <span className="dot" style={{ backgroundColor: mat.colorHex, display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', marginRight: '8px' }}></span> 
                                {mat.name}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Price Range</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                            <input 
                                type="number" 
                                placeholder="Min $" 
                                value={minPrice || ''} 
                                onChange={e => { setMinPrice(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                style={{ width: '80px', padding: '4px' }}
                            />
                            <span>-</span>
                            <input 
                                type="number" 
                                placeholder="Max $" 
                                value={maxPrice || ''} 
                                onChange={e => { setMaxPrice(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                style={{ width: '80px', padding: '4px' }}
                            />
                        </div>
                    </div>

                    <button className="reset-btn" onClick={handleResetFilters}>Reset Filters</button>
                </aside>

                <div className="products-grid">
                    {loadingProducts && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading products...</div>}
                    {!loadingProducts && products.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                            No products found matching your criteria.
                        </div>
                    )}
                    {!loadingProducts && products.map((item) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="product-card">
                            <img src={item.thumbnailUrl || 'https://via.placeholder.com/300x300'} alt={item.name} />
                            <span className="product-category">{item.collectionName}</span>
                            <h3>{item.name}</h3>
                            <p>${item.price ? item.price.toLocaleString() : '0'}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {renderPagination()}

            <Footer />
        </div>
    );
};

export default CollectionPage;