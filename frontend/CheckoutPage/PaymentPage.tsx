import { useNavigate } from "react-router-dom";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import "./PaymentPage.css";

const PaymentPage = () => {
    const navigate = useNavigate();

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
                        <div className="payment__card payment__card--active">

                            <div className="payment__card-header">
                                <div className="payment__radio active" />

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
                        <div className="payment__card payment__card--bank">

                            <div className="payment__card-header">
                                <div className="payment__radio" />

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
                                onClick={() => navigate("/checkout/shipping")}
                            >
                                ← BACK TO SHIPPING
                            </button>

                            <button
                                className="payment__continue"
                                onClick={() => navigate("/checkout/review")}
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

                        <div className="payment__product">

                            <img
                                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80"
                                alt="Necklace"
                            />

                            <div>
                                <h3>
                                    Étoile Diamond Pavé Necklace
                                </h3>

                                <span>
                  REF. EH-74291
                </span>

                                <p>€12,500</p>
                            </div>

                        </div>

                        <div className="payment__summary-divider" />

                        <div className="payment__summary-row">
                            <span>SUBTOTAL</span>
                            <span>€12,500</span>
                        </div>

                        <div className="payment__summary-row">
                            <span>SHIPPING</span>
                            <span className="accent">
                COMPLIMENTARY
              </span>
                        </div>

                        <div className="payment__summary-row">
                            <span>TAXES (ESTIMATED)</span>
                            <span>€2,500</span>
                        </div>

                        <div className="payment__summary-divider" />

                        <div className="payment__total">
                            <span>Total</span>
                            <span>€15,000</span>
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