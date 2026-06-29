import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkoutService } from "./service/checkoutService";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { CheckCircle2, ShoppingBag, MapPin, CreditCard, ArrowRight } from "lucide-react";

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
            <main className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] font-inter flex flex-col justify-center">
                <Header />

                <div className="max-w-[1200px] mx-auto px-6 py-[60px] flex-1">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-black/10 border-t-black rounded-full animate-spin mb-5"></div>
                        <p>Authenticating & retrieving order details...</p>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] font-inter flex flex-col justify-center">
                <Header />

                <div className="max-w-[1200px] mx-auto px-6 py-[60px] flex-1">
                    <div className="bg-white border border-[#eaeaea] rounded-xl p-12 text-center max-w-[500px] mx-auto mt-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h2 className="text-2xl font-medium mb-3 text-[#c93b3b]">
                            Order Not Found
                        </h2>

                        <p className="text-[#666] mb-6 leading-relaxed">
                            {error || "We couldn't retrieve the details for this order."}
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] font-inter flex flex-col">
            <Header />
            <div className="max-w-[1200px] mx-auto px-6 py-[60px] flex-1">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* SUCCESS HEADER */}

                    <section className="text-center max-w-[680px] mx-auto mb-[50px]">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#f0f7f4] rounded-full text-[#2e7d32] mb-6">
                            <CheckCircle2 size={64} />
                        </div>

                        <h1 className="text-[36px] font-light tracking-[-0.02em] uppercase mb-4">
                            Thank You For Your Order
                        </h1>

                        <p className="text-base text-[#666] leading-relaxed mb-6">
                            Your order has been placed and is currently being processed.
                            An email confirmation has been sent to your registered address.
                        </p>

                        <div className="inline-block bg-[#1a1a1a] text-white px-[18px] py-2 rounded-[30px] text-sm tracking-[0.05em] font-medium">
                            Order Code:{" "}
                            <span className="text-[#d4af37] font-semibold">
                                {order.orderCode}
                            </span>
                        </div>
                    </section>

                    {/* GRID */}

                    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 mb-[60px]">

                        {/* LEFT */}

                        <div>

                            <h2 className="text-[20px] font-normal tracking-[0.05em] uppercase mb-5 border-b border-[#eaeaea] pb-[10px]">
                                Order Details
                            </h2>

                            <div className="bg-white border border-[#eaeaea] rounded-lg p-6 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">

                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center py-4 border-b border-[#f5f5f5] last:border-b-0 last:pb-0 first:pt-0"
                                        >
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-[#f9f9f9] border border-[#efefef] shrink-0">
                                                <img
                                                    src={
                                                        item.product?.images?.[0]?.url ||
                                                        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=150&q=80"
                                                    }
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 ml-5">
                                                <h3 className="text-[15px] font-medium text-[#111] mb-1">
                                                    {item.product?.name}
                                                </h3>

                                                {item.size && (
                                                    <p className="text-xs text-[#888] mb-1">
                                                        Size: {item.size}
                                                    </p>
                                                )}

                                                <p className="text-[13px] text-[#666]">
                                                    Qty: {item.quantity} × $
                                                    {Number(item.price || 0).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="ml-4 text-[15px] font-semibold text-[#111]">
                                                $
                                                {(
                                                    Number(item.price || 0) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#888] text-center py-5">
                                        No items found in this order.
                                    </p>
                                )}

                            </div>
                            {/* Right Column: Address and Payment */}
                            <div>
                                <h2 className="text-[20px] font-normal tracking-[0.05em] uppercase mb-5 border-b border-[#eaeaea] pb-[10px]">
                                    Delivery & Payment
                                </h2>

                                {/* Shipping Card */}
                                <div className="bg-white border border-[#eaeaea] rounded-lg p-6 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                                    <div className="flex items-center text-[#111] mb-4 text-[15px]">
                                        <MapPin size={18} />
                                        <h3 className="ml-[10px] text-[16px] font-medium uppercase tracking-[0.02em]">
                                            Shipping Address
                                        </h3>
                                    </div>

                                    <div>
                                        <p className="m-0 text-[#555] text-[14px] leading-[1.5] whitespace-pre-line">
                                            {order.shippingAddressDump}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Card */}
                                <div className="bg-white border border-[#eaeaea] rounded-lg p-6 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                                    <div className="flex items-center text-[#111] mb-4 text-[15px]">
                                        <CreditCard size={18} />
                                        <h3 className="ml-[10px] text-[16px] font-medium uppercase tracking-[0.02em]">
                                            Payment Details
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[#555] text-[14px] leading-[1.5]">
                                            Method:{" "}
                                            {order.paymentMethod === "BANK_TRANSFER"
                                                ? "Bank Concierge Transfer"
                                                : "Credit / Debit Card"}
                                        </p>

                                        <p className="text-[#555] text-[14px] leading-[1.5]">
                                            Status:{" "}
                                            <span className="bg-[#e8f5e9] text-[#2e7d32] px-[10px] py-1 rounded text-[12px] font-semibold uppercase tracking-[0.05em] inline-block">
                    {order.status}
                </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Assistance Card */}
                                <div className="bg-[#f7f6f2] border border-dashed border-[#dcdad4] rounded-lg p-6">
                                    <h3 className="text-[15px] font-semibold mb-2 uppercase tracking-[0.05em]">
                                        Need Assistance?
                                    </h3>

                                    <p className="text-[13px] text-[#666] leading-[1.6] mb-4">
                                        If you have any questions or would like to make changes to your
                                        order, please do not hesitate to contact our Maison Concierge.
                                    </p>

                                    <a
                                        href="mailto:concierge@maison.com"
                                        className="inline-flex items-center gap-[6px] text-[13px] text-[#1a1a1a] font-semibold border-b border-[#1a1a1a] pb-[2px] hover:text-[#d4af37] hover:border-[#d4af37] hover:gap-[10px] transition-all duration-200"
                                    >
                                        Contact Concierge
                                        <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="text-center mt-10">
                            <button
                                onClick={() => navigate("/")}
                                className="inline-flex items-center gap-[10px] bg-[#1a1a1a] text-white border-none px-9 py-4 rounded text-[14px] font-semibold uppercase tracking-[0.08em] cursor-pointer transition-all duration-300 hover:bg-[#d4af37] hover:text-[#1a1a1a] hover:shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                            >
                                <ShoppingBag size={18} />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                <Footer />
        </main>
);
};

export default OrderConfirmationPage;
