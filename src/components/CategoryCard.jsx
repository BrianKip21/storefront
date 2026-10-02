import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
    return (
        <Link
            to={`/products?category=${category._id}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-neutral-100"
        >
            {/* CATEGORY IMAGE */}
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
            ) : (
                <div className="absolute inset-0 bg-neutral-100" />
            )}

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/65" />

            {/* CONTENT */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                    {category.name}
                </p>

                <span className="mt-2 block translate-y-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Shop now →
                </span>
            </div>
        </Link>
    );
}