import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import * as productService from "../services/productService";
import * as reviewService from "../services/reviewService";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const colorMap = {
    black: "#000000",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#2563eb",
    navy: "#1e3a8a",
    green: "#16a34a",
    yellow: "#facc15",
    orange: "#f97316",
    pink: "#ec4899",
    purple: "#9333ea",
    brown: "#92400e",
    beige: "#d6c3a5",
    cream: "#f5f0e6",
    gray: "#9ca3af",
    grey: "#9ca3af",
};

const getColorValue = (color) => {
    if (!color) return "#e5e5e5";

    return (
        colorMap[color.toLowerCase().trim()] ||
        "#9ca3af"
    );
};

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

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: "",
    });

    const [submittingReview, setSubmittingReview] = useState(false);

    // ------------------------------------------------------------
    // FETCH PRODUCT + REVIEWS
    // ------------------------------------------------------------

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await productService.getProductById(id);

                setProduct(res.data);

                const firstVariant = res.data.variants?.[0];

                if (firstVariant) {
                    setSelectedColor(firstVariant.color || null);
                    setSelectedSize(firstVariant.size || null);
                }
            } catch (err) {
                toast.error(err.message);
            }
        };

        const loadReviews = async () => {
            try {
                const res =
                    await reviewService.getProductReviews(id);

                setReviews(res.data);
            } catch {
                setReviews([]);
            }
        };

        loadProduct();
        loadReviews();
    }, [id]);

    // ------------------------------------------------------------
    // LOADING
    // ------------------------------------------------------------

    if (!product) {
        return <LoadingSpinner />;
    }

    // ------------------------------------------------------------
    // VARIANTS
    // ------------------------------------------------------------

    const variants = product.variants || [];

    const colors = [
        ...new Set(
            variants
                .map((variant) => variant.color)
                .filter(Boolean)
        ),
    ];

    const sizesForColor = variants.filter(
        (variant) => variant.color === selectedColor
    );

    const activeVariant = variants.find(
        (variant) =>
            variant.color === selectedColor &&
            variant.size === selectedSize
    );

    const price =
        activeVariant?.salePrice ??
        activeVariant?.price;

    const onSale =
        activeVariant?.salePrice != null;

    // ------------------------------------------------------------
    // COLOR SELECTION
    // ------------------------------------------------------------

    const handleColorChange = (color) => {
        setSelectedColor(color);

        const firstVariant = variants.find(
            (variant) =>
                variant.color === color &&
                variant.stock > 0
        );

        const fallbackVariant = variants.find(
            (variant) => variant.color === color
        );

        const variant =
            firstVariant || fallbackVariant;

        setSelectedSize(variant?.size || null);
        setQuantity(1);
    };

    // ------------------------------------------------------------
    // ADD TO CART
    // ------------------------------------------------------------

    const handleAddToCart = async () => {
        if (!activeVariant) {
            toast.error("Please select a size");
            return;
        }

        if (activeVariant.stock === 0) {
            toast.error("This item is out of stock");
            return;
        }

        setAdding(true);

        try {
            await addItem(
                product._id,
                activeVariant._id,
                quantity
            );
        } catch {
            // Cart store handles the error toast
        } finally {
            setAdding(false);
        }
    };

    // ------------------------------------------------------------
    // REVIEW
    // ------------------------------------------------------------

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        setSubmittingReview(true);

        try {
            await reviewService.createReview({
                productId: product._id,
                ...reviewForm,
            });

            toast.success("Review submitted");

            setReviewForm({
                rating: 5,
                comment: "",
            });

            const res =
                await reviewService.getProductReviews(id);

            setReviews(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">

            {/* ====================================================
                PRODUCT
            ==================================================== */}

            <div className="grid gap-8 md:grid-cols-2">

                {/* IMAGE */}

                <div className="mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-base-200">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* DETAILS */}

                <div className="md:pt-2">

                    {/* BRAND */}

                    {product.brand?.name && (
                        <p className="text-[10px] tracking-[1.8px] text-neutral-400">
                            {product.brand.name.toUpperCase()}
                        </p>
                    )}

                    {/* TITLE */}

                    <h1 className="mt-1.5 font-serif text-2xl tracking-tight">
                        {product.title}
                    </h1>

                    {/* RATING */}

                    {product.averageReview > 0 && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
                            <Star
                                size={12}
                                strokeWidth={1.5}
                                fill="currentColor"
                            />

                            <span>
                                {Number(
                                    product.averageReview
                                ).toFixed(1)}
                            </span>

                            <span className="text-neutral-300">
                                ·
                            </span>

                            <span>
                                {product.reviewCount}{" "}
                                review
                                {product.reviewCount !== 1 &&
                                    "s"}
                            </span>
                        </div>
                    )}

                    {/* PRICE */}

                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span
                            className={
                                onSale
                                    ? "font-medium text-blue-600"
                                    : "font-medium text-neutral-900"
                            }
                        >
                            KES{" "}
                            {price?.toLocaleString()}
                        </span>

                        {onSale && (
                            <span className="text-neutral-400 line-through">
                                KES{" "}
                                {activeVariant.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-4 max-w-md text-[13px] leading-relaxed text-neutral-600">
                        {product.description}
                    </p>

                    {/* COLOR */}

                    {colors.length > 0 && (
                        <div className="mt-6">

                            <div className="mb-3 flex items-center gap-2">
                                <p className="text-[10px] tracking-[1.5px] text-neutral-400">
                                    COLOR
                                </p>

                                {selectedColor && (
                                    <span className="text-[11px] text-neutral-600">
                                        {selectedColor}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => {
                                    const selected =
                                        selectedColor ===
                                        color;

                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                handleColorChange(
                                                    color
                                                )
                                            }
                                            title={color}
                                            aria-label={`Select ${color}`}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                                                selected
                                                    ? "ring-2 ring-blue-600 ring-offset-2"
                                                    : "ring-1 ring-neutral-300 hover:ring-neutral-700"
                                            }`}
                                        >
                                            <span
                                                className="h-6 w-6 rounded-full border border-black/10"
                                                style={{
                                                    backgroundColor:
                                                        getColorValue(
                                                            color
                                                        ),
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    )}

                    {/* SIZE */}

                    {sizesForColor.length > 0 && (
                        <div className="mt-6">

                            <p className="mb-2 text-[10px] tracking-[1.5px] text-neutral-400">
                                SIZE
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {sizesForColor.map(
                                    (variant) => (
                                        <button
                                            key={variant._id}
                                            type="button"
                                            disabled={
                                                variant.stock ===
                                                0
                                            }
                                            onClick={() => {
                                                setSelectedSize(
                                                    variant.size
                                                );
                                                setQuantity(1);
                                            }}
                                            className={`min-h-8 min-w-9 border px-2 text-[12px] transition ${
                                                selectedSize ===
                                                variant.size
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                                            } disabled:cursor-not-allowed disabled:opacity-25`}
                                        >
                                            {variant.size}
                                        </button>
                                    )
                                )}
                            </div>

                        </div>
                    )}

                    {/* STOCK */}

                    {activeVariant &&
                        activeVariant.stock <= 5 &&
                        activeVariant.stock > 0 && (
                            <p className="mt-3 text-[12px] text-amber-700">
                                Only{" "}
                                {activeVariant.stock} left
                            </p>
                        )}

                    {activeVariant &&
                        activeVariant.stock === 0 && (
                            <p className="mt-3 text-[12px] text-red-700">
                                Out of stock
                            </p>
                        )}

                    {/* CART */}

                    <div className="mt-6 flex gap-2">

                        {/* QUANTITY */}

                        <div className="flex h-10 items-center border border-neutral-300">

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.max(
                                            1,
                                            q - 1
                                        )
                                    )
                                }
                                disabled={quantity <= 1}
                                className="w-8 text-sm hover:bg-base-200 disabled:opacity-30"
                            >
                                −
                            </button>

                            <span className="w-8 text-center text-xs">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.min(
                                            activeVariant?.stock ||
                                                1,
                                            q + 1
                                        )
                                    )
                                }
                                disabled={
                                    !activeVariant ||
                                    quantity >=
                                        activeVariant.stock
                                }
                                className="w-8 text-sm hover:bg-base-200 disabled:opacity-30"
                            >
                                +
                            </button>

                        </div>

                        {/* ADD TO CART */}

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={
                                !activeVariant ||
                                activeVariant.stock ===
                                    0 ||
                                adding
                            }
                            className="h-10 flex-1 bg-blue-600 px-4 text-[11px] tracking-[1px] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {adding
                                ? "ADDING..."
                                : "ADD TO CART"}
                        </button>

                    </div>

                </div>
            </div>

            {/* ====================================================
                REVIEWS
            ==================================================== */}

            <div className="mt-12 border-t border-base-300 pt-8">

                <p className="text-[10px] tracking-[1.8px] text-neutral-400">
                    REVIEWS
                </p>

                {reviews.length === 0 ? (
                    <p className="mt-3 text-[13px] text-neutral-400">
                        No reviews yet.
                    </p>
                ) : (
                    <div className="mt-4 max-w-xl space-y-4">

                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border-b border-base-300 pb-4"
                            >
                                <div className="flex items-center gap-3 text-[12px]">

                                    <span className="font-medium">
                                        {review.user?.fullName}
                                    </span>

                                    <span className="flex items-center gap-1 text-neutral-400">
                                        <Star
                                            size={11}
                                            strokeWidth={1.5}
                                            fill="currentColor"
                                        />

                                        {review.rating}/5
                                    </span>

                                </div>

                                {review.comment && (
                                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}

                    </div>
                )}

                {/* REVIEW FORM */}

                {user && (
                    <form
                        onSubmit={handleSubmitReview}
                        className="mt-6 max-w-sm space-y-2.5"
                    >
                        <p className="text-[12px] font-medium">
                            Leave a review
                        </p>

                        <select
                            value={reviewForm.rating}
                            onChange={(e) =>
                                setReviewForm({
                                    ...reviewForm,
                                    rating: Number(
                                        e.target.value
                                    ),
                                })
                            }
                            className="select select-bordered w-full rounded-none text-xs"
                        >
                            {[5, 4, 3, 2, 1].map(
                                (rating) => (
                                    <option
                                        key={rating}
                                        value={rating}
                                    >
                                        {rating} star
                                        {rating !== 1 &&
                                            "s"}
                                    </option>
                                )
                            )}
                        </select>

                        <textarea
                            value={reviewForm.comment}
                            onChange={(e) =>
                                setReviewForm({
                                    ...reviewForm,
                                    comment: e.target.value,
                                })
                            }
                            placeholder="Share your thoughts (optional)"
                            rows={3}
                            className="textarea textarea-bordered w-full rounded-none text-xs"
                        />

                        <button
                            type="submit"
                            disabled={submittingReview}
                            className="h-9 w-full bg-blue-600 text-[11px] tracking-wide text-white hover:bg-blue-700 disabled:opacity-40"
                        >
                            {submittingReview
                                ? "SUBMITTING..."
                                : "SUBMIT REVIEW"}
                        </button>

                        <p className="text-[10px] leading-relaxed text-neutral-400">
                            Only customers who purchased and paid
                            for this product can review it.
                        </p>
                    </form>
                )}

            </div>
        </div>
    );
}

