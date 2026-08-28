import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import * as productService from "../services/productService";
import * as reviewService from "../services/reviewService";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function ProductDetails() {
    const { id } = useParams();
    const addItem = useCartStore((s) => s.addItem);
    const user = useAuthStore((s) => s.user);

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        productService.getProductById(id).then((res) => {
            setProduct(res.data);
            const first = res.data.variants?.[0];
            if (first) {
                setSelectedColor(first.color);
                setSelectedSize(first.size);
            }
        }).catch((err) => toast.error(err.message));

        reviewService.getProductReviews(id).then((res) => setReviews(res.data)).catch(() => {});
    }, [id]);

    if (!product) {
        return <LoadingSpinner />;
    }

    const colors = [...new Set(product.variants.map((v) => v.color))];
    const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
    const activeVariant = product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
    );

    const price = activeVariant?.salePrice ?? activeVariant?.price;
    const onSale = activeVariant?.salePrice != null;

    const handleAddToCart = async () => {
        if (!activeVariant) return;
        setAdding(true);
        try {
            await addItem(product._id, activeVariant._id, quantity);
        } catch {
        } finally {
            setAdding(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await reviewService.createReview({ productId: product._id, ...reviewForm });
            toast.success("Review submitted");
            setReviewForm({ rating: 5, comment: "" });
            const res = await reviewService.getProductReviews(id);
            setReviews(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid gap-12 sm:grid-cols-2">
                <div className="aspect-[3/4] overflow-hidden bg-base-200">
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                </div>

                <div className="sm:pt-2">
                    <p className="text-[11px] tracking-[1.5px] text-neutral-400">
                        {product.brand?.name?.toUpperCase()}
                    </p>
                    <h1 className="mt-2 font-serif text-2xl">{product.title}</h1>

                    {product.averageReview > 0 && (
                        <p className="mt-2 flex items-center gap-1 text-[13px] text-neutral-500">
                            <Star size={13} strokeWidth={1.5} fill="currentColor" />
                            {product.averageReview} · {product.reviewCount} review
                            {product.reviewCount !== 1 && "s"}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span>KES {price?.toLocaleString()}</span>
                        {onSale && (
                            <span className="text-neutral-400 line-through">
                                KES {activeVariant.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <p className="mt-6 text-sm leading-relaxed text-neutral-600">{product.description}</p>

                    <div className="mt-8">
                        <p className="mb-3 text-[11px] tracking-[1.5px] text-neutral-400">COLOR</p>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        const firstSize = product.variants.find((v) => v.color === color);
                                        setSelectedSize(firstSize?.size);
                                    }}
                                    className={`border-b pb-0.5 text-[13px] ${
                                        selectedColor === color
                                            ? "border-neutral-900 text-neutral-900"
                                            : "border-transparent text-neutral-400"
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-3 text-[11px] tracking-[1.5px] text-neutral-400">SIZE</p>
                        <div className="flex flex-wrap gap-2">
                            {sizesForColor.map((v) => (
                                <button
                                    key={v._id}
                                    disabled={v.stock === 0}
                                    onClick={() => setSelectedSize(v.size)}
                                    className={`h-9 min-w-9 border px-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-25 ${
                                        selectedSize === v.size
                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                            : "border-neutral-300 text-neutral-700"
                                    }`}
                                >
                                    {v.size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeVariant && activeVariant.stock <= 5 && activeVariant.stock > 0 && (
                        <p className="mt-4 text-[13px] text-amber-700">Only {activeVariant.stock} left</p>
                    )}
                    {activeVariant && activeVariant.stock === 0 && (
                        <p className="mt-4 text-[13px] text-red-700">Out of stock</p>
                    )}

                    <div className="mt-8 flex items-center gap-3">
                        <div className="flex h-11 items-center border border-neutral-300">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 text-sm">−</button>
                            <span className="w-8 text-center text-sm">{quantity}</span>
                            <button onClick={() => setQuantity((q) => q + 1)} className="w-9 text-sm">+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!activeVariant || activeVariant.stock === 0 || adding}
                            className="h-11 flex-1 bg-neutral-900 text-[13px] tracking-wide text-white disabled:opacity-30"
                        >
                            {adding ? "ADDING..." : "ADD TO CART"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16 border-t border-base-300 pt-10">
                <p className="text-[11px] tracking-[1.5px] text-neutral-400">REVIEWS</p>

                {reviews.length === 0 ? (
                    <p className="mt-3 text-sm text-neutral-400">No reviews yet.</p>
                ) : (
                    <div className="mt-4 max-w-lg space-y-5">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b border-base-300 pb-5">
                                <div className="flex items-center gap-3 text-[13px]">
                                    <span>{review.user?.fullName}</span>
                                    <span className="text-neutral-400">{review.rating}/5</span>
                                </div>
                                {review.comment && (
                                    <p className="mt-1 text-sm text-neutral-600">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {user && (
                    <form onSubmit={handleSubmitReview} className="mt-8 max-w-sm space-y-3">
                        <p className="text-[13px]">Leave a review</p>
                        <select
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                            className="select select-bordered w-full rounded-none text-sm"
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{n} star{n !== 1 && "s"}</option>
                            ))}
                        </select>
                        <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Share your thoughts (optional)"
                            rows={3}
                            className="textarea textarea-bordered w-full rounded-none text-sm"
                        />
                        <button
                            type="submit"
                            disabled={submittingReview}
                            className="h-10 w-full bg-neutral-900 text-[13px] tracking-wide text-white disabled:opacity-40"
                        >
                            {submittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                        </button>
                        <p className="text-[11px] text-neutral-400">
                            Only customers who purchased and paid for this product can review it.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
