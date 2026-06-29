import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { ChevronDown, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
        <div className="bg-[#fcfbfa] text-[#2b1d1d] font-sans antialiased min-h-screen">
            <Header />

            {/* HERO BANNER SECTION */}
            <section className="bg-gradient-to-b from-[#f3ece4]/60 to-transparent text-center px-6 py-16 md:py-24 max-w-[1280px] mx-auto rounded-b-2xl">
                <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mb-4 text-[#1a1111]">
                    L'Héritage Collection
                </h1>
                <p className="max-w-2xl mx-auto text-[0.95rem] sm:text-base text-neutral-500 leading-relaxed font-light">
                    A curated assembly of timeless masterpieces, where every facet reflects a century of craftsmanship and the quiet elegance of modern heritage.
                </p>
            </section>

            {/* TOP BAR: Controls & Search */}
            <div className="max-w-[1280px] mx-auto px-6 py-6 border-b border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 order-3 sm:order-1">
                    Displaying {totalElements} items
                </span>

                {/* Luxurious Search Bar */}
                <div className="relative w-full sm:max-w-md order-1 sm:order-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search premium pieces..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white text-sm border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:border-[#5b0f16] focus:ring-1 focus:ring-[#5b0f16]/20 transition-all placeholder-neutral-400"
                    />
                </div>

                {/* Sophisticated Sort Dropdown */}
                <div className="relative order-2 sm:order-3 self-end sm:self-auto shrink-0 z-20">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span>Sort by:</span>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-1.5 font-medium text-neutral-800 bg-white border border-neutral-200 rounded-lg px-4 py-2 shadow-sm hover:border-neutral-300 transition"
                        >
                            {sortOptions.find(o => o.value === sortBy)?.label || 'Featured'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 bg-white border border-neutral-100 rounded-xl w-48 shadow-xl overflow-hidden py-1">
                            {sortOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    onClick={() => { setSortBy(opt.value); setIsSortOpen(false); setPage(0); }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${sortBy === opt.value
                                        ? "bg-[#5b0f16]/5 text-[#5b0f16] font-medium"
                                        : "text-neutral-600 hover:bg-neutral-50"
                                        }`}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN LAYOUT CONTENT */}
            <section className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">

                {/* SIDEBAR FILTERS */}
                <aside className="space-y-8 sticky top-6">
                    {/* Category Group */}
                    <div>
                        <h4 className="text-[0.72rem] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-4 pb-2 border-b border-neutral-100">
                            Category
                        </h4>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.length === 0}
                                    onChange={() => { setSelectedCategories([]); setPage(0); }}
                                    className="w-4 h-4 rounded text-[#5b0f16] border-neutral-300 focus:ring-[#5b0f16]"
                                />
                                <span className={selectedCategories.length === 0 ? "font-medium text-[#5b0f16]" : "group-hover:text-black transition"}>
                                    All Pieces
                                </span>
                            </label>

                            {loadingCategories ? (
                                <p className="text-xs text-neutral-400 animate-pulse">Loading categories...</p>
                            ) : categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                        className="w-4 h-4 rounded text-[#5b0f16] border-neutral-300 focus:ring-[#5b0f16]"
                                    />
                                    <span className={selectedCategories.includes(cat.id) ? "font-medium text-[#5b0f16]" : "group-hover:text-black transition"}>
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Material Group */}
                    <div>
                        <h4 className="text-[0.72rem] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-4 pb-2 border-b border-neutral-100">
                            Material
                        </h4>
                        <div className="flex flex-col gap-3">
                            {loadingMaterials ? (
                                <p className="text-xs text-neutral-400 animate-pulse">Loading materials...</p>
                            ) : materials.map(mat => (
                                <label key={mat.id} className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedMaterials.includes(mat.id)}
                                        onChange={() => handleMaterialToggle(mat.id)}
                                        className="w-4 h-4 rounded text-[#5b0f16] border-neutral-300 focus:ring-[#5b0f16]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner shrink-0" style={{ backgroundColor: mat.colorHex }}></span>
                                        <span className={selectedMaterials.includes(mat.id) ? "font-medium text-[#5b0f16]" : "group-hover:text-black transition"}>
                                            {mat.name}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Group */}
                    <div>
                        <h4 className="text-[0.72rem] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-4 pb-2 border-b border-neutral-100">
                            Price Range
                        </h4>
                        <div className="flex items-center gap-2 mt-3">
                            <input
                                type="number"
                                placeholder="Min $"
                                value={minPrice || ''}
                                onChange={e => { setMinPrice(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                className="w-full px-2.5 py-1.5 text-sm border border-neutral-200 bg-white rounded-md text-center focus:outline-none focus:border-[#5b0f16]"
                            />
                            <span className="text-neutral-400 text-xs">-</span>
                            <input
                                type="number"
                                placeholder="Max $"
                                value={maxPrice || ''}
                                onChange={e => { setMaxPrice(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                                className="w-full px-2.5 py-1.5 text-sm border border-neutral-200 bg-white rounded-md text-center focus:outline-none focus:border-[#5b0f16]"
                            />
                        </div>
                    </div>

                    {/* Reset Filters Button */}
                    <button
                        onClick={handleResetFilters}
                        className="w-full py-2.5 border border-dashed border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#5b0f16] hover:border-[#5b0f16] rounded-md transition-all flex items-center justify-center gap-1.5 bg-white"
                    >
                        Reset Filters
                    </button>
                </aside>

                {/* PRODUCTS GRID */}
                <div className="flex-1">
                    {loadingProducts && (
                        <div className="flex flex-col items-center justify-center py-24 col-span-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b0f16]"></div>
                            <p className="text-xs text-neutral-400 mt-4">Loading high artisan products...</p>
                        </div>
                    )}

                    {!loadingProducts && products.length === 0 && (
                        <div className="text-center py-24 px-4 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                            <p className="text-neutral-500 text-sm">No products found matching your criteria.</p>
                            <button onClick={handleResetFilters} className="mt-3 text-xs font-semibold text-[#5b0f16] underline underline-offset-4">Clear Filters</button>
                        </div>
                    )}

                    {!loadingProducts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((item) => (
                                <Link
                                    to={`/product/${item.id}`}
                                    key={item.id}
                                    className="group flex flex-col bg-white border border-neutral-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:border-neutral-200/80"
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 mb-4">
                                        <img
                                            src={item.thumbnailUrl || 'https://via.placeholder.com/300x300'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 text-left">
                                        <span className="text-[0.68rem] uppercase tracking-widest font-semibold text-neutral-400 mb-1">
                                            {item.collectionName || 'Fine Jewelry'}
                                        </span>
                                        <h3 className="font-normal text-[0.95rem] text-neutral-800 line-clamp-2 mb-2 group-hover:text-[#5b0f16] transition-colors duration-200">
                                            {item.name}
                                        </h3>
                                        <p className="mt-auto font-medium text-neutral-900 text-base">
                                            ${item.price ? item.price.toLocaleString() : '0'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* PAGINATION WRAPPER */}
            <div className="max-w-[1280px] mx-auto px-6 pb-20 flex justify-center">
                {renderPagination()}
            </div>

            <Footer />
        </div>
    );
};

export default CollectionPage;