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
        navigate(search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : "/products");
        setShowSearch(false);
    };

    return (
        <header className="border-b border-base-300">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link to="/" className="font-serif text-2xl tracking-tight lowercase">
                    liaan
                </Link>

                <nav className="hidden gap-8 text-[13px] tracking-wide text-neutral-600 sm:flex">
                    <Link to="/products?sort=newest" className="hover:text-neutral-900">New</Link>
                    <Link to="/products" className="hover:text-neutral-900">Shop</Link>
                    <Link to="/orders" className="hover:text-neutral-900">Orders</Link>
                </nav>

                <div className="flex items-center gap-5">
                    <button aria-label="Search" onClick={() => setShowSearch((s) => !s)}>
                        <Search size={17} strokeWidth={1.5} />
                    </button>

                    {user ? (
                        <button onClick={logout} className="text-[13px] tracking-wide text-neutral-600 hover:text-neutral-900">
                            Log out
                        </button>
                    ) : (
                        <Link to="/login" aria-label="Account">
                            <User size={17} strokeWidth={1.5} />
                        </Link>
                    )}

                    <Link to="/cart" className="relative" aria-label="Cart">
                        <ShoppingBag size={17} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {showSearch && (
                <form onSubmit={handleSearch} className="border-t border-base-300 px-6 py-3">
                    <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className="input input-ghost w-full max-w-md border-0 border-b border-neutral-300 px-0 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                </form>
            )}
        </header>
    );
}
