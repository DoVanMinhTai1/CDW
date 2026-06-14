import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkoutService } from "./service/checkoutService";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { CheckCircle2, ShoppingBag, MapPin, CreditCard, ArrowRight } from "lucide-react";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;
            try {
                setLoading(true);
                const orderData = await checkoutService.getOrder(orderId);
                setOrder(orderData);
            } catch (err: any) {
                console.error("Error fetching order details:", err);
                setError(err.message || "Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <main className="order-confirmation order-confirmation--loading">
                <Header />
                <div className="order-confirmation__container">
                    <div className="order-confirmation__spinner-wrapper">
                        <div className="order-confirmation__spinner"></div>
                        <p>Authenticating & retrieving order details...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="order-confirmation order-confirmation--error">
                <Header />
                <div className="order-confirmation__container">
                    <div className="order-confirmation__error-card">
                        <h2>Order Not Found</h2>
                        <p>{error || "We couldn't retrieve the details for this order."}</p>
                        <button className="order-confirmation__button" onClick={() => navigate("/")}>
                            Return to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="order-confirmation">
            <Header />
            <div className="order-confirmation__container">
                <div className="order-confirmation__content">
                    {/* Header Success Section */}
                    <section className="order-confirmation__success-header">
                        <div className="order-confirmation__success-icon-wrapper">
                            <CheckCircle2 size={64} className="order-confirmation__success-icon" />
                        </div>
                        <h1 className="order-confirmation__title">Thank You For Your Order</h1>
                        <p className="order-confirmation__subtitle">
                            Your order has been placed and is currently being processed. An email confirmation has been sent to your registered address.
                        </p>
                        <div className="order-confirmation__code-badge">
                            Order Code: <span>{order.orderCode}</span>
                        </div>
                    </section>

                    <div className="order-confirmation__grid">
                        {/* Left Column: Order Items */}
                        <div className="order-confirmation__left">
                            <h2 className="order-confirmation__section-title">Order Details</h2>
                            <div className="order-confirmation__items-card">
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item: any) => (
                                        <div key={item.id} className="order-confirmation__item">
                                            <div className="order-confirmation__item-image-wrapper">
                                                <img 
                                                    src={item.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=150&q=80"} 
                                                    alt={item.product?.name} 
                                                    className="order-confirmation__item-image"
                                                />
                                            </div>
                                            <div className="order-confirmation__item-info">
                                                <h3>{item.product?.name}</h3>
                                                {item.size && <p className="order-confirmation__item-spec">Size: {item.size}</p>}
                                                <p className="order-confirmation__item-qty">Qty: {item.quantity} × ${Number(item.price || 0).toFixed(2)}</p>
                                            </div>
                                            <div className="order-confirmation__item-price">
                                                ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="order-confirmation__no-items">No items found in this order.</p>
                                )}
                            </div>

                            {/* Summary Totals */}
                            <div className="order-confirmation__totals-card">
                                <div className="order-confirmation__total-row">
                                    <span>Subtotal</span>
                                    <span>${Number(order.subTotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="order-confirmation__total-row">
                                    <span>Estimated Tax</span>
                                    <span>${Number(order.estimatedTax || 0).toFixed(2)}</span>
                                </div>
                                <div className="order-confirmation__total-row">
                                    <span>Shipping</span>
                                    <span className="order-confirmation__free-shipping">Complimentary</span>
                                </div>
                                <div className="order-confirmation__total-divider" />
                                <div className="order-confirmation__total-row order-confirmation__total-row--grand">
                                    <span>Grand Total</span>
                                    <span>${Number(order.totalPrice || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Address and Payment */}
                        <div className="order-confirmation__right">
                            <h2 className="order-confirmation__section-title">Delivery & Payment</h2>
                            
                            {/* Shipping Card */}
                            <div className="order-confirmation__info-card">
                                <div className="order-confirmation__info-title">
                                    <MapPin size={18} />
                                    <h3>Shipping Address</h3>
                                </div>
                                <div className="order-confirmation__info-content">
                                    <p className="order-confirmation__address">{order.shippingAddressDump}</p>
                                </div>
                            </div>

                            {/* Payment Card */}
                            <div className="order-confirmation__info-card">
                                <div className="order-confirmation__info-title">
                                    <CreditCard size={18} />
                                    <h3>Payment Details</h3>
                                </div>
                                <div className="order-confirmation__info-content">
                                    <p>Method: {order.paymentMethod === "BANK_TRANSFER" ? "Bank Concierge Transfer" : "Credit / Debit Card"}</p>
                                    <p>Status: <span className="order-confirmation__status-badge">{order.status}</span></p>
                                </div>
                            </div>

                            {/* Assistance Info */}
                            <div className="order-confirmation__assistance-card">
                                <h3>Need Assistance?</h3>
                                <p>If you have any questions or would like to make changes to your order, please do not hesitate to contact our Maison Concierge.</p>
                                <a href="mailto:concierge@maison.com" className="order-confirmation__concierge-link">
                                    Contact Concierge <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="order-confirmation__actions">
                        <button className="order-confirmation__primary-btn" onClick={() => navigate("/")}>
                            <ShoppingBag size={18} /> Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default OrderConfirmationPage;
