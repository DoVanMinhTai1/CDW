import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ReviewPage.css";
import Header from "../src/modules/header_footer/header";
import Footer from "../src/modules/header_footer/footer";
import { useToast } from "../src/hooks/useToast";
import { useMutation } from "../src/hooks/useMutation";
import { checkoutService } from "../src/modules/checkout/service/checkoutService";
import type { CartItem } from "../src/modules/cart/model";

export default function CheckoutReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const cart: CartItem[] = location.state?.cart || [];
    const shippingAddress = location.state?.shippingAddress;
    const paymentMethod = location.state?.paymentMethod; // "CREDIT_CARD" or "BANK_TRANSFER"

    useEffect(() => {
        if (cart.length === 0 || !shippingAddress || !paymentMethod) {
            console.warn("Missing checkout info, redirecting back to cart.");
            navigate("/cart");
        }
    }, [cart, shippingAddress, paymentMethod, navigate]);

    const { mutate: placeOrder, loading } = useMutation(
        async (orderRequest: any) => {
            return await checkoutService.createOrder(orderRequest);
        },
        (order) => {
            console.log('Order placed successfully, backend response:', order);
            showToast('Order placed successfully', 'success');
            navigate(`/order-confirmation/${order?.id}`);
        },
        (err) => {
            console.error('Order placement failed:', err);
            showToast(err.message || 'Failed to place order', 'error');
        }
    );

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            showToast('Cart is empty', 'error');
            return;
        }
        placeOrder({ shippingAddress, paymentMethod });
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
            <main className="review">
            <div className="review__container">

                {/* Steps */}
                <div className="review__steps">
                    <span>01 SHIPPING</span>
                    <span>›</span>
                    <span>02 PAYMENT</span>
                    <span>›</span>
                    <span className="active">03 REVIEW</span>
                </div>

                <div className="review__content">

                    {/* LEFT */}
                    <section className="review__left">

                        <h1 className="review__title">
                            Confirm Your Selection
                        </h1>

                        <h2 className="review__subtitle">
                            Your Heritage Collection
                        </h2>

                        {cart.map((item) => (
                            <article
                                key={item.productId}
                                className="review-product"
                            >
                                <img
                                    src={item.thumbnailUrl}
                                    alt={item.productName}
                                />

                                <div className="review-product__info">
                                    <span className="review-product__category">
                                        Fine Jewelry
                                    </span>
                                    <h3>{item.productName}</h3>
                                    {item.attributes && <p>{item.attributes}</p>}
                                </div>

                                <div className="review-product__price">
                                    <span>Qty: {item.quantity}</span>
                                    <strong>${((item.price || 0) * item.quantity).toFixed(2)}</strong>
                                </div>
                            </article>
                        ))}

                        <div className="review__divider" />

                        <div className="review__details">

                            <div className="review-card">
                                <div className="review-card__header">
                                    <h3>Shipping Address</h3>
                                    <button onClick={() => navigate("/checkout/shipping", { state: { cart } })}>Change</button>
                                </div>

                                {shippingAddress ? (
                                     <>
                                         <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                         <p>{shippingAddress.streetAddress}</p>
                                         <p>{shippingAddress.city} {shippingAddress.postalCode ? `, ${shippingAddress.postalCode}` : ""}</p>
                                         <p>{shippingAddress.country}</p>
                                     </>
                                 ) : (
                                     <p>No address provided</p>
                                 )}
                            </div>

                            <div className="review-card">
                                <div className="review-card__header">
                                    <h3>Payment Method</h3>
                                    <button onClick={() => navigate("/checkout/payment", { state: { cart, shippingAddress } })}>Change</button>
                                </div>

                                <div className="payment-card">
                                     <div className="payment-card__logo">
                                         {paymentMethod === "BANK_TRANSFER" ? "🏦" : "💳"}
                                     </div>

                                     <div>
                                         <p>{paymentMethod === "BANK_TRANSFER" ? "Bank Concierge Transfer" : "Credit Card Payment"}</p>
                                         <span>Maison secure payment</span>
                                     </div>
                                </div>
                            </div>

                        </div>

                        <div className="review__divider" />

                        <div className="review-guarantee">

                            <div className="review-guarantee__icon">
                                ✦
                            </div>

                            <div>
                                <h4>Maison Guarantee</h4>

                                <p>
                                    Your order includes white-glove courier delivery,
                                    an official Certificate of Authenticity,
                                    and our lifetime care coverage.
                                </p>
                            </div>

                        </div>

                    </section>

                    {/* RIGHT */}
                    <aside className="summary">

                        <h2>Summary</h2>

                        <div className="summary__row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary__row">
                            <span>Complimentary Shipping</span>
                            <span>$0.00</span>
                        </div>

                        <div className="summary__row">
                            <span>Estimated Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="summary__divider" />

                        <div className="summary__total">
                            <span>Total</span>
                            <strong>${total.toFixed(2)}</strong>
                        </div>

                        <small>INCLUSIVE OF VAT</small>

                        <button
                            className="summary__button"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? "PROCESSING..." : "PLACE ORDER"}
                        </button>

                        <p className="summary__terms">
                            By placing your order, you agree to our Terms
                            of Service and Privacy Policy.
                        </p>

                        <div className="summary__help">
                            <span>Need assistance?</span>

                            <a href="/">
                                CONTACT A CONCIERGE
                            </a>
                        </div>

                    </aside>

                </div>

            </div>
        </main>
            <Footer />
        </>
    );
}