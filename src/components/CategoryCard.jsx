import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
    return (
        <Link
            to={`/products?category=${category._id}`}
            className="group relative flex min-h-36 items-center justify-center overflow-hidden border border-neutral-200 bg-base-100 px-6 py-10 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900"
        >
            <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-900 transition-colors duration-300 group-hover:text-white">
                    {category.name}
                </p>

                <span className="mt-3 block text-[11px] uppercase tracking-[0.18em] text-neutral-500 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-neutral-300 group-hover:opacity-100">
                    Shop now →
                </span>
            </div>
        </Link>
    );
}