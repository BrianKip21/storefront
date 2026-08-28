import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Cart() {
    const items = useCartStore((s) => s.items);
    const total = useCartStore((s) => s.total);
    const loading = useCartStore((s) => s.loading);
    const updateItem = useCartStore((s) => s.updateItem);
    const removeItem = useCartStore((s) => s.removeItem);

    if (loading) return <LoadingSpinner />;

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <p className="text-neutral-400">Your cart is empty.</p>
                <Link to="/products" className="mt-4 inline-block border-b border-neutral-900 text-[13px]">
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="font-serif text-2xl">Your cart</h1>

            <div className="mt-8 divide-y divide-base-300">
                {items.map((item) => (
                    <div key={item._id} className="flex gap-5 py-6">
                        <div className="h-28 w-24 shrink-0 overflow-hidden bg-base-200">
                            {item.product?.image && (
                                <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                            )}
                        </div>

                        <div className="flex-1">
                            <p className="text-[13px]">{item.product?.title}</p>
                            {item.variant && (
                                <p className="mt-1 text-[12px] text-neutral-400">
                                    {item.variant.color} / {item.variant.size}
                                </p>
                            )}

                            {!item.available && (
                                <p className="mt-1 text-[12px] text-red-700">
                                    Not enough stock — please adjust quantity
                                </p>
                            )}

                            <div className="mt-3 flex items-center gap-4">
                                <div className="flex h-9 items-center border border-neutral-300">
                                    <button
                                        onClick={() => updateItem(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="w-8 text-sm disabled:opacity-30"
                                    >
                                        −
                                    </button>
                                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                                    <button onClick={() => updateItem(item._id, item.quantity + 1)} className="w-8 text-sm">
                                        +
                                    </button>
                                </div>

                                <button onClick={() => removeItem(item._id)} className="text-[12px] text-neutral-400 underline">
                                    Remove
                                </button>
                            </div>
                        </div>

                        <p className="text-[13px]">KES {item.lineTotal.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-5 text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>KES {total.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-[12px] text-neutral-400">Shipping calculated at checkout</p>

            <Link
                to="/checkout"
                className="mt-8 block h-12 bg-neutral-900 text-center text-[13px] leading-[48px] tracking-wide text-white"
            >
                PROCEED TO CHECKOUT
            </Link>
        </div>
    );
}
