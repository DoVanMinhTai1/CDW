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
                productId: product?.id ? String(product.id) : (productId || ''),
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
        <main className="bg-[#fcfbfa] text-[#2b1d1d] font-sans antialiased">
            <Header />

            <section className="max-w-[1280px] mx-auto px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-16">
                {/* LEFT COLUMN: Gallery & Image Display */}
                <div className="flex gap-4 flex-col-reverse md:flex-row">
                    {/* Thumbnails */}
                    <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none shrink-0">
                        {gallery.map((image, index) => (
                            <button
                                key={index}
                                className={`w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] p-0 overflow-hidden rounded-md cursor-pointer bg-white border transition-all duration-200 ${selectedImage === image
                                        ? "border-[#5b0f16] shadow-sm scale-[1.02]"
                                        : "border-gray-200 hover:border-gray-400"
                                    }`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Active Image */}
                    <div className="flex-1 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <img
                            src={selectedImage || ""}
                            alt={product?.name || ""}
                            className="w-full block aspect-square object-cover transition-all duration-300 ease-in-out"
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Information */}
                <div className="flex flex-col pt-2">
                    {/* Category */}
                    <p className="text-[0.75rem] uppercase tracking-[0.16em] font-medium mb-3 text-neutral-400">
                        {product?.category}
                    </p>

                    {/* Product Name */}
                    <h1 className="font-serif text-[2.5rem] sm:text-[3.2rem] leading-[1.15] font-semibold mb-4 text-[#1a1111]">
                        {product?.name}
                    </h1>

                    {/* Price */}
                    <p className="text-2xl sm:text-3xl font-medium tracking-tight text-[#5b0f16] mb-6">
                        {product ? `$${product.price}` : ""}
                    </p>

                    <div className="w-full h-px bg-neutral-200/80 mb-6"></div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="uppercase text-[0.72rem] tracking-[0.14em] font-bold text-neutral-500 mb-3">
                            The Design
                        </h3>
                        <p className="leading-[1.75] text-[0.95rem] text-[#655d5d]">
                            {product?.description}
                        </p>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-neutral-500">
                                Select Size (US)
                            </span>
                            <a href="#size-guide" className="text-xs text-[#5b0f16] underline underline-offset-2 opacity-80 hover:opacity-100">
                                Size Guide
                            </a>
                        </div>

                        <div className="grid grid-cols-5 gap-2 max-w-sm">
                            {[5, 6, 7, 8, 9].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-11 rounded text-sm font-medium transition-all duration-200 border ${selectedSize === size
                                            ? "bg-[#5b0f16] text-white border-[#5b0f16] shadow-sm"
                                            : "bg-white border-gray-200 text-neutral-700 hover:border-gray-400"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex gap-4 mb-8 items-center">
                        <span className="text-[0.72rem] uppercase tracking-[0.14em] font-bold text-neutral-500">
                            Quantity:
                        </span>
                        <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="px-3 py-2 w-16 text-center text-sm font-medium focus:outline-none text-neutral-800"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full mb-8">
                        {/* Add to Cart */}
                        <button
                            onClick={() => addToCart(quantity)}
                            disabled={adding}
                            className="flex-1 px-6 py-3.5 bg-transparent border border-[#5b0f16] text-[#5b0f16] font-medium text-sm tracking-wide rounded-md transition-all duration-200 hover:bg-[#5b0f16]/5 disabled:opacity-50"
                        >
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>

                        {/* Buy Now */}
                        <button
                            onClick={() => buyNow()}
                            disabled={buying}
                            className="flex-1 px-6 py-3.5 bg-[#5b0f16] text-white font-medium text-sm tracking-wide rounded-md transition-all duration-200 hover:bg-[#450b10] shadow-sm hover:shadow disabled:opacity-50"
                        >
                            {buying ? "Processing..." : "Buy Now"}
                        </button>

                        {/* Wishlist Icon Button */}
                        <button
                            onClick={handleWishlistToggle}
                            disabled={loadingWishlist}
                            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            className={`px-4 py-3.5 rounded-md border transition-all duration-200 flex items-center justify-center border-gray-200 ${inWishlist
                                    ? "bg-red-50 text-red-500 border-red-200"
                                    : "bg-white text-gray-400 hover:text-red-500 hover:border-red-200"
                                }`}
                        >
                            {loadingWishlist ? (
                                <span className="text-xs animate-pulse text-gray-400">...</span>
                            ) : inWishlist ? (
                                <span className="text-lg leading-none">❤️</span>
                            ) : (
                                <span className="text-lg leading-none">🤍</span>
                            )}
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-6 pt-2 border-t border-neutral-100 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5b0f16]/60"></span>
                            Insured Shipping
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5b0f16]/60"></span>
                            GIA Certified
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ProductDetail;