import React from "react";
import "./CartPage.css";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { useCart } from "../cart/CartContext";

const parsePrice = (value: string) => {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
};

const formatPrice = (value: number) => `\$${value.toFixed(2)}`;

const CartPage: React.FC = () => {
    const { items, updateQuantity, removeFromCart } = useCart();
    const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

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

                        {items.length === 0 ? (
                            <div className="cart-page__empty">
                                Your cart is empty. Add a product first to see it here.
                            </div>
                        ) : (
                            items.map((item) => (
                                <article key={`${item.id}-${item.quantity}`} className="cart-item">

                                    <div className="cart-item__product">
                                        {item.image && <img src={item.image} alt={item.name} />}

                                        <div className="cart-item__info">
                                            <h3>{item.name}</h3>
                                            {item.description && <p>{item.description}</p>}

                                            <button
                                                type="button"
                                                className="cart-item__remove"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__quantity">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item__price">
                                        {formatPrice(parsePrice(item.price) * item.quantity)}
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
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="order-summary__row">
                            <span>Shipping</span>
                            <span className="shipping-free">
                Complimentary
              </span>
                        </div>

                        <div className="order-summary__total">
                            <span>Estimated Total</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="order-summary__promo">

                            <label>Promo Code</label>

                            <div className="order-summary__promo-row">
                                <input placeholder="Enter code" />
                                <button>Apply</button>
                            </div>

                        </div>

                        <button className="order-summary__checkout">
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