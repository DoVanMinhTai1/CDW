import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useMutation } from "../../hooks/useMutation";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../auth/AuthContext";
import { productService } from "./service/productService";
import { cartService } from "../cart/service/cartService";
import { wishlistService } from "../wishlist/service/wishlistService";
import type { CartItem } from "../../api/types";

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { isAuthenticated } = useAuth();

    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState(6);
    const [quantity, setQuantity] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    const { data: product, loading, error, refetch } = useApiRequest(
        () => productId ? productService.getProduct(productId) : Promise.reject(new Error("No product id")),
        [productId]
    );

    useEffect(() => {
        if (!isAuthenticated || !productId) return;

        const checkWishlist = async () => {
            try {
                setLoadingWishlist(true);
                const wishlist = await wishlistService.getMyWishlist();
                const productIdNum = parseInt(productId);

                const item = wishlist.find((w: any) => w.productId === productIdNum);

                if (item) {
                    setInWishlist(true);
                    setWishlistItemId(item.id);
                } else {
                    setInWishlist(false);
                    setWishlistItemId(null);
                }
            } catch (error) {
                console.error('Error checking wishlist:', error);
            } finally {
                setLoadingWishlist(false);
            }
        };

        checkWishlist();
    }, [productId, isAuthenticated]);

    const { mutate: addToCart, loading: adding } = useMutation(
        (qty: number) =>
            cartService.addToCart({
                productId: product?.id ? String(product.id) :(productId || ''),
                size: selectedSize,
                quantity: qty,
            }),
        () => showToast("Added to cart", "success"),
        (err) => showToast(err.message, "error")
    );

    const { mutate: buyNow, loading: buying } = useMutation(
        async () => {
            await cartService.addToCart({
                productId: product?.id ? String(product.id) : productId || "",
                size: selectedSize,
                quantity,
            });

            const updatedCart = await cartService.getCart();
            return updatedCart;
        },
        (updatedCart) => {
            showToast("Proceeding to checkout", "success");

            const normalizeCart = (data: any): CartItem[] => {
                if (!data) return [];
                if (Array.isArray(data)) return data;
                if (Array.isArray(data.content)) return data.content;
                if (Array.isArray(data.items)) return data.items;
                if (Array.isArray(data.cart)) return data.cart;
                if (Array.isArray(data.data)) return data.data;
                return [];
            };

            navigate("/checkout", {
                state: {
                    cart: normalizeCart(updatedCart),
                },
            });
        },
        (err) => showToast(err.message, "error")
    );

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            showToast("Please login to add to wishlist", "error");
            navigate("/login");
            return;
        }

        try {
            setLoadingWishlist(true);

            if (inWishlist && wishlistItemId) {
                await wishlistService.removeFromWishlist(wishlistItemId);

                setInWishlist(false);
                setWishlistItemId(null);

                showToast("Removed from wishlist", "success");
            } else {
                await wishlistService.addToWishlist(productId || '');

                setInWishlist(true);

                // Re-fetch to get the wishlist item id
                const wishlist = await wishlistService.getMyWishlist();
                const productIdNum = parseInt(productId || "0");

                const item = wishlist.find((w: any) => w.productId === productIdNum);

                if (item) {
                    setWishlistItemId(item.id);
                }

                showToast("Added to wishlist", "success");
            }
        } catch (error: any) {
            showToast(error.message || 'Error updating wishlist', 'error');
        } finally {
            setLoadingWishlist(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading product...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <p className="text-red-600">{error.message}</p>
                <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    const gallery = [product?.image].filter(Boolean) as string[];

    if (!selectedImage && gallery.length) {
        setSelectedImage(gallery[0]);
    }

    return (
        <main className="bg-[#f7f5f2] text-[#2b1d1d] font-sans">
            <Header />

            <section className="max-w-[1280px] mx-auto px-6 pt-14 pb-20 grid grid-cols-[1.15fr_0.85fr] gap-12 max-lg:grid-cols-1">
                <div className="flex gap-4 max-md:flex-col-reverse">
                    <div className="flex flex-col gap-3 max-md:flex-row">
                        {gallery.map((image, index) => (
                            <button
                                key={index}
                                className={`w-[88px] h-[88px] p-0 overflow-hidden cursor-pointer bg-white border ${selectedImage === image ? "border-[#5b0f16]" : "border-transparent"}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-white">
                        <img
                            src={selectedImage || ""}
                            alt={product?.name || ""}
                            className="w-full block aspect-square object-cover"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.14em] mb-4 text-[#7a6d6d]">
                        {product?.category}
                    </p>

                    <h1 className="font-serif text-[4rem] leading-none font-medium mb-6 max-lg:text-[3rem]">
                        {product?.name}
                    </h1>

                    <p className="text-[2.2rem] mb-8 font-serif">
                        {product ? `$${product.price}` : ""}
                    </p>

                    <div className="w-full h-px bg-black/10 mb-8"></div>

                    <div>
                        <h3 className="uppercase text-[0.72rem] tracking-[0.14em] mb-4">
                            The Design
                        </h3>

                        <p className="leading-[1.9] text-[#655d5d] mb-8">
                            {product?.description}
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-4">
                            <span className="text-[0.72rem] uppercase tracking-[0.14em]">
                                Select Size (US)
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-3 mb-8">
                            {[5, 6, 7, 8, 9].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-[52px] border transition-all ${selectedSize === size ? "bg-[#5b0f16] text-white border-[#5b0f16]" : "bg-transparent border-black/15"}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4 items-center">
                        <label>Quantity:</label>

                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="border px-2 py-1 w-16 bg-white"
                        />
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={() => addToCart(quantity)}
                            disabled={adding}
                            className="px-6 py-3 bg-[#5b0f16] text-white rounded"
                        >
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>

                        <button
                            onClick={() => buyNow()}
                            disabled={buying}
                            className="px-6 py-3 bg-green-600 text-white rounded"
                        >
                            {buying ? "Processing..." : "Buy Now"}
                        </button>

                        <button
                            onClick={handleWishlistToggle}
                            disabled={loadingWishlist}
                            className={`px-6 py-3 rounded text-white ${inWishlist ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}
                        >
                            {loadingWishlist
                                ? "Loading..."
                                : inWishlist
                                    ? "❤️ In Wishlist"
                                    : "🤍 Add to Wishlist"}
                        </button>
                    </div>

                    <div className="flex gap-8 mt-8 text-[0.72rem] uppercase tracking-[0.08em] text-[#7a6d6d]">
                        <span>Insured Shipping</span>
                        <span>GIA Certified</span>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ProductDetail;