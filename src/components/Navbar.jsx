import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Search,
    User,
    Heart,
    ShoppingBag,
    Menu,
    X,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";


export default function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const itemCount = useCartStore(
        (s) => s.itemCount()
    );

    const wishlistCount = useWishlistStore(
        (s) => s.items.length
    );

    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState("");


    // ------------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------------

    const handleSearch = (e) => {
        e.preventDefault();

        navigate(
            search.trim()
                ? `/products?search=${encodeURIComponent(
                      search.trim()
                  )}`
                : "/products"
        );

        setSearch("");
        setShowSearch(false);
    };


    // ------------------------------------------------------------
    // MOBILE MENU
    // ------------------------------------------------------------

    const closeMenu = () => {
        setShowMenu(false);
    };


    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">

            {/* ====================================================
                MAIN NAVBAR
            ==================================================== */}

            <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">

                {/* MOBILE MENU BUTTON */}

                <button
                    type="button"
                    onClick={() =>
                        setShowMenu((state) => !state)
                    }
                    aria-label={
                        showMenu
                            ? "Close menu"
                            : "Open menu"
                    }
                    className="flex text-neutral-900 transition-colors hover:text-neutral-500 sm:hidden"
                >
                    {showMenu ? (
                        <X
                            size={21}
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Menu
                            size={21}
                            strokeWidth={1.5}
                        />
                    )}
                </button>


                {/* LOGO */}

                <Link
                    to="/"
                    onClick={closeMenu}
                    className="group absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0"
                >
                    <div className="text-center leading-none">

                        <span className="block font-serif text-[22px] font-semibold uppercase tracking-[0.18em] text-neutral-900 transition-colors group-hover:text-neutral-600 sm:text-2xl">
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

                    <Link
                        to="/products?sort=newest"
                        className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 transition-colors hover:text-neutral-500"
                    >
                        New
                    </Link>

                    <Link
                        to="/products"
                        className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 transition-colors hover:text-neutral-500"
                    >
                        Shop
                    </Link>

                    <Link
                        to="/collections"
                        className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 transition-colors hover:text-neutral-500"
                    >
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
                        onClick={() =>
                            setShowSearch((state) => !state)
                        }
                        className="text-neutral-900 transition-colors hover:text-neutral-500"
                    >
                        <Search
                            size={18}
                            strokeWidth={1.5}
                        />
                    </button>


                    {/* ACCOUNT */}

                    <Link
                        to={
                            user
                                ? "/signup"
                                : "/login"
                        }
                        aria-label="Account"
                        className="hidden text-neutral-900 transition-colors hover:text-neutral-500 sm:block"
                    >
                        <User
                            size={18}
                            strokeWidth={1.5}
                        />
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
                        className="relative text-neutral-900 transition-colors hover:text-neutral-500"
                    >
                        <Heart
                            size={18}
                            strokeWidth={1.5}
                        />

                        {wishlistCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex min-h-[15px] min-w-[15px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[8px] font-medium leading-none text-white">
                                {wishlistCount > 99
                                    ? "99+"
                                    : wishlistCount}
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
                        className="relative text-neutral-900 transition-colors hover:text-neutral-500"
                    >
                        <ShoppingBag
                            size={18}
                            strokeWidth={1.5}
                        />

                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex min-h-[15px] min-w-[15px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[8px] font-medium leading-none text-white">
                                {itemCount > 99
                                    ? "99+"
                                    : itemCount}
                            </span>
                        )}
                    </Link>

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
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
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
                            className="border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900"
                        >
                            New Arrivals
                        </Link>

                        <Link
                            to="/products"
                            onClick={closeMenu}
                            className="border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900"
                        >
                            Shop All
                        </Link>

                        <Link
                            to="/collections"
                            onClick={closeMenu}
                            className="border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900"
                        >
                            Collections
                        </Link>

                        {/* MOBILE WISHLIST */}

                        <Link
                            to="/wishlist"
                            onClick={closeMenu}
                            className="flex items-center justify-between border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900"
                        >
                            <span>Wishlist</span>

                            {wishlistCount > 0 && (
                                <span className="text-[10px] text-neutral-400">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            to={
                                user
                                    ? "/signup"
                                    : "/login"
                            }
                            onClick={closeMenu}
                            className="border-b border-neutral-100 py-4 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900"
                        >
                            {user
                                ? "My Account"
                                : "Sign In"}
                        </Link>

                        {user && (
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-neutral-500"
                            >
                                Log Out
                            </button>
                        )}

                    </nav>

                </div>
            )}

        </header>
    );
}