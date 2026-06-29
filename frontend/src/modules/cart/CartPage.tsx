import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { useApiRequest } from '../../hooks/useApiRequest';
import { useToast } from '../../hooks/useToast';
import { cartService } from './service/cartService';
import type { CartItem } from './model';

export function CartPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const { data: initialCart, loading, error, refetch } = useApiRequest(() => cartService.getCart());

    useEffect(() => {
        if (initialCart) {
            setCartItems(normalizeCart(initialCart));
        }
    }, [initialCart]);

    const handleRemoveItem = async (cartItemId: number) => {
        const previous = cartItems;
        const updated = cartItems.filter(i => i.id !== cartItemId);
        setCartItems(updated);
        try {
            await cartService.removeItem(cartItemId);
            showToast('Item removed successfully', 'success');
            if (refetch) refetch(); // Đồng bộ lại với DB nếu cần
        } catch (err) {
            setCartItems(previous);
            showToast(err instanceof Error ? err.message : 'Failed to remove item', 'error');
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear all items from your cart?")) return;

        const previous = cartItems;
        setCartItems([]); // Reset giao diện ngay lập tức thành rỗng
        try {
            await cartService.clearCart(); // Gọi API clear giỏ hàng
            showToast('Cart cleared successfully', 'success');
            if (refetch) refetch();
        } catch (err) {
            setCartItems(previous);
            showToast(err instanceof Error ? err.message : 'Failed to clear cart', 'error');
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) return;
        const previous = cartItems;
        const updated = cartItems.map(i => i.productId === productId ? { ...i, quantity } : i);
        setCartItems(updated);
        try {
            await cartService.addToCart({ productId, quantity });
        } catch (err) {
            setCartItems(previous);
            showToast(err instanceof Error ? err.message : 'Failed to update quantity', 'error');
        }
    };

    const normalizeCart = (data: any): CartItem[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.content)) return data.content;
        if (Array.isArray(data.items)) return data.items;
        if (Array.isArray(data.cart)) return data.cart;
        if (Array.isArray(data.data)) return data.data;
        return [];
    };

    const displayCart = cartItems.length ? cartItems : normalizeCart(initialCart);

    if (loading && displayCart.length === 0) {
        return (
            <main className="cart-page">
                <Header />
                <div className="flex flex-col justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    <span className="ml-3 mt-4 text-gray-500">Loading your cart...</span>
                </div>
                <Footer />
            </main>
        );
    }

    const subtotal = displayCart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;


    return (
        <main className="min-h-screen bg-[#fcfbfa] text-[14px] text-[#2b1d1d] font-sans antialiased">
            <Header />

            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

                {/* BAG HEADER */}
                <div className="flex justify-between items-end border-b border-neutral-200 pb-5 mb-10">
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1a1111]">
                        Shopping Bag
                    </h1>
                    {displayCart.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Clear Bag
                        </button>
                    )}
                </div>

                {displayCart.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="flex flex-col justify-center items-center py-20 px-4 text-center max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-5 text-neutral-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-neutral-800 mb-2">Your bag is empty</h2>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            Explore our curated collections to find the modern heritage pieces that speak to you.
                        </p>
                        <button
                            onClick={() => navigate('/collection')}
                            className="px-6 py-2.5 bg-[#5b0f16] hover:bg-[#450b10] text-white text-xs font-semibold uppercase tracking-wider rounded-md shadow-sm transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    /* MAIN GRID CONTENTS */
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-16 items-start">

                        {/* LEFT: PRODUCTS LIST */}
                        <section className="space-y-0">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-[1fr_120px_120px] pb-3 border-b border-neutral-200 font-semibold uppercase tracking-[0.12em] text-[0.68rem] text-neutral-400">
                                <span>Product Details</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-right">Total</span>
                            </div>

                            {/* Product Items */}
                            {displayCart.map(item => (
                                <article key={item.id || item.productId} className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px] gap-4 md:gap-0 items-center py-6 border-b border-neutral-100 group">

                                    {/* Info & Thumbnail */}
                                    <div className="flex gap-4 sm:gap-6">
                                        <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-lg overflow-hidden border border-neutral-100 bg-white shrink-0 shadow-sm">
                                            <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover group-hover:scale-102 transition duration-300" />
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-serif text-[1.2rem] sm:text-[1.35rem] font-medium text-neutral-800 mb-1 leading-tight">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-xs text-neutral-400 tracking-wide font-light">
                                                    {item.attributes}
                                                </p>
                                            </div>
                                            <button
                                                className="w-fit text-[0.68rem] font-bold uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors mt-3"
                                                onClick={() => handleRemoveItem(Number(item.cartItemId))}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Controls Quantity */}
                                    <div className="flex justify-start md:justify-center items-center">
                                        <div className="flex border border-neutral-200 rounded-md bg-white overflow-hidden shadow-sm h-9">
                                            <button className="w-9 text-sm text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 transition" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                            <span className="w-9 flex items-center justify-center text-xs font-semibold text-neutral-800">{item.quantity}</span>
                                            <button className="w-9 text-sm text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 transition" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>

                                    {/* Row Total Price */}
                                    <div className="text-left md:text-right font-serif text-lg sm:text-xl text-neutral-800 font-medium">
                                        ${((item.price || 0) * item.quantity).toLocaleString()}
                                    </div>
                                </article>
                            ))}

                            {/* Gift Message Area */}
                            <div className="mt-8 pt-4">
                                <label className="block mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-neutral-400">Gift Message (Optional)</label>
                                <textarea
                                    className="w-full max-w-xl h-24 resize-none border border-neutral-200 bg-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#5b0f16] shadow-inner placeholder-neutral-300"
                                    placeholder="Write a personal luxury message..."
                                />
                            </div>
                        </section>

                        {/* RIGHT: ORDER SUMMARY PANEL */}
                        <aside className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-100 shadow-md shadow-neutral-100/50">
                            <h2 className="font-serif text-[1.6rem] font-medium mb-6 text-neutral-800 pb-3 border-b border-neutral-100">
                                Order Summary
                            </h2>

                            <div className="space-y-3.5 text-sm text-neutral-600 mb-5">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-neutral-800">${subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Tax (10%)</span><span className="font-medium text-neutral-800">${tax.toLocaleString()}</span></div>
                            </div>

                            <div className="flex justify-between border-t border-neutral-100 pt-4 mb-6 items-baseline">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Estimated Total</span>
                                <span className="text-[#5b0f16] font-serif text-2xl font-semibold">
                                    ${total.toLocaleString()}
                                </span>
                            </div>

                            {/* Promo Code Input */}
                            <div className="mb-6">
                                <label className="block mb-2 text-[0.68rem] font-bold uppercase tracking-wider text-neutral-400">Promo Code</label>
                                <div className="flex gap-2 h-11">
                                    <input
                                        className="flex-1 border border-neutral-200 px-3 rounded-md bg-neutral-50/50 text-sm focus:outline-none focus:border-[#5b0f16]"
                                        placeholder="Enter code"
                                    />
                                    <button className="px-4 text-xs font-bold uppercase tracking-wider text-[#5b0f16] hover:bg-[#5b0f16]/5 rounded-md transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Checkout CTA */}
                            <button
                                className="w-full py-4 bg-[#5b0f16] hover:bg-[#450b10] text-white text-xs font-semibold uppercase tracking-[0.15em] rounded-md transition-all shadow-md hover:shadow-lg disabled:opacity-50 mb-6"
                                onClick={() => navigate('/checkout/shipping', { state: { cart: displayCart } })}
                                disabled={displayCart.length === 0}
                            >
                                Proceed To Checkout
                            </button>

                            {/* Trust Factors */}
                            <div className="space-y-2 border-t border-neutral-100 pt-4 text-center text-neutral-400 text-[0.68rem] font-semibold tracking-wider uppercase">
                                <p className="flex items-center justify-center gap-1.5"><span className="text-neutral-500">🔒</span> Secure Checkout</p>
                                <p className="flex items-center justify-center gap-1.5"><span className="text-neutral-500">📦</span> Insured Worldwide Delivery</p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default CartPage;