import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
    const variant = product.variants?.[0];

    const price = variant?.salePrice ?? variant?.price;
    const originalPrice = variant?.price;

    const onSale =
        variant?.salePrice !== null &&
        variant?.salePrice !== undefined;

    const isOutOfStock =
        product.variants?.length > 0 &&
        product.variants.every((v) => v.stock === 0);

    return (
        <Link
            to={`/products/${product._id}`}
            className="group block"
        >
            {/* IMAGE */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-page">

                <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* SALE BADGE */}
                {onSale && !isOutOfStock && (
                    <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 text-[9px] font-medium uppercase tracking-[1.2px] text-white">
                        Sale
                    </span>
                )}

                {/* SOLD OUT */}
                {isOutOfStock && (
                    <span className="absolute left-3 top-3 bg-[#0F172A] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[1.2px] text-white">
                        Sold out
                    </span>
                )}

                {/* VIEW PRODUCT */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white/95 px-4 py-3 text-center text-[10px] uppercase tracking-[1.5px] text-[#1E3A8A] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View product
                </div>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="pt-4">

                {/* BRAND */}
                {product.brand?.name && (
                    <p className="text-[9px] uppercase tracking-[1.6px] text-muted">
                        {product.brand.name}
                    </p>
                )}

                {/* TITLE */}
                <p className="mt-1 text-[13px] leading-snug text-[#1E3A8A] transition-colors group-hover:text-brand">
                    {product.title}
                </p>

                {/* PRICE */}
                <div className="mt-2 flex items-center gap-2">
                    <span
                        className={`text-[13px] font-medium ${
                            onSale
                                ? "text-text"
                                : "text-[#1E3A8A]"
                        }`}
                    >
                        KES {price?.toLocaleString()}
                    </span>

                    {onSale && (
                        <span className="text-[12px] text-muted line-through">
                            KES {originalPrice?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* REVIEWS */}
                {product.averageReview > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                        <Star
                            size={11}
                            strokeWidth={1.5}
                            fill="currentColor"
                        />

                        <span>
                            {Number(product.averageReview).toFixed(1)}
                        </span>

                        <span>·</span>

                        <span>
                            {product.reviewCount}{" "}
                            {product.reviewCount === 1
                                ? "review"
                                : "reviews"}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
