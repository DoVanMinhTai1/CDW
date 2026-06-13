import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import PaymentPage from "./CheckoutPage/PaymentPage";
import CheckoutReviewPage from "./CheckoutPage/ReviewPage";

function App() {
  const navigate = useNavigate();

  return (
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
      <Route
        path="/login"
        element={
          <LoginPage
            onSwitchToRegister={() => navigate("/register")}
            onForgotPassword={() => navigate("/forgot-password")}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage onBackToLogin={() => navigate("/login")} />
        }
      />
      <Route
        path="/register"
        element={<RegisterPage onSwitchToLogin={() => navigate("/login")} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </CartProvider>
  );
}

export default App;
