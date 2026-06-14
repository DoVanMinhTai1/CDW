import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./modules/home/HomePage";
import CollectionPage from "./modules/collection/CollectionPage";
import ProductDetail from "./modules/product/ProductDetail";
import CartPage from "./modules/cart/CartPage";
import CheckoutPage from "./modules/checkout/CheckoutPage";
import OrderConfirmationPage from "./modules/checkout/OrderConfirmationPage";
import LoginPage from "./modules/auth/Login";
import RegisterPage from "./modules/auth/Register";
import ForgotPasswordPage from "./modules/auth/ForgotPassword";
import { CartProvider } from "./modules/cart/CartContext";
import { ToastProvider } from "./hooks/useToast";
import { AuthProvider } from "./modules/auth/AuthContext";
import PaymentPage from "../CheckoutPage/PaymentPage";
import CheckoutReviewPage from "../CheckoutPage/ReviewPage";
import AdminDashboard from "./modules/admin/AdminDashboard";
import AdminRoute from "./modules/admin/AdminRoute";
import AdminProducts from "./modules/admin/AdminProducts";
import AdminCategories from "./modules/admin/category/AdminCategories";
import AdminOrders from "./modules/admin/AdminOrders";
import AdminUsers from "./modules/admin/AdminUsers";
import AccountDashboard from "./modules/profile/AccountDashBoard";
import OrderHistory from "./modules/orderhistory/OrderHistory";
import WishList from "./modules/wishlist/WishList";

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/shipping" element={<CheckoutPage />} />
            <Route path="/checkout/payment" element={<PaymentPage />} />
            <Route path="/checkout/review" element={<CheckoutReviewPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/profile" element={<AccountDashboard />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

