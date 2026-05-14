import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./login_register/login";
import RegisterPage from "./login_register/register";
import ForgotPasswordPage from "./login_register/forgot-password";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
