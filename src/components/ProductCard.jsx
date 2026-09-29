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
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />

                {/* SALE */}
                {onSale && !isOutOfStock && (
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-neutral-900">
                        Sale
                    </span>
                )}

                {/* SOLD OUT */}
                {isOutOfStock && (
                    <span className="absolute left-3 top-3 bg-neutral-900 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-white">
                        Sold out
                    </span>
                )}

                {/* DESKTOP HOVER ACTION */}
                <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 bg-white/95 px-4 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-900 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                    View product
                </div>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="pt-4">
                {/* BRAND */}
                {product.brand?.name && (
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                        {product.brand.name}
                    </p>
                )}

                {/* TITLE */}
                <p className="mt-1.5 line-clamp-1 text-[13px] leading-snug text-neutral-900 transition-colors group-hover:text-neutral-600">
                    {product.title}
                </p>

                {/* PRICE */}
                <div className="mt-2 flex items-center gap-2">
                    <span
                        className={`text-[13px] font-medium ${
                            onSale
                                ? "text-neutral-900"
                                : "text-neutral-800"
                        }`}
                    >
                        KES {price?.toLocaleString()}
                    </span>

                    {onSale && (
                        <span className="text-[12px] text-neutral-400 line-through">
                            KES {originalPrice?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* REVIEWS */}
                {product.averageReview > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <Star
                            size={11}
                            strokeWidth={1.5}
                            fill="currentColor"
                        />

                        <span>
                            {Number(product.averageReview).toFixed(1)}
                        </span>

                        <span className="text-neutral-300">·</span>

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
