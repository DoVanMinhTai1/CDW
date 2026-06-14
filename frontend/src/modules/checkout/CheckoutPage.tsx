import React, { useState, useEffect } from "react";
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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("France");

    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const cart: CartItem[] = location.state?.cart || [];
    console.log('CheckoutPage received cart:', cart);

    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const address = await checkoutService.getDefaultAddress();
                if (address) {
                    setFirstName(address.firstName || "");
                    setLastName(address.lastName || "");
                    setStreetAddress(address.streetAddress || "");
                    setCity(address.city || "");
                    setPostalCode(address.postalCode || "");
                    if (address.country) {
                        setCountry(address.country);
                    }
                }
            } catch (err) {
                console.error("Error fetching default address:", err);
            }
        };
        fetchDefaultAddress();
    }, []);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            console.warn('Attempted to place order with empty cart');
            showToast('Cart is empty', 'error');
            return;
        }

        if (!firstName.trim() || !lastName.trim() || !streetAddress.trim() || !city.trim() || !country.trim()) {
            showToast('Please fill in all required shipping address fields', 'error');
            return;
        }

        const shippingAddress = {
            firstName,
            lastName,
            streetAddress,
            city,
            postalCode,
            country
        };

        console.log('Continuing to payment with address:', shippingAddress);
        navigate('/checkout/payment', { state: { cart, shippingAddress } });
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

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
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                </div>
                                <div className="checkout__field">
                                    <label>Last Name</label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <div className="checkout__field">
                                <label>Street Address</label>
                                <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} />
                            </div>

                            <div className="checkout__grid">
                                <div className="checkout__field">
                                    <label>City</label>
                                    <input type="text" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                <div className="checkout__field">
                                    <label>Postal Code</label>
                                    <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                                </div>
                            </div>

                            <div className="checkout__field">
                                <label>Country</label>
                                <select value={country} onChange={e => setCountry(e.target.value)}>
                                    <option value="France">France</option>
                                    <option value="Italy">Italy</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Germany">Germany</option>
                                </select>
                            </div>

                            <div className="checkout__actions">
                                <button type="button" className="checkout__back" onClick={() => navigate('/cart')}>← Back to Shopping Bag</button>
                                <button type="submit" className="checkout__continue">Continue to Payment</button>
                            </div>
                        </form>
                    </section>

                    <aside className="order-summary">
                        <h2>Order Summary</h2>
                        {cart.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">No items in cart</div>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div key={item.productId} className="order-summary__product">
                                        <img src={item.thumbnailUrl} alt={item.productName} />
                                        <div>
                                            <h3>{item.productName}</h3>
                                            <p>Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="order-summary__divider" />
                                <div className="order-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="order-summary__row"><span>Shipping (Insured)</span><span>Complimentary</span></div>
                                <div className="order-summary__row"><span>Estimated Tax</span><span>${tax.toFixed(2)}</span></div>
                                <div className="order-summary__divider" />
                                <div className="order-summary__total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </>
                        )}

                        <div className="order-summary__features"><div><ShieldCheck size={16} /><span>Secure & Encrypted Checkout</span></div><div><Truck size={16} /><span>White-Glove Insured Delivery</span></div></div>
                    </aside>
                </div>
            </div>  
            <Footer />
        </main>
    );
};

export default CheckoutPage;