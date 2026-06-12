export interface Product { id: string; name: string; description?: string; price: number; image?: string; }
export interface User { id: string; email: string; name?: string; }
export interface CartItem { productId: string; quantity: number; product?: Product; }
export interface Order { id: string; items: CartItem[]; total: number; status?: string; }
export interface Collection { id: string; name: string; products?: Product[]; }
