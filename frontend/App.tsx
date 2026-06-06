import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./HomePage/Home";
import LoginPage from "./login_register/login";
import RegisterPage from "./login_register/register";
import ForgotPasswordPage from "./login_register/forgot-password";
import CollectionPage from "./CollectionPage/CollectionPage";
import ProductDetail from "./ProductDetail/ProductDetail";
import CartPage from "./CartPage/CartPage";
import CheckoutPage from "./CheckoutPage/CheckoutPage";
import PaymentPage from "./CheckoutPage/PaymentPage";
import CheckoutReviewPage from "./CheckoutPage/ReviewPage";
import { CartProvider } from "./cart/CartContext";

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
      <Route path="/checkout" element={<Navigate to="/checkout/shipping" replace />} />
      <Route path="/checkout/shipping" element={<CheckoutPage />} />
      <Route path="/checkout/payment" element={<PaymentPage />} />
      <Route path="/checkout/review" element={<CheckoutReviewPage />} />
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
