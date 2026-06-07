import { useNavigate } from "react-router-dom";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import "./ReviewPage.css";

const products = [
    {
        id: 1,
        category: "Fine Jewelry",
        name: "Étoile Diamond Pavé Necklace",
        detail: "Length: 16-18 inches | Material: 18k White Gold",
        price: "$12,400",
        image:
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 2,
        category: "Bespoke Collection",
        name: "Heritage Aurelia Studs",
        detail: "Carat: 0.5ct each | Setting: Artisan Prongs",
        price: "$4,850",
        image:
            "https://images.unsplash.com/photo-1588444650700-6c7b3f3a93e8?auto=format&fit=crop&w=500&q=80",
    },
];

export default function CheckoutReviewPage() {
    const navigate = useNavigate();

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

                        {products.map((item) => (
                            <article
                                key={item.id}
                                className="review-product"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                />

                                <div className="review-product__info">
                  <span className="review-product__category">
                    {item.category}
                  </span>

                                    <h3>{item.name}</h3>

                                    <p>{item.detail}</p>
                                </div>

                                <div className="review-product__price">
                                    <span>Qty: 1</span>
                                    <strong>{item.price}</strong>
                                </div>
                            </article>
                        ))}

                        <div className="review__divider" />

                        <div className="review__details">

                            <div className="review-card">
                                <div className="review-card__header">
                                    <h3>Shipping Address</h3>
                                    <button onClick={() => navigate("/checkout/shipping")}>Change</button>
                                </div>

                                <p>Aurelius Thorne</p>
                                <p>742 Avenue de l'Opéra</p>
                                <p>Apartment 4B</p>
                                <p>75002 Paris, France</p>

                                <p className="phone">
                                    +33 1 42 68 53 00
                                </p>
                            </div>

                            <div className="review-card">
                                <div className="review-card__header">
                                    <h3>Payment Method</h3>
                                    <button onClick={() => navigate("/checkout/payment")}>Change</button>
                                </div>

                                <div className="payment-card">
                                    <div className="payment-card__logo">
                                        VISA
                                    </div>

                                    <div>
                                        <p>•••• •••• •••• 8842</p>
                                        <span>Exp: 11 / 28</span>
                                        <span>Aurelius Thorne</span>
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
                            <span>$17,250.00</span>
                        </div>

                        <div className="summary__row">
                            <span>Complimentary Shipping</span>
                            <span>$0.00</span>
                        </div>

                        <div className="summary__row">
                            <span>Estimated Tax</span>
                            <span>$3,450.00</span>
                        </div>

                        <div className="summary__divider" />

                        <div className="summary__total">
                            <span>Total</span>
                            <strong>$20,700.00</strong>
                        </div>

                        <small>INCLUSIVE OF VAT</small>

                        <button
                            className="summary__button"
                            onClick={() => navigate("/")}
                        >
                            PLACE ORDER
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