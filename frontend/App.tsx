import { useState } from "react";
import "./App.css";
import LoginPage from "./login_register/login";
import RegisterPage from "./login_register/register";

function App() {
  const [page, setPage] = useState<"login" | "register">("login");

  if (page === "register") {
    return <RegisterPage onSwitchToLogin={() => setPage("login")} />;
  }

  return <LoginPage onSwitchToRegister={() => setPage("register")} />;
}

export default App;
