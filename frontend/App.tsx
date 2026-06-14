import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./src/modules/home/HomePage";
import CollectionPage from "./src/modules/collection/CollectionPage";
import ProductDetail from "./src/modules/product/ProductDetail";
import CartPage from "./src/modules/cart/CartPage";
import CheckoutPage from "./src/modules/checkout/CheckoutPage";
import OrderConfirmationPage from "./src/modules/checkout/OrderConfirmationPage";
import LoginPage from "./src/modules/auth/Login";
import RegisterPage from "./src/modules/auth/Register";
import ForgotPasswordPage from "./src/modules/auth/ForgotPassword";
import { CartProvider } from "./src/modules/cart/CartContext";
import { ToastProvider } from "./src/hooks/useToast";
import { AuthProvider } from "./src/modules/auth/AuthContext";
import PaymentPage from "./CheckoutPage/PaymentPage";
import CheckoutReviewPage from "./CheckoutPage/ReviewPage";
import AdminDashboard from "./src/modules/admin/AdminDashboard";
import AdminRoute from "./src/modules/admin/AdminRoute";
import AdminProducts from "./src/modules/admin/AdminProducts";
import AdminCategories from "./src/modules/admin/category/AdminCategories";
import AdminOrders from "./src/modules/admin/AdminOrders";
import AdminUsers from "./src/modules/admin/AdminUsers";
import AccountDashboard from "./src/modules/profile/AccountDashBoard";
import OrderHistory from "./src/modules/orderhistory/OrderHistory";
import WishList from "./src/modules/wishlist/WishList";

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

