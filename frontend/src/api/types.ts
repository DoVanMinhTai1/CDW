export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    fullName?: string;
    username?: string;
    roles?: string[];
}

export interface CartItem {
    cartItemId: number;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subTotal: number;
    thumbnailUrl: string;
    attributes?: string | null;
    product?: Product;
}

export interface CartSummaryResponse {
    items: CartItem[];
    subTotal: number;
    shippingMethod: string;
    shippingCost: number;
    appliedPromoCode?: string;
    discountAmount: number;
    estimatedTotal: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status?: string;
}

export interface Collection {
    id: string;
    name: string;
    products?: Product[];
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface ProductItem {
    id: number;
    name: string;
    collectionName: string;
    price: number;
    thumbnailUrl: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Material {
    id: number;
    name: string;
    colorHex: string;
}