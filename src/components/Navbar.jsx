import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Search,
    User,
    Heart,
    ShoppingBag,
    Menu,
    X,
    LogOut,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";

const desktopLinkClass =
    "text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-900 transition-colors hover:text-neutral-500";

const mobileLinkClass =
    "border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900";

const iconClass = "text-neutral-900 transition-colors hover:text-neutral-500";

const badgeClass =
    "absolute -right-2 -top-2 flex min-h-[15px] min-w-[15px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[8px] font-medium leading-none text-white";

export default function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const itemCount = useCartStore((s) => s.itemCount());
    const wishlistCount = useWishlistStore((s) => s.items.length);

    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState("");

    // ------------------------------------------------------------
    // CLOSE PANELS WITH ESCAPE
    // ------------------------------------------------------------

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowSearch(false);
                setShowMenu(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // ------------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------------

    const handleSearch = (e) => {
        e.preventDefault();

        navigate(
            search.trim()
                ? `/products?search=${encodeURIComponent(search.trim())}`
                : "/products"
        );

        setSearch("");
        setShowSearch(false);
    };

    // ------------------------------------------------------------
    // MENU + LOGOUT
    // ------------------------------------------------------------

    const closeMenu = () => {
        setShowMenu(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            closeMenu();
            setShowSearch(false);
            navigate("/");
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
            {/* ====================================================
                MAIN NAVBAR
            ==================================================== */}

            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                {/* MOBILE MENU TOGGLE */}

                <button
                    type="button"
                    onClick={() => setShowMenu((state) => !state)}
                    aria-label={showMenu ? "Close menu" : "Open menu"}
                    aria-expanded={showMenu}
                    className={`flex sm:hidden ${iconClass}`}
                >
                    {showMenu ? (
                        <X size={21} strokeWidth={1.5} />
                    ) : (
                        <Menu size={21} strokeWidth={1.5} />
                    )}
                </button>

                {/* LOGO */}

                <Link
                    to="/"
                    onClick={closeMenu}
                    className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0"
                >
                    <div className="text-center leading-none">
                        <span className="block font-serif text-[22px] font-semibold uppercase tracking-[0.18em] text-neutral-900 sm:text-2xl">
                            Liaan
                        </span>

                        <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.32em] text-neutral-500">
                            Collections
                        </span>
                    </div>
                </Link>

                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

                <nav className="ml-12 hidden items-center gap-8 sm:flex">
                    <Link to="/products?sort=newest" className={desktopLinkClass}>
                        New
                    </Link>

                    <Link to="/products" className={desktopLinkClass}>
                        Shop
                    </Link>

                    <Link to="/collections" className={desktopLinkClass}>
                        Collections
                    </Link>
                </nav>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex items-center gap-4 sm:gap-5">
                    {/* SEARCH */}

                    <button
                        type="button"
                        aria-label="Search"
                        aria-expanded={showSearch}
                        onClick={() => setShowSearch((state) => !state)}
                        className={iconClass}
                    >
                        <Search size={18} strokeWidth={1.5} />
                    </button>

                    {/* ACCOUNT */}

                    <Link
                        to={user ? "/account" : "/login"}
                        aria-label={user ? "Account" : "Sign in"}
                        title={user ? "Account" : "Sign in"}
                        className={`hidden sm:block ${iconClass}`}
                    >
                        <User size={18} strokeWidth={1.5} />
                    </Link>

                    {/* WISHLIST */}

                    <Link
                        to="/wishlist"
                        aria-label={
                            wishlistCount > 0
                                ? `Wishlist, ${wishlistCount} items`
                                : "Wishlist"
                        }
                        title="Wishlist"
                        className={`relative ${iconClass}`}
                    >
                        <Heart size={18} strokeWidth={1.5} />

                        {wishlistCount > 0 && (
                            <span className={badgeClass}>
                                {wishlistCount > 99 ? "99+" : wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* CART */}

                    <Link
                        to="/cart"
                        aria-label={
                            itemCount > 0
                                ? `Shopping bag, ${itemCount} items`
                                : "Shopping bag"
                        }
                        title="Shopping bag"
                        className={`relative ${iconClass}`}
                    >
                        <ShoppingBag size={18} strokeWidth={1.5} />

                        {itemCount > 0 && (
                            <span className={badgeClass}>
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </Link>

                    {/* LOGOUT (desktop, signed-in users only) */}

                    {user && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label="Log out"
                            title="Log out"
                            className={`hidden sm:block ${iconClass}`}
                        >
                            <LogOut size={18} strokeWidth={1.5} />
                        </button>
                    )}
                </div>
            </div>

            {/* ====================================================
                SEARCH BAR
            ==================================================== */}

            {showSearch && (
                <form
                    onSubmit={handleSearch}
                    className="border-t border-neutral-200 bg-white px-5 py-4 sm:px-8"
                >
                    <div className="mx-auto flex max-w-7xl items-center">
                        <Search
                            size={16}
                            strokeWidth={1.5}
                            className="mr-3 shrink-0 text-neutral-400"
                        />

                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full border-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                        />
                    </div>
                </form>
            )}

            {/* ====================================================
                MOBILE MENU
            ==================================================== */}

            {showMenu && (
                <div className="border-t border-neutral-200 bg-white sm:hidden">
                    <nav className="flex flex-col px-5 py-5">
                        <Link
                            to="/products?sort=newest"
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            New Arrivals
                        </Link>

                        <Link
                            to="/products"
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            Shop All
                        </Link>

                        <Link
                            to="/collections"
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            Collections
                        </Link>

                        <Link
                            to="/wishlist"
                            onClick={closeMenu}
                            className={`flex items-center justify-between ${mobileLinkClass}`}
                        >
                            <span>Wishlist</span>

                            {wishlistCount > 0 && (
                                <span className="text-[10px] text-neutral-400">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            to={user ? "/account" : "/login"}
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            {user ? "My Account" : "Sign In"}
                        </Link>

                        {user && (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-900"
                            >
                                <LogOut size={14} strokeWidth={1.5} />
                                Log Out
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}