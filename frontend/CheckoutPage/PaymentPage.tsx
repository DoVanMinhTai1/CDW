import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentPage.css";
import Header from "../src/modules/header_footer/header";
import Footer from "../src/modules/header_footer/footer";
import type { CartItem } from "../src/modules/cart/model";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "bank"

    const cart: CartItem[] = location.state?.cart || [];
    const shippingAddress = location.state?.shippingAddress;

    useEffect(() => {
        if (cart.length === 0 || !shippingAddress) {
            console.warn("Missing cart or shipping address, redirecting back to cart.");
            navigate("/cart");
        }
    }, [cart, shippingAddress, navigate]);

    const handleContinue = () => {
        const backendPaymentMethod = paymentMethod === "bank" ? "BANK_TRANSFER" : "CREDIT_CARD";
        navigate("/checkout/review", { 
            state: { 
                cart, 
                shippingAddress, 
                paymentMethod: backendPaymentMethod 
            } 
        });
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    
    // Tax calculation based on country (matching backend)
    let taxRate = 0.10; // default 10%
    if (shippingAddress?.country) {
        const countryUpper = shippingAddress.country.toUpperCase();
        if (countryUpper.includes("FRANCE") || countryUpper.includes("GERMANY") || countryUpper.includes("ITALY")) {
            taxRate = 0.20;
        } else if (countryUpper.includes("USA") || countryUpper.includes("UNITED STATES")) {
            taxRate = 0.08;
        }
    }
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <>
            <Header />
            <main className="payment">

            <div className="payment__container">

                {/* Step */}
                <div className="payment__steps">
                    <span className="payment__step payment__step--done">
                        01 SHIPPING
                    </span>

                    <div className="payment__line" />

                    <span className="payment__step payment__step--active">
                        02 PAYMENT
                    </span>

                    <div className="payment__line" />

                    <span className="payment__step">
                        03 REVIEW
                    </span>
                </div>

                <div className="payment__content">

                    {/* LEFT */}
                    <section className="payment__form-section">

                        <h1 className="payment__title">
                            Payment Method
                        </h1>

                        {/* Credit Card */}
                        <div 
                            className={`payment__card ${paymentMethod === "card" ? "payment__card--active" : ""}`}
                            onClick={() => setPaymentMethod("card")}
                            style={{ cursor: "pointer" }}
                        >

                            <div className="payment__card-header">
                                <div className={`payment__radio ${paymentMethod === "card" ? "active" : ""}`} />

                                <span>
                                    CREDIT OR DEBIT CARD
                                </span>

                                <span className="payment__icon">
                                    💳
                                </span>
                            </div>

                            <div className="payment__field">
                                <label>CARDHOLDER NAME</label>
                                <input
                                    placeholder="AS APPEARS ON CARD"
                                    defaultValue={shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.toUpperCase() : ""}
                                />
                            </div>

                            <div className="payment__field">
                                <label>CARD NUMBER</label>
                                <input
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>

                            <div className="payment__row">
                                <div className="payment__field">
                                    <label>EXPIRY DATE</label>
                                    <input placeholder="MM / YY" />
                                </div>

                                <div className="payment__field">
                                    <label>CVV</label>
                                    <input placeholder="000" />
                                </div>
                            </div>

                        </div>

                        {/* Bank */}
                        <div 
                            className={`payment__card payment__card--bank ${paymentMethod === "bank" ? "payment__card--active" : ""}`}
                            onClick={() => setPaymentMethod("bank")}
                            style={{ cursor: "pointer" }}
                        >

                            <div className="payment__card-header">
                                <div className={`payment__radio ${paymentMethod === "bank" ? "active" : ""}`} />

                                <span>
                                    BANK CONCIERGE TRANSFER
                                </span>

                                <span className="payment__icon">
                                    🏦
                                </span>
                            </div>

                            <p>
                                Select this for high-value acquisitions.
                                Upon order placement, our Maison Concierge
                                will provide detailed wire instructions and
                                assist with your transaction for a seamless
                                experience.
                            </p>

                        </div>

                        <div className="payment__actions">

                            <button
                                className="payment__back"
                                onClick={() => navigate("/checkout/shipping", { state: { cart } })}
                            >
                                ← BACK TO SHIPPING
                            </button>

                            <button
                                className="payment__continue"
                                onClick={handleContinue}
                            >
                                CONTINUE TO REVIEW
                            </button>

                        </div>

                    </section>

                    {/* RIGHT */}
                    <aside className="payment__summary">

                        <h2>
                            Order Summary
                        </h2>

                        {cart.map((item) => (
                            <div key={item.productId} className="payment__product">
                                <img src={item.thumbnailUrl} alt={item.productName} />
                                <div>
                                    <h3>{item.productName}</h3>
                                    <span>Qty: {item.quantity}</span>
                                    <p>${(item.price || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}

                        <div className="payment__summary-divider" />

                        <div className="payment__summary-row">
                            <span>SUBTOTAL</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="payment__summary-row">
                            <span>SHIPPING</span>
                            <span className="accent">
                                COMPLIMENTARY
                            </span>
                        </div>

                        <div className="payment__summary-row">
                            <span>TAXES (ESTIMATED)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="payment__summary-divider" />

                        <div className="payment__total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <small>
                            INCLUDES VAT
                        </small>

                        <div className="payment__secure">
                            🔒 SECURE ENCRYPTED CHECKOUT.
                            YOUR DATA IS PROTECTED BY OUR
                            MAISON PRIVACY STANDARDS.
                        </div>

                    </aside>

                </div>

            </div>

        </main>
        <Footer />
        </>
    );
};

export default PaymentPage;