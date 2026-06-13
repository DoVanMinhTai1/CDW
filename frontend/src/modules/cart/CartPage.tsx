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

    const { data: initialCart, loading, error, refetch } = useApiRequest(() => cartService.getCart());

    useEffect(() => {
    if (initialCart) {
        setCartItems(normalizeCart(initialCart));
    }
}, [initialCart]);

    const handleRemoveItem = async (productId: string) => {
        const previous = cartItems;
        const updated = cartItems.filter(i => i.productId !== productId);
        setCartItems(updated);
        try {
            await cartService.removeFromCart(productId);
            showToast('Item removed', 'success');
        } catch (err) {
            setCartItems(previous);
            showToast(err instanceof Error ? err.message : 'Failed to remove item', 'error');
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

    if (loading && !cartItems.length) return <div className="flex justify-center items-center min-h-screen">Loading cart...</div>;

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

    if (displayCart.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <p className="text-xl text-gray-600">Your cart is empty</p>
                <button onClick={() => navigate('/collection')} className="px-6 py-2 bg-blue-500 text-white rounded">Continue Shopping</button>
            </div>
        );
    }

    const subtotal = displayCart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0); const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <main className="cart-page">
            <Header />
            <div className="cart-page__container">
                <h1 className="cart-page__title">Shopping Bag</h1>
                <div className="cart-page__layout">
                    <section className="cart-page__products">
                        <div className="cart-page__table-head">
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                        </div>
                        {cartItems.map(item => (
                            <article key={item.productId} className="cart-item">
                                <div className="cart-item__product">
                                    {/* 1. Sửa ảnh: item.product?.image -> item.thumbnailUrl */}
                                    <img src={item.thumbnailUrl} alt={item.productName} />

                                    <div className="cart-item__info">
                                        {/* 2. Sửa tên: item.product?.name -> item.productName */}
                                        <h3>{item.productName}</h3>

                                        {/* 3. Sửa attributes nếu muốn hiện size/màu */}
                                        <p>{item.attributes}</p>

                                        <button className="cart-item__remove" onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                                    </div>
                                </div>

                                <div className="cart-item__quantity">
                                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
                                </div>

                                {/* 4. Sửa giá tiền hiển thị của từng dòng item: item.product?.price -> item.price */}
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
                        <button className="order-summary__checkout" onClick={() => navigate('/checkout', { state: { cart: displayCart } })} disabled={displayCart.length === 0}>Proceed To Checkout</button>
                        <div className="order-summary__features"><p>🔒 Secure Checkout</p><p>📦 Insured Worldwide Delivery</p></div>
                    </aside>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default CartPage;