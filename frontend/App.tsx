import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./login_register/login";
import RegisterPage from "./login_register/register";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage onSwitchToRegister={() => navigate("/register")} />}
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
