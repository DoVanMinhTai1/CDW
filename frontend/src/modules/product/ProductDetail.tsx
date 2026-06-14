import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./ProductDetail.css";
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
        () => productId ? productService.getProduct(productId) : Promise.reject(new Error('No product id')),
        [productId]
    );

    // Check if product is in wishlist
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
        (qty: number) => cartService.addToCart({ 
            productId: product?.id ? String(product.id) : (productId || ''), 
            size: selectedSize, 
            quantity: qty 
        }),
        () => showToast('Added to cart', 'success'),
        (err) => showToast(err.message, 'error')
    );

    const { mutate: buyNow, loading: buying } = useMutation(
        async () => {
            await cartService.addToCart({ 
                productId: product?.id ? String(product.id) : (productId || ''), 
                size: selectedSize, 
                quantity 
            });
            const updatedCart = await cartService.getCart();
            return updatedCart;
        },
        (updatedCart) => {
            showToast('Proceeding to checkout', 'success');
            const normalizeCart = (data: any): CartItem[] => {
                if (!data) return [];
                if (Array.isArray(data)) return data;
                if (Array.isArray(data.content)) return data.content;
                if (Array.isArray(data.items)) return data.items;
                if (Array.isArray(data.cart)) return data.cart;
                if (Array.isArray(data.data)) return data.data;
                return [];
            };
            navigate('/checkout', { state: { cart: normalizeCart(updatedCart) } });
        },
        (err) => showToast(err.message, 'error')
    );

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            showToast('Please login to add to wishlist', 'error');
            navigate('/login');
            return;
        }

        try {
            setLoadingWishlist(true);
            if (inWishlist && wishlistItemId) {
                // Remove from wishlist
                await wishlistService.removeFromWishlist(wishlistItemId);
                setInWishlist(false);
                setWishlistItemId(null);
                showToast('Removed from wishlist', 'success');
            } else {
                // Add to wishlist
                await wishlistService.addToWishlist(productId || '');
                setInWishlist(true);
                // Re-fetch to get the wishlist item id
                const wishlist = await wishlistService.getMyWishlist();
                const productIdNum = parseInt(productId || '0');
                const item = wishlist.find((w: any) => w.productId === productIdNum);
                if (item) {
                    setWishlistItemId(item.id);
                }
                showToast('Added to wishlist', 'success');
            }
        } catch (error: any) {
            showToast(error.message || 'Error updating wishlist', 'error');
        } finally {
            setLoadingWishlist(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading product...</div>;

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <p className="text-red-600">{error.message}</p>
                <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
            </div>
        );
    }

    const gallery = [product?.image].filter(Boolean) as string[];
    if (!selectedImage && gallery.length) setSelectedImage(gallery[0]);

    return (
        <main className="product-detail">
            <Header />
            <section className="product-detail__top">
                <div className="product-detail__gallery">
                    <div className="product-detail__thumbnails">
                        {gallery.map((image, index) => (
                            <button
                                key={index}
                                className={`product-detail__thumbnail ${selectedImage === image ? "active" : ""}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image} alt="" />
                            </button>
                        ))}
                    </div>

                    <div className="product-detail__main-image">
                        <img src={selectedImage || ''} alt={product?.name || ''} />
                    </div>
                </div>

                <div className="product-detail__info">
                    <p className="product-detail__collection">{product?.category}</p>
                    <h1>{product?.name}</h1>
                    <p className="product-detail__price">{product ? `$${product.price}` : ''}</p>

                    <div className="product-detail__divider" />

                    <div className="product-detail__description">
                        <h3>The Design</h3>
                        <p>{product?.description}</p>
                    </div>

                    <div className="product-detail__sizes">
                        <div className="product-detail__sizes-header">
                            <span>Select Size (US)</span>
                        </div>

                        <div className="product-detail__size-grid">
                            {[5,6,7,8,9].map((size) => (
                                <button
                                    key={size}
                                    className={`product-detail__size-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4 items-center">
                        <label>Quantity:</label>
                        <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} className="border px-2 py-1 w-16" />
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => addToCart(quantity)} disabled={adding} className="px-6 py-2 bg-blue-500 text-white rounded">{adding ? 'Adding...' : 'Add to Cart'}</button>
                        <button onClick={() => buyNow()} disabled={buying} className="px-6 py-2 bg-green-500 text-white rounded">{buying ? 'Processing...' : 'Buy Now'}</button>
                        <button 
                            onClick={handleWishlistToggle} 
                            disabled={loadingWishlist}
                            className={`px-6 py-2 rounded text-white ${inWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        >
                            {loadingWishlist ? 'Loading...' : (inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist')}
                        </button>
                    </div>

                    <div className="product-detail__benefits">
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