import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { useCart } from "../cart/CartContext";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const subtotal = cartItems.reduce(
        (total, item) => total + item.quantity * Number(item.price.replace(/[^0-9.-]+/g, "")),
        0
    );

    return (
        <main className="cart-page">
            <Header />
            <div className="cart-page__container">

                <h1 className="cart-page__title">Shopping Bag</h1>

                <div className="cart-page__layout">

                    {/* LEFT */}
                    <section className="cart-page__products">

                        <div className="cart-page__table-head">
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="cart-page__empty">
                                Your cart is currently empty.
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <article key={item.id} className="cart-item">

                                    <div className="cart-item__product">
                                        <img src={item.image} alt={item.name} />

                                        <div className="cart-item__info">
                                            <h3>{item.name}</h3>
                                            <p>{item.description}</p>

                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item__price">
                                        ${" "}
                                        {((item.quantity * Number(item.price.replace(/[^0-9.-]+/g, ""))).toFixed(2))}
                                    </div>

                                </article>
                            ))
                        )}

                        <div className="cart-page__gift">
                            <label>Gift Message (Optional)</label>

                            <textarea
                                placeholder="Write a personal message..."
                            />
                        </div>

                    </section>

                    {/* RIGHT */}
                    <aside className="order-summary">

                        <h2>Order Summary</h2>

                        <div className="order-summary__row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="order-summary__row">
                            <span>Shipping</span>
                            <span className="shipping-free">
                Complimentary
              </span>
                        </div>

                        <div className="order-summary__total">
                            <span>Estimated Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="order-summary__promo">

                            <label>Promo Code</label>

                            <div className="order-summary__promo-row">
                                <input placeholder="Enter code" />
                                <button>Apply</button>
                            </div>

                        </div>

                        <button
                            className="order-summary__checkout"
                            onClick={() => navigate("/checkout/shipping")}
                            disabled={cartItems.length === 0}
                        >
                            Proceed To Checkout
                        </button>

                        <div className="order-summary__features">
                            <p>🔒 Secure Checkout</p>
                            <p>📦 Insured Worldwide Delivery</p>
                        </div>

                    </aside>

                </div>

            </div>
            <Footer />
        </main>
    );
};

export default CartPage;