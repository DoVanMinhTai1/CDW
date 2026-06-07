import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CartItem = {
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
    quantity: number;
};

type CartProduct = Omit<CartItem, "quantity">;

type CartContextValue = {
    cartItems: CartItem[];
    cartCount: number;
    addToCart: (product: CartProduct) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: CartProduct) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);
            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id: number) => {
        setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const cartCount = useMemo(
        () => cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]
    );

    const value = useMemo(
        () => ({ cartItems, cartCount, addToCart, removeFromCart, updateQuantity }),
        [cartItems, cartCount, addToCart, removeFromCart, updateQuantity]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
