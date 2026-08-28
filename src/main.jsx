import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { useAuthStore } from "./stores/authStore.js";
import { useCartStore } from "./stores/cartStore.js";

function Root() {
  useEffect(() => {
    useAuthStore.getState().init();
    useCartStore.getState().refreshCart();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);
