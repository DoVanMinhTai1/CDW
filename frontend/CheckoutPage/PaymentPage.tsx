import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../src/modules/header_footer/header";
import Footer from "../src/modules/header_footer/footer";
import type { CartItem } from "../src/modules/cart/model";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState("card");

    const cart: CartItem[] = location.state?.cart || [];
    const shippingAddress = location.state?.shippingAddress;

    useEffect(() => {
        if (cart.length === 0 || !shippingAddress) {
                "Missing cart or shipping address, redirecting back to cart."
            );
            navigate("/cart");
        }
    }, [cart, shippingAddress, navigate]);

    const handleContinue = () => {
        const backendPaymentMethod =
            paymentMethod === "bank"
                ? "BANK_TRANSFER"
                : "CREDIT_CARD";

        navigate("/checkout/review", {
            state: {
                cart,
                shippingAddress,
                paymentMethod: backendPaymentMethod,
            },
        });
    };

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + (item.price || 0) * item.quantity,
        0
    );

    let taxRate = 0.1;

    if (shippingAddress?.country) {
        const countryUpper =
            shippingAddress.country.toUpperCase();

        if (
            countryUpper.includes("FRANCE") ||
            countryUpper.includes("GERMANY") ||
            countryUpper.includes("ITALY")
        ) {
            taxRate = 0.2;
        } else if (
            countryUpper.includes("USA") ||
            countryUpper.includes("UNITED STATES")
        ) {
            taxRate = 0.08;
        }
    }

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f8f7f5]">
                <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-[60px] pt-[50px] pb-[120px]">

                    {/* Steps */}
                    <div className="flex justify-center items-center gap-6 mb-[70px]">
                        <span className="text-[14px] tracking-[2px] text-[#6d6d6d]">
                            01 SHIPPING
                        </span>

                        <div className="w-[40px] h-px bg-[#d8d2cd]" />

                        <span className="text-[14px] tracking-[2px] text-[#4f1212] border-b-2 border-[#4f1212] pb-[6px]">
                            02 PAYMENT
                        </span>

                        <div className="w-[40px] h-px bg-[#d8d2cd]" />

                        <span className="text-[14px] tracking-[2px] text-[#b5b0ac]">
                            03 REVIEW
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-[1.8fr_0.9fr] gap-[90px]">

                        {/* LEFT */}
                        <section>

                            <h1 className="font-serif text-[48px] lg:text-[64px] text-[#3d0909] mb-10 font-normal">
                                Payment Method
                            </h1>

                            {/* Credit Card */}
                            <div
                                onClick={() => setPaymentMethod("card")}
                                className={`bg-white border p-7 mb-[22px] cursor-pointer transition-all ${
                                    paymentMethod === "card"
                                        ? "border-[#7b3c3c]"
                                        : "border-[#e3ddd7]"
                                }`}
                            >
                                <div className="flex items-center mb-8">

                                    <div
                                        className={`w-4 h-4 rounded-full mr-4 ${
                                            paymentMethod === "card"
                                                ? "border-[5px] border-[#4f1212]"
                                                : "border border-[#bdb4ae]"
                                        }`}
                                    />

                                    <span>
                                        CREDIT OR DEBIT CARD
                                    </span>

                                    <span className="ml-auto">
                                        💳
                                    </span>
                                </div>

                                <div className="mb-7">
                                    <label className="block text-[14px] mb-[10px] text-[#4b4b4b]">
                                        CARDHOLDER NAME
                                    </label>

                                    <input
                                        className="w-full border-0 border-b border-[#d9d2cd] bg-transparent py-[14px] text-[16px] focus:outline-none"
                                        placeholder="AS APPEARS ON CARD"
                                        defaultValue={
                                            shippingAddress
                                                ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.toUpperCase()
                                                : ""
                                        }
                                    />
                                </div>

                                <div className="mb-7">
                                    <label className="block text-[14px] mb-[10px] text-[#4b4b4b]">
                                        CARD NUMBER
                                    </label>

                                    <input
                                        className="w-full border-0 border-b border-[#d9d2cd] bg-transparent py-[14px] text-[16px] focus:outline-none"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">

                                    <div className="mb-7">
                                        <label className="block text-[14px] mb-[10px] text-[#4b4b4b]">
                                            EXPIRY DATE
                                        </label>

                                        <input
                                            className="w-full border-0 border-b border-[#d9d2cd] bg-transparent py-[14px] text-[16px] focus:outline-none"
                                            placeholder="MM / YY"
                                        />
                                    </div>

                                    <div className="mb-7">
                                        <label className="block text-[14px] mb-[10px] text-[#4b4b4b]">
                                            CVV
                                        </label>

                                        <input
                                            className="w-full border-0 border-b border-[#d9d2cd] bg-transparent py-[14px] text-[16px] focus:outline-none"
                                            placeholder="000"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Bank */}
                            <div
                                onClick={() => setPaymentMethod("bank")}
                                className={`bg-white border p-7 mb-[22px] cursor-pointer transition-all ${
                                    paymentMethod === "bank"
                                        ? "border-[#7b3c3c]"
                                        : "border-[#e3ddd7]"
                                }`}
                            >
                                <div className="flex items-center mb-8">

                                    <div
                                        className={`w-4 h-4 rounded-full mr-4 ${
                                            paymentMethod === "bank"
                                                ? "border-[5px] border-[#4f1212]"
                                                : "border border-[#bdb4ae]"
                                        }`}
                                    />

                                    <span>
                                        BANK CONCIERGE TRANSFER
                                    </span>

                                    <span className="ml-auto">
                                        🏦
                                    </span>
                                </div>

                                <p className="text-[#5f5f5f] leading-[1.8] ml-8">
                                    Select this for high-value acquisitions.
                                    Upon order placement, our Maison Concierge
                                    will provide detailed wire instructions and
                                    assist with your transaction for a seamless
                                    experience.
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mt-10">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/checkout/shipping",
                                            { state: { cart } }
                                        )
                                    }
                                    className="border-none bg-transparent text-[#5d5d5d] cursor-pointer text-[15px]"
                                >
                                    ← BACK TO SHIPPING
                                </button>

                                <button
                                    onClick={handleContinue}
                                    className="w-full lg:w-[320px] h-16 bg-[#6a0000] text-white tracking-[2px] cursor-pointer"
                                >
                                    CONTINUE TO REVIEW
                                </button>

                            </div>

                        </section>

                        {/* RIGHT */}
                        <aside className="bg-white p-[34px] border border-[#ece8e4] h-fit">

                            <h2 className="font-serif text-[40px] lg:text-[52px] font-normal text-[#3d0909] mb-6">
                                Order Summary
                            </h2>

                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex gap-4 mb-5"
                                >
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.productName}
                                        className="w-[90px] h-[90px] object-cover"
                                    />

                                    <div>
                                        <h3 className="text-[22px] font-serif mb-[6px] text-[#2e2e2e]">
                                            {item.productName}
                                        </h3>

                                        <span className="block text-[#999] text-[12px] mb-2">
                                            Qty: {item.quantity}
                                        </span>

                                        <p className="text-[#6a0000] text-[22px]">
                                            ${(item.price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="h-px bg-[#ebe5e0] my-[26px]" />

                            <div className="flex justify-between mb-[18px]">
                                <span className="text-[#484848]">
                                    SUBTOTAL
                                </span>
                                <span>
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between mb-[18px]">
                                <span className="text-[#484848]">
                                    SHIPPING
                                </span>
                                <span className="text-[#6a0000]">
                                    COMPLIMENTARY
                                </span>
                            </div>

                            <div className="flex justify-between mb-[18px]">
                                <span className="text-[#484848]">
                                    TAXES (ESTIMATED)
                                </span>
                                <span>
                                    ${tax.toFixed(2)}
                                </span>
                            </div>

                            <div className="h-px bg-[#ebe5e0] my-[26px]" />

                            <div className="flex justify-between items-center font-serif text-[26px] mb-[6px]">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <small>
                                INCLUDES VAT
                            </small>

                            <div className="mt-8 bg-[#f8f8f8] p-[18px] text-[12px] leading-[1.7] text-[#666]">
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