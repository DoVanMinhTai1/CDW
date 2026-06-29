import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Header from "../src/modules/header_footer/header";
import Footer from "../src/modules/header_footer/footer";
import {useToast} from "../src/hooks/useToast";
import {useMutation} from "../src/hooks/useMutation";
import {checkoutService} from "../src/modules/checkout/service/checkoutService";
import type {CartItem} from "../src/modules/cart/model";

export default function CheckoutReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {showToast} = useToast();

    const cart: CartItem[] = location.state?.cart || [];
    const shippingAddress = location.state?.shippingAddress;
    const paymentMethod = location.state?.paymentMethod;

    useEffect(() => {
        if (cart.length === 0 || !shippingAddress || !paymentMethod) {
            console.warn(
                "Missing checkout info, redirecting back to cart."
            );
            navigate("/cart");
        }
    }, [
        cart,
        shippingAddress,
        paymentMethod,
        navigate,
    ]);

    const {mutate: placeOrder, loading} = useMutation(
        async (orderRequest: any) => {
            return await checkoutService.createOrder(
                orderRequest
            );
        },
        (order) => {
            console.log(
                "Order placed successfully, backend response:",
                order
            );

            showToast(
                "Order placed successfully",
                "success"
            );

            navigate(
                `/order-confirmation/${order?.id}`
            );
        },
        (err) => {
            console.error(
                "Order placement failed:",
                err
            );

            showToast(
                err.message ||
                "Failed to place order",
                "error"
            );
        }
    );

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            showToast(
                "Cart is empty",
                "error"
            );
            return;
        }

        placeOrder({
            shippingAddress,
            paymentMethod,
        });
    };

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            (item.price || 0) *
            item.quantity,
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
            countryUpper.includes(
                "UNITED STATES"
            )
        ) {
            taxRate = 0.08;
        }
    }

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <>
            <Header/>
            <main className="min-h-screen bg-[#f8f7f5]">
                <div className="max-w-[1280px] mx-auto p-[60px]">
                    <div className="flex gap-[14px] text-[13px] tracking-[1.5px] text-[#9d9d9d] mb-[60px]">
                        <span>01 SHIPPING</span>
                        <span>›</span>
                        <span>02 PAYMENT</span>
                        <span>›</span>
                        <span className="text-[#3d0909] font-semibold">
                            03 REVIEW
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-[2fr_360px] gap-10">
                        <section>
                            <h1 className="text-[48px] lg:text-[72px] font-serif text-[#1f1f1f] font-normal mb-[50px]">
                                Confirm Your Selection
                            </h1>

                            <h2 className="text-[34px] lg:text-[46px] font-serif font-normal mb-[30px]">
                                Your Heritage Collection
                            </h2>

                            {cart.map((item) => (
                                <article key={item.productId} className="bg-white border border-[#ece8e4] p-5 flex items-center mb-6">
                                    <img src={ item.thumbnailUrl } alt={ item.productName }  className=" w-[120px] h-[120px] object-cover " />
                                    <div className="flex-1 ml-6">
                                        <span className=" text-[12px] tracking-[2px] uppercase text-[#666] " >
                                            Fine Jewelry
                                        </span>
                                        <h3 className=" text-[32px] font-serif font-normal my-[10px] " >  { item.productName } </h3>
                                        {item.attributes && ( <p className="text-[#666]">{ item.attributes } </p> )}
                                    </div>

                                    <div className="text-right">
                                        <span className="block mb-[10px] text-[14px]"> Qty:{" "} {  item.quantity }  </span>
                                        <strong className=" text-[36px] font-serif font-normal " >
                                            $  {(
                                                (item.price ||
                                                    0) *
                                                item.quantity
                                            ).toFixed(
                                                2
                                            )}
                                        </strong>

                                    </div>

                                </article>
                            ))}

                            <div className="h-px bg-[#e3ddd8] my-10"/>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Shipping Address */}
                                <div className="  bg-white  border  border-[#ece8e4]  p-6 "
                                >
                                    <div className="flex justify-between mb-6">
                                        <h3 className=" font-serif text-[28px] font-normal ">
                                            Shipping Address
                                        </h3>

                                        <button className=" bg-transparent border-none underline cursor-pointer "
                                            onClick={() =>
                                                navigate(
                                                    "/checkout/shipping",
                                                    {
                                                        state: {
                                                            cart,
                                                        },
                                                    }
                                                )
                                            }
                                        >
                                            Change
                                        </button>

                                    </div>

                                    {shippingAddress ? (
                                        <>
                                            <p className="leading-[1.9]">
                                                {
                                                    shippingAddress.firstName
                                                }{" "}
                                                {
                                                    shippingAddress.lastName
                                                }
                                            </p>

                                            <p className="leading-[1.9]">
                                                {
                                                    shippingAddress.streetAddress
                                                }
                                            </p>

                                            <p className="leading-[1.9]">
                                                {
                                                    shippingAddress.city
                                                }
                                                {shippingAddress.postalCode
                                                    ? `, ${shippingAddress.postalCode}`
                                                    : ""}
                                            </p>

                                            <p className="leading-[1.9]">
                                                {
                                                    shippingAddress.country
                                                }
                                            </p>
                                        </>
                                    ) : (
                                        <p>
                                            No address
                                            provided
                                        </p>
                                    )}
                                </div>
                                ```tsx
                                {/* Payment Method */}
                                <div
                                    className=" bg-white border border-[#ece8e4] p-6 " >
                                    <div className="flex justify-between mb-6">
                                        <h3  className="font-serif text-[28px] font-normal " >
                                            Payment Method
                                        </h3>

                                        <button className="  bg-transparent border-none underline cursor-pointer "
                                            onClick={() =>
                                                navigate("/checkout/payment",
                                                    {
                                                        state: {
                                                            cart,
                                                            shippingAddress,
                                                        },
                                                    }
                                                )
                                            }
                                        >
                                            Change
                                        </button>

                                    </div>

                                    <div className="flex gap-4 items-center">

                                        <div
                                            className=" w-[60px] h-[40px] bg-[#111] text-white flex items-center justify-center "
                                        >
                                            {paymentMethod ===
                                            "BANK_TRANSFER"
                                                ? "🏦"
                                                : "💳"}
                                        </div>

                                        <div>
                                            <p>
                                                {paymentMethod ===
                                                "BANK_TRANSFER"
                                                    ? "Bank Concierge Transfer"
                                                    : "Credit Card Payment"}
                                            </p>

                                            <span className="block text-[#666] mt-[5px]">
                                                Maison secure payment
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="h-px bg-[#e3ddd8] my-10"/>

                            {/* Guarantee */}
                            <div className=" bg-[#f3eee8] p-[30px] flex gap-5 ">

                                <div className="  w-[44px] h-[44px] border border-[#5b1010] rounded-full flex items-center justify-center text-[#5b1010] " >
                                    ✦
                                </div>

                                <div>

                                    <h4 className="mb-2">
                                        Maison Guarantee
                                    </h4>

                                    <p className="text-[#555] leading-[1.7]">
                                        Your order includes white-glove
                                        courier delivery, an official
                                        Certificate of Authenticity,
                                        and our lifetime care coverage.
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* RIGHT */}
                        <aside className=" bg-white  border  border-[#ece8e4] p-[34px]  h-fit " >
                            <h2 className=" text-[56px]  font-serif  font-normal  mb-[30px] " >  Summary </h2>

                            <div className="flex justify-between mb-[22px]">
                                <span>Subtotal</span>
                                <span>
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between mb-[22px]">
                                <span>
                                    Complimentary Shipping
                                </span>
                                <span>$0.00</span>
                            </div>

                            <div className="flex justify-between mb-[22px]">
                                <span>
                                    Estimated Tax
                                </span>
                                <span>
                                    ${tax.toFixed(2)}
                                </span>
                            </div>

                            <div className="h-px bg-[#ece8e4] my-[30px]"/>

                            <div className="flex justify-between items-center">

                                <span>Total</span>

                                <strong className=" text-[54px] font-serif text-[#3d0909] font-normal "  >
                                    ${total.toFixed(2)}
                                </strong>

                            </div>

                            <small  className=" block text-right text-[#999] mt-[6px] " >   INCLUSIVE OF VAT </small>

                            <button
                                onClick={handlePlaceOrder} disabled={loading}
                                className=" w-full h-16  border-none mt-[35px] bg-[#8b0000] text-white tracking-[2px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed "
                            >
                                {loading
                                    ? "PROCESSING..."
                                    : "PLACE ORDER"}
                            </button>

                            <p
                                className=" mt-5 text-center text-[#666] leading-[1.6] text-[13px] " >
                                By placing your order, you agree
                                to our Terms of Service and
                                Privacy Policy.
                            </p>

                            <div className="mt-[30px] text-center">
                                <span className="block mb-2">
                                    Need assistance?
                                </span>

                                <a href="/" className=" text-[#3d0909] underline tracking-[1px] " >  CONTACT A CONCIERGE  </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer/>

        </>
    );
}
