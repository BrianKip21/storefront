import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useWishlistStore } from "../stores/wishlistStore";

import ProductGrid from "../components/ProductGrid";
import LoadingSpinner from "../components/LoadingSpinner";


export default function Wishlist() {
    const items = useWishlistStore((state) => state.items);
    const loading = useWishlistStore((state) => state.loading);
    const refreshWishlist = useWishlistStore(
        (state) => state.refreshWishlist
    );

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);


    // ------------------------------------------------------------
    // LOADING
    // ------------------------------------------------------------

    if (loading) {
        return <LoadingSpinner />;
    }


    // ------------------------------------------------------------
    // EMPTY WISHLIST
    // ------------------------------------------------------------

    if (items.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-16">

                <div className="text-center">

                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                        SAVED
                    </p>

                    <h1 className="mt-3 font-serif text-3xl tracking-tight">
                        Your wishlist is empty
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-neutral-500">
                        Save pieces you love and come back to them
                        whenever you're ready.
                    </p>

                    <Link
                        to="/products"
                        className="mt-7 inline-flex border-b border-neutral-900 pb-1 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-900 transition-opacity hover:opacity-60"
                    >
                        Start browsing
                    </Link>

                </div>

            </div>
        );
    }


    // ------------------------------------------------------------
    // PRODUCTS
    // ------------------------------------------------------------

    const products = items
        .map((item) => item.product)
        .filter(Boolean);


    return (
        <div className="mx-auto max-w-6xl px-6 py-12">

            {/* HEADER */}

            <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    SAVED
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">

                    <h1 className="font-serif text-3xl tracking-tight">
                        Your wishlist
                    </h1>

                    <span className="pb-1 text-[11px] text-neutral-400">
                        {products.length}{" "}
                        {products.length === 1
                            ? "item"
                            : "items"}
                    </span>

                </div>
            </div>


            {/* PRODUCTS */}

            <div className="mt-8">
                <ProductGrid products={products} />
            </div>

        </div>
    );
}