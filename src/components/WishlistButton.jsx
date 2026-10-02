import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useWishlistStore } from "../stores/wishlistStore";
import { useAuthStore } from "../stores/authStore";

export default function WishlistButton({
    productId,
    className = ""
}) {
    const user = useAuthStore((state) => state.user);

    const navigate = useNavigate();
    const location = useLocation();

    const isWishlisted = useWishlistStore(
        (state) => state.isWishlisted(productId)
    );

    const toggle = useWishlistStore(
        (state) => state.toggle
    );

    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate("/login", {
                state: {
                    from: location.pathname
                }
            });

            return;
        }

        await toggle(productId);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={
                isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
            }
            title={
                isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
            }
            className={className}
        >
            <Heart
                size={18}
                strokeWidth={1.75}
                fill={
                    isWishlisted
                        ? "currentColor"
                        : "none"
                }
                className={
                    isWishlisted
                        ? "text-red-500"
                        : "text-neutral-500 transition-colors"
                }
            />
        </button>
    );
}