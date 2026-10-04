import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";

import { useAuthStore } from "./stores/authStore.js";
import { useCartStore } from "./stores/cartStore.js";
import { useWishlistStore } from "./stores/wishlistStore.js";


function Root() {
  useEffect(() => {
    useAuthStore.getState().init();
    useCartStore.getState().refreshCart();
    useWishlistStore.getState().refreshWishlist();
  }, []);

  return <App />;
}


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);