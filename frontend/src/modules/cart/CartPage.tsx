import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
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

    // Gọi API lấy dữ liệu giỏ hàng ban đầu
    const { data: initialCart, loading, error, refetch } = useApiRequest(() => cartService.getCart());

    // Đồng bộ dữ liệu từ API vào state nội bộ
    useEffect(() => {
        if (initialCart) {
            setCartItems(normalizeCart(initialCart));
        }
    }, [initialCart]);

    // 1. Sửa hàm Xóa Từng sản phẩm: sử dụng id của CartItem (Ví dụ: item.id hoặc item.cartItemId)
    const handleRemoveItem = async (cartItemId: number) => {
        const previous = cartItems;
        // Lọc bỏ item dựa trên ID của CartItem
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

    // 2. Thêm hàm Xóa Toàn Bộ Giỏ Hàng (Clear Cart)
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
        <main className="cart-page">
            <Header />
            <div className="cart-page__container">
                {/* Thanh tiêu đề tích hợp nút Clear All nằm gọn gàng bên góc phải */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="cart-page__title !mb-0">Shopping Bag</h1>
                    {displayCart.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-white border border-red-200 hover:border-red-600 hover:bg-red-600 rounded-md transition-all duration-200 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Clear Cart
                        </button>
                    )}
                </div>

                {displayCart.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 px-4 text-center max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Looks like you haven't added anything to your cart yet. Explore our top collections to find something you love!
                        </p>
                        <button
                            onClick={() => navigate('/collection')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-page__layout">
                        <section className="cart-page__products">
                            <div className="cart-page__table-head">
                                <span>Product</span>
                                <span>Quantity</span>
                                <span>Subtotal</span>
                            </div>

                            {displayCart.map(item => (
                                <article key={item.id || item.productId} className="cart-item">
                                    <div className="cart-item__product">
                                        <img src={item.thumbnailUrl} alt={item.productName} />
                                        <div className="cart-item__info">
                                            <h3>{item.productName}</h3>
                                            <p>{item.attributes}</p>
                                            {/* SỬA TẠI ĐÂY: Truyền item.id ứng với @PathVariable Long cartItemId của Backend */}
                                            <button className="cart-item__remove" onClick={() => handleRemoveItem(Number(item.cartItemId))}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__quantity">
                                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
                                    </div>

                                    <div className="cart-item__price">${((item.price || 0) * item.quantity).toLocaleString()}</div>
                                </article>
                            ))}

                            <div className="cart-page__gift">
                                <label>Gift Message (Optional)</label>
                                <textarea placeholder="Write a personal message..." />
                            </div>
                        </section>

                        <aside className="order-summary">
                            <h2>Order Summary</h2>
                            <div className="order-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="order-summary__row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                            <div className="order-summary__total"><span>Estimated Total</span><span>${total.toFixed(2)}</span></div>
                            <div className="order-summary__promo">
                                <label>Promo Code</label>
                                <div className="order-summary__promo-row">
                                    <input placeholder="Enter code" />
                                    <button>Apply</button>
                                </div>
                            </div>
                            <button className="order-summary__checkout" onClick={() => navigate('/checkout', { state: { cart: displayCart } })}>
                                Proceed To Checkout
                            </button>
                            <div className="order-summary__features">
                                <p>🔒 Secure Checkout</p>
                                <p>📦 Insured Worldwide Delivery</p>
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