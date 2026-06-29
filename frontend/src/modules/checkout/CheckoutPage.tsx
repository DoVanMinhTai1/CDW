import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { ShieldCheck, Truck } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { checkoutService } from "./service/checkoutService";
import type { CartItem } from "../cart/model";

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
            showToast("Cart is empty", "error");
            return;
        }

        if (!firstName.trim() || !lastName.trim() || !streetAddress.trim() || !city.trim() || !country.trim()) {
            showToast("Please fill in all required shipping address fields", "error");
            return;
        }

        const shippingAddress = {
            firstName,
            lastName,
            streetAddress,
            city,
            postalCode,
            country,
        };

        navigate("/checkout/payment", {
            state: {
                cart,
                shippingAddress,
            },
        });
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <main className="bg-[#f7f6f4] min-h-screen text-[#3f2020] font-sans">
            <Header />

            <div className="max-w-[1440px] mx-auto px-20 pt-12 pb-[100px] md:px-5 md:pt-[30px] md:pb-[30px]">

                <div className="grid grid-cols-[1fr_430px] gap-12 items-start max-[1100px]:grid-cols-1">

                    <section>

                        <div className="flex items-center gap-[14px] mb-[30px]">
                            <button className="border-none bg-transparent uppercase text-[14px] tracking-[1px] text-[#5f1111] border-b-2 border-[#5f1111] pb-2 cursor-pointer">
                                01 Shipping
                            </button>

                            <span>›</span>

                            <button className="border-none bg-transparent uppercase text-[14px] tracking-[1px] text-[#777] cursor-pointer">
                                02 Payment
                            </button>

                            <span>›</span>

                            <button className="border-none bg-transparent uppercase text-[14px] tracking-[1px] text-[#777] cursor-pointer">
                                03 Review
                            </button>
                        </div>

                        <div className="h-px bg-[#e2e2e2]" />

                        <h2 className="my-[60px] mb-10 font-['Playfair_Display'] text-[32px] font-medium text-[#4f1717]">
                            Shipping Address
                        </h2>

                        <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="flex flex-col gap-8">

                            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">

                                <div className="flex flex-col">
                                    <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                    />
                                </div>

                            </div>

                            <div className="flex flex-col">
                                <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                    Street Address
                                </label>

                                <input
                                    type="text"
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">

                                <div className="flex flex-col">
                                    <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                    />
                                </div>

                            </div>
                            <div className="flex flex-col">
                                <label className="mb-[14px] uppercase text-[13px] text-[#666]">
                                    Country
                                </label>

                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="border-none border-b border-b-[#d5d5d5] bg-transparent pb-3 text-[18px] text-[#444] focus:outline-none"
                                >
                                    <option value="France">France</option>
                                    <option value="Italy">Italy</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Germany">Germany</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center mt-[70px] md:flex-col md:gap-5">

                                <button
                                    type="button"
                                    onClick={() => navigate("/cart")}
                                    className="border-none bg-transparent text-[#666] cursor-pointer text-[16px]"
                                >
                                    ← Back to Shopping Bag
                                </button>

                                <button
                                    type="submit"
                                    className="w-[300px] h-[68px] border-none bg-[#5f0000] text-white text-[15px] tracking-[2px] uppercase cursor-pointer md:w-full"
                                >
                                    Continue to Payment
                                </button>

                            </div>

                        </form>

                    </section>

                    <aside className="bg-white p-9">

                        <h2 className="font-['Playfair_Display'] text-[#4f1717] text-[38px] font-medium mb-8">
                            Order Summary
                        </h2>

                        {cart.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">
                                No items in cart
                            </div>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex gap-[18px]"
                                    >
                                        <img
                                            src={item.thumbnailUrl}
                                            alt={item.productName}
                                            className="w-[110px] h-[110px] object-cover"
                                        />

                                        <div>
                                            <h3 className="text-[18px] mb-2">
                                                {item.productName}
                                            </h3>

                                            <p className="text-[#777] mb-4">
                                                Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="h-px bg-[#e8e8e8] my-7" />

                                <div className="flex justify-between mb-[18px]">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between mb-[18px]">
                                    <span>Shipping (Insured)</span>
                                    <span>Complimentary</span>
                                </div>

                                <div className="flex justify-between mb-[18px]">
                                    <span>Estimated Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>

                                <div className="h-px bg-[#e8e8e8] my-7" />

                                <div className="flex justify-between mb-10 text-[24px] font-semibold">
                                    <span>Total</span>
                                    <span className="text-[#5f1111]">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-[14px] text-[#666] text-[13px]">

                            <div className="flex items-center gap-[10px]">
                                <ShieldCheck size={16} />
                                <span>Secure & Encrypted Checkout</span>
                            </div>

                            <div className="flex items-center gap-[10px]">
                                <Truck size={16} />
                                <span>White-Glove Insured Delivery</span>
                            </div>

                        </div>

                    </aside>

                </div>

            </div>

            <Footer />
        </main>
    );
};

export default CheckoutPage;