import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-base-300">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    <div>
                        <p className="font-serif text-lg lowercase">liaan</p>
                        <p className="mt-2 text-[12px] text-neutral-500">
                            Considered essentials, made to last.
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] tracking-[1.5px] text-neutral-400">SHOP</p>
                        <div className="mt-3 flex flex-col gap-2 text-[13px] text-neutral-600">
                            <Link to="/products">All products</Link>
                            <Link to="/products?sort=newest">New arrivals</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] tracking-[1.5px] text-neutral-400">ACCOUNT</p>
                        <div className="mt-3 flex flex-col gap-2 text-[13px] text-neutral-600">
                            <Link to="/orders">Orders</Link>
                            <Link to="/login">Log in</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] tracking-[1.5px] text-neutral-400">ABOUT</p>
                        <p className="mt-3 text-[13px] text-neutral-600">Nairobi, Kenya</p>
                    </div>
                </div>
                <p className="mt-10 text-[11px] text-neutral-400">
                    © {new Date().getFullYear()} liaan. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
