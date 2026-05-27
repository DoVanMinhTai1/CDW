import React, { useState } from "react";
import { useParams } from "react-router-dom";

import "./ProductDetail.css";
import Footer from "../header_footer/footer.tsx";
import Header from "../header_footer/header.tsx";

const productData = [
    {
        category: 'High Jewelry',
        name: 'Lumière Drop Earrings',
        price: '$12,400',
        image:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
        description:
            'A refined pair of drop earrings designed to catch the light with every movement, combining classic form with modern precision.',
    },
    {
        category: 'Collections',
        name: 'Solstice Platinum Ring',
        price: '$8,900',
        image:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
        description:
            'A sculptural platinum ring with an immaculate profile, created for those who seek enduring elegance and subtle drama.',
    },
    {
        category: 'Bespoke',
        name: 'Elysian Gold Choker',
        price: '$15,200',
        image:
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop',
        description:
            'A bespoke choker that blends warm gold with museum-quality stones, made to be worn as a signature heirloom.',
    },
    {
        category: 'Legacy',
        name: 'Heritage Cuff Bracelet',
        price: '$22,000',
        image:
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop',
        description:
            'A bold cuff finished with refined details, designed to carry the legacy of handcrafted luxury through every gesture.',
    },
    {
        category: 'High Jewelry',
        name: 'Celestial Sapphire Studs',
        price: '$9,600',
        image:
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop',
        description:
            'Sapphire studs that balance celestial color and exceptional cut, perfect for both day and evening refinement.',
    },
    {
        category: 'Bespoke',
        name: 'Emerald Verdant Necklace',
        price: '$45,000',
        image:
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
        description:
            'An emerald necklace with timeless allure, crafted to be the centerpiece of any curated collection.',
    },
];

const galleryImages = [
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
];

const relatedProducts = [
    {
        category: "Earrings",
        name: "L'Aube Drop Earrings",
        price: "$12,800",
        image:
            "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80",
    },
    {
        category: "Bracelets",
        name: "Eternity Link Bracelet",
        price: "$8,400",
        image:
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
    },
    {
        category: "Necklaces",
        name: "L'Aube Pendant",
        price: "$15,200",
        image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
    },
];

const reviews = [
    {
        title: "Absolutely Breathless",
        date: "October 14, 2023",
        text: `"The craftsmanship is beyond what I expected. The way the light catches the pear cut is hypnotic. It truly feels like a piece of heritage I will pass down for generations."`,
        author: "— Elizabeth W.",
    },
    {
        title: "Unparalleled Elegance",
        date: "September 2, 2023",
        text: `"From the packaging to the ring itself, everything screams luxury. The concierge service helped me find the perfect size. Worth every penny."`,
        author: "— Julian R.",
    },
];

const sizes = [5, 6, 7, 8, 9];

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const selectedIndex = Number(productId);
    const selectedProduct = productData[selectedIndex] ?? productData[0];
    const productGallery = [selectedProduct.image, ...galleryImages.slice(1)];

    const [selectedImage, setSelectedImage] = useState(productGallery[0]);
    const [selectedSize, setSelectedSize] = useState(6);

    return (
        <main className="product-detail">
            <Header />
            <section className="product-detail__top">
                <div className="product-detail__gallery">
                    <div className="product-detail__thumbnails">
                        {galleryImages.map((image, index) => (
                            <button
                                key={index}
                                className={`product-detail__thumbnail ${
                                    selectedImage === image ? "active" : ""
                                }`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image} alt="" />
                            </button>
                        ))}
                    </div>

                    <div className="product-detail__main-image">
                        <img src={selectedImage} alt="L'Aube Solitaire Ring" />
                    </div>
                </div>

                <div className="product-detail__info">
                    <p className="product-detail__collection">
                        {selectedProduct.category}
                    </p>

                    <h1>{selectedProduct.name}</h1>

                    <p className="product-detail__price">{selectedProduct.price}</p>

                    <div className="product-detail__divider" />

                    <div className="product-detail__description">
                        <h3>The Design</h3>

                        <p>{selectedProduct.description}</p>
                    </div>

                    <div className="product-detail__sizes">
                        <div className="product-detail__sizes-header">
                            <span>Select Size (US)</span>
                            <button type="button">Size Guide</button>
                        </div>

                        <div className="product-detail__size-grid">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`product-detail__size-btn ${
                                        selectedSize === size ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="product-detail__add-btn">
                        Add to Cart
                    </button>

                    <button className="product-detail__appointment-btn">
                        Book a Boutique Appointment
                    </button>

                    <div className="product-detail__benefits">
                        <span>Insured Shipping</span>
                        <span>GIA Certified</span>
                    </div>
                </div>
            </section>

            <section className="product-detail__related">
                <div className="product-detail__section-title">
                    <h2>Complete the Look</h2>
                    <span />
                </div>

                <div className="product-detail__related-grid">
                    {relatedProducts.map((product) => (
                        <article key={product.name} className="product-card">
                            <div className="product-card__image">
                                <img src={product.image} alt={product.name} />
                            </div>

                            <p className="product-card__category">
                                {product.category}
                            </p>

                            <h3>{product.name}</h3>

                            <p className="product-card__price">{product.price}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="product-detail__reviews">
                <div className="product-detail__reviews-sidebar">
                    <h2>Reviews</h2>

                    <p className="product-detail__rating">
                        ☆☆☆☆☆ 5.0 (12 Reviews)
                    </p>

                    <button>Write a Review</button>
                </div>

                <div className="product-detail__reviews-list">
                    {reviews.map((review) => (
                        <article key={review.title} className="review-card">
                            <div className="review-card__top">
                                <h3>{review.title}</h3>
                                <span>{review.date}</span>
                            </div>

                            <p className="review-card__stars">☆☆☆☆☆</p>

                            <p className="review-card__text">{review.text}</p>

                            <p className="review-card__author">{review.author}</p>
                        </article>
                    ))}
                </div>
            </section>
            <Footer />
        </main>

    );
};

export default ProductDetail;