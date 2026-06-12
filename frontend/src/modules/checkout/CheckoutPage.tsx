import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { CreditCard, Landmark, ShieldCheck, Truck } from "lucide-react";
import { useToast } from '../../hooks/useToast';
import { useMutation } from '../../hooks/useMutation';
import { checkoutService } from './service/checkoutService';
import type { CartItem } from '../cart/model';

const CheckoutPage: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const cart: CartItem[] = location.state?.cart || [];

    const { mutate: placeOrder, loading } = useMutation(
        async () => {
            const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
            return await checkoutService.createOrder({ id: '', items: cart, total: subtotal * 1.1, status: 'pending' });
        },
        (order) => {
            showToast('Order placed successfully', 'success');
            navigate(`/order-confirmation/${order.id}`);
        },
        (err) => {
            showToast(err.message, 'error');
        }
    );

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            showToast('Cart is empty', 'error');
            return;
        }
        await placeOrder();
    };

    return (
        <main className="checkout">
            <Header />
            <div className="checkout__container">
                <div className="checkout__content">
                    <section className="checkout__form-section">
                        <div className="checkout__steps">
                            <button className="checkout__step checkout__step--active">01 Shipping</button>
                            <span>›</span>
                            <button className="checkout__step">02 Payment</button>
                            <span>›</span>
                            <button className="checkout__step">03 Review</button>
                        </div>

                        <div className="checkout__divider" />

                        <h2 className="checkout__section-title">Shipping Address</h2>

                        <form className="checkout__form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                            <div className="checkout__grid">
                                <div className="checkout__field">
                                    <label>First Name</label>
                                    <input type="text" defaultValue="" />
                                </div>
                                <div className="checkout__field"><label>Last Name</label><input type="text" defaultValue="" /></div>
                            </div>

                            <div className="checkout__field"><label>Street Address</label><input type="text" defaultValue="" /></div>

                            <div className="checkout__grid">
                                <div className="checkout__field"><label>City</label><input type="text" defaultValue="" /></div>
                                <div className="checkout__field"><label>Postal Code</label><input type="text" defaultValue="" /></div>
                            </div>

                            <div className="checkout__field"><label>Country</label>
                                <select defaultValue="">
                                    <option>France</option>
                                    <option>Italy</option>
                                    <option>United Kingdom</option>
                                    <option>Germany</option>
                                </select>
                            </div>

                            <div className="checkout__divider checkout__divider--large" />

                            <h2 className="checkout__section-title">Payment Method</h2>

                            <div className="checkout__payment-options">
                                <button className={`payment-card ${paymentMethod === "card" ? "payment-card--active" : ""}`} onClick={() => setPaymentMethod('card')}><CreditCard size={24} />
                                    <div><h3>Credit Card</h3><p>Visa, Mastercard, Amex</p></div>
                                    <span className="payment-card__radio" /></button>
                                <button className={`payment-card ${paymentMethod === "bank" ? "payment-card--active" : ""}`} onClick={() => setPaymentMethod('bank')}><Landmark size={24} />
                                    <div><h3>Bank Transfer</h3><p>Direct from your account</p></div>
                                    <span className="payment-card__radio" /></button>
                            </div>

                            <div className="checkout__actions">
                                <button type="button" className="checkout__back" onClick={() => navigate('/cart')}>← Back to Shopping Bag</button>
                                <button type="submit" className="checkout__continue" disabled={loading}>{loading ? 'Processing...' : 'Place Order'}</button>
                            </div>
                        </form>
                    </section>

                    <aside className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="order-summary__product">
                            <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=500&q=80" alt="Necklace" />
                            <div><h3>Order Items</h3></div>
                        </div>

                        <div className="order-summary__divider" />
                        <div className="order-summary__row"><span>Subtotal</span><span>€0.00</span></div>
                        <div className="order-summary__row"><span>Shipping (Insured)</span><span>Complimentary</span></div>
                        <div className="order-summary__row"><span>Estimated Tax</span><span>€0.00</span></div>
                        <div className="order-summary__divider" />
                        <div className="order-summary__total"><span>Total</span><span>€0.00</span></div>

                        <div className="order-summary__features"><div><ShieldCheck size={16} /><span>Secure & Encrypted Checkout</span></div><div><Truck size={16} /><span>White-Glove Insured Delivery</span></div></div>
                    </aside>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default CheckoutPage;