import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

export default function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const itemCount = useCartStore((s) => s.itemCount());
    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        navigate(
            search.trim()
                ? `/products?search=${encodeURIComponent(search.trim())}`
                : "/products"
        );

        setShowSearch(false);
    };

    return (
        <header className="border-b border-border bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="group inline-flex flex-col items-center leading-none"
                >
                    <span className="font-serif text-3xl font-semibold tracking-[0.18em] uppercase text-text transition-colors group-hover:text-brand">
                        Liaan
                    </span>

                    <span className="mt-1 text-[10px] font-medium tracking-[0.35em] uppercase text-muted">
                        Collections
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden gap-8 text-[13px] tracking-wide text-muted sm:flex">
                    <Link
                        to="/products?sort=newest"
                        className="transition-colors hover:text-brand"
                    >
                        New
                    </Link>

                    <Link
                        to="/products"
                        className="transition-colors hover:text-brand"
                    >
                        Shop
                    </Link>

                    <Link
                        to="/orders"
                        className="transition-colors hover:text-brand"
                    >
                        Orders
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-5">

                    {/* Search */}
                    <button
                        aria-label="Search"
                        onClick={() => setShowSearch((s) => !s)}
                        className="text-text transition-colors hover:text-brand"
                    >
                        <Search size={17} strokeWidth={1.5} />
                    </button>

                    {/* Account */}
                    {user ? (
                        <button
                            onClick={logout}
                            className="text-[13px] tracking-wide text-muted transition-colors hover:text-brand"
                        >
                            Log out
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            aria-label="Account"
                            className="text-text transition-colors hover:text-brand"
                        >
                            <User size={17} strokeWidth={1.5} />
                        </Link>
                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative text-text transition-colors hover:text-brand"
                        aria-label="Cart"
                    >
                        <ShoppingBag size={17} strokeWidth={1.5} />

                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Search */}
            {showSearch && (
                <form
                    onSubmit={handleSearch}
                    className="border-t border-border px-6 py-3"
                >
                    <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className="input input-ghost w-full max-w-md border-0 border-b border-border px-0 text-sm text-text placeholder:text-muted focus:border-brand focus:outline-none"
                    />
                </form>
            )}
        </header>
    );
}
