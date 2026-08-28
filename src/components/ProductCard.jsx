import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
    const variant = product.variants?.[0];
    const price = variant?.salePrice ?? variant?.price;
    const onSale = variant?.salePrice != null;

    return (
        <Link to={`/products/${product._id}`} className="group block">
            <div className="aspect-[3/4] w-full overflow-hidden bg-base-200">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
            </div>
            <div className="pt-3">
                <p className="text-[13px] text-neutral-900">{product.title}</p>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-neutral-500">
                    <span>KES {price?.toLocaleString()}</span>
                    {onSale && (
                        <span className="text-neutral-400 line-through">
                            KES {variant.price.toLocaleString()}
                        </span>
                    )}
                </div>
                {product.averageReview > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                        <Star size={11} strokeWidth={1.5} fill="currentColor" />
                        {product.averageReview} · {product.reviewCount} reviews
                    </p>
                )}
            </div>
        </Link>
    );
}
