import { Link } from "react-router-dom";
import {
    FaInstagram,
    FaWhatsapp,
    FaTiktok,
    FaFacebookF,
} from "react-icons/fa";
import { MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto max-w-7xl px-6 py-14">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link
                            to="/"
                            className="inline-flex flex-col leading-none"
                        >
                            <span className="font-serif text-3xl font-semibold tracking-[0.15em] uppercase">
                                Liaan
                            </span>

                            <span className="mt-1 text-[10px] font-medium tracking-[0.35em] uppercase text-neutral-500">
                                Collections
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
                            Curated fashion pieces chosen for style, quality,
                            and individuality. Discover unique thrift finds
                            and timeless essentials at Liaan Collections.
                        </p>

                        {/* Location */}
                        <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
                            <MapPin size={16} strokeWidth={1.5} />
                            <span>Nairobi, Kenya</span>
                        </div>

                        {/* Social Media */}
                        <div className="mt-6 flex items-center gap-3">

                            <a
                                href="https://instagram.com/_k.brian_"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="https://wa.me/254785871134"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp size={17} />
                            </a>

                            <a
                                href="https://www.tiktok.com/@liaan_collections"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-base-300 transition-all hover:bg-black hover:text-white"
                            >
                                <FaTiktok size={16} />
                            </a>

                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <p className="text-xs font-medium tracking-widest text-neutral-400">
                            SHOP
                        </p>

                        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-600">
                            <Link
                                to="/products"
                                className="transition-colors hover:text-black"
                            >
                                All products
                            </Link>

                            <Link
                                to="/products?sort=newest"
                                className="transition-colors hover:text-black"
                            >
                                New arrivals
                            </Link>
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <p className="text-xs font-medium tracking-widest text-neutral-400">
                            CUSTOMER CARE
                        </p>

                        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-600">
                            <Link
                                to="/orders"
                                className="transition-colors hover:text-black"
                            >
                                Track my order
                            </Link>

                            <Link
                                to="/shipping"
                                className="transition-colors hover:text-black"
                            >
                                Delivery information
                            </Link>

                            <Link
                                to="/returns"
                                className="transition-colors hover:text-black"
                            >
                                Returns & exchanges
                            </Link>

                            <Link
                                to="/faq"
                                className="transition-colors hover:text-black"
                            >
                                FAQs
                            </Link>

                            <Link
                                to="/contact"
                                className="transition-colors hover:text-black"
                            >
                                Contact us
                            </Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="text-xs font-medium tracking-widest text-neutral-400">
                            COMPANY
                        </p>

                        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-600">
                            <Link
                                to="/about"
                                className="transition-colors hover:text-black"
                            >
                                About us
                            </Link>

                            <Link
                                to="/contact"
                                className="transition-colors hover:text-black"
                            >
                                Get in touch
                            </Link>

                            <Link
                                to="/privacy"
                                className="transition-colors hover:text-black"
                            >
                                Privacy policy
                            </Link>

                            <Link
                                to="/terms"
                                className="transition-colors hover:text-black"
                            >
                                Terms & conditions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contact Strip */}
                <div className="mt-12 flex flex-col gap-4 border-y border-base-300 py-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-sm font-medium">
                            Need help with your order?
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                            Reach us directly on WhatsApp and we'll be happy
                            to assist.
                        </p>
                    </div>

                    <a
                        href="https://wa.me/254785871134"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp size={17} />
                    </a>

                </div>

                {/* Bottom */}
                <div className="mt-8 flex flex-col gap-3 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">

                    <p>
                        © {new Date().getFullYear()} Liaan Collections.
                        All rights reserved.
                    </p>

                    <p>
                        Made in Nairobi, Kenya
                    </p>

                </div>

            </div>
        </footer>
    );
}