import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../../api/types";
import {
  getCartSummary,
  addToCart as apiAddToCart,
  removeItem as apiRemoveItem,
  updateItemQuantity as apiUpdateQuantity,
} from "./service/cartService";

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (payload: { productId: string; size?: number; quantity?: number }) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart on mount and when user changes (AuthContext can trigger refresh later)
  const loadCart = useCallback(async () => {
    try {
      const summary = await getCartSummary();
      setCartItems(summary.items ?? []);
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (payload: { productId: string; size?: number; quantity?: number }) => {
    await apiAddToCart(payload);
    await loadCart();
  }, [loadCart]);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    await apiRemoveItem(cartItemId);
    await loadCart();
  }, [loadCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    await apiUpdateQuantity(cartItemId, quantity);
    await loadCart();
  }, [loadCart]);

  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

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
