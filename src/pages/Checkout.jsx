import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import * as orderService from "../services/orderService";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000;

export default function Checkout() {
    const items = useCartStore((s) => s.items);
    const total = useCartStore((s) => s.total);
    const refreshCart = useCartStore((s) => s.refreshCart);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        country: "Kenya"
    });
    const [step, setStep] = useState("form");
    const [order, setOrder] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setStep("placing");

        try {
            const orderRes = await orderService.placeOrder({ shippingAddress: address });
            const createdOrder = orderRes.data;
            setOrder(createdOrder);
            await refreshCart();

            setStep("awaiting_payment");
            const payRes = await orderService.payForOrder({
                orderId: createdOrder._id,
                phone: address.phone
            });

            setStatusMessage(payRes.data.message);
            pollPaymentStatus(payRes.data.checkoutRequestId, createdOrder._id);
        } catch (err) {
            toast.error(err.message);
            setStep("form");
        }
    };

    const pollPaymentStatus = (checkoutRequestId, orderId) => {
        setStep("polling");
        const startedAt = Date.now();

        const interval = setInterval(async () => {
            if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
                clearInterval(interval);
                setStatusMessage("Still waiting on confirmation — check your Orders page shortly.");
                return;
            }

            try {
                const res = await orderService.getPaymentStatus(checkoutRequestId);

                if (res.data.status === "success") {
                    clearInterval(interval);
                    toast.success("Payment successful");
                    navigate(`/orders/${orderId}`, { replace: true });
                } else if (res.data.status === "failed") {
                    clearInterval(interval);
                    setStatusMessage(res.data.resultDescription || "Payment failed. You can retry below.");
                    setStep("failed");
                }
            } catch {
            }
        }, POLL_INTERVAL_MS);
    };

    const handleRetryPayment = async () => {
        setStep("awaiting_payment");
        try {
            const payRes = await orderService.payForOrder({ orderId: order._id, phone: address.phone });
            setStatusMessage(payRes.data.message);
            pollPaymentStatus(payRes.data.checkoutRequestId, order._id);
        } catch (err) {
            toast.error(err.message);
            setStep("failed");
        }
    };

    if (!items.length && step === "form") {
        return <p className="py-24 text-center text-neutral-400">Your cart is empty.</p>;
    }

    if (step !== "form") {
        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">
                <p className="text-[13px] tracking-wide text-neutral-700">
                    {step === "placing" && "PLACING YOUR ORDER..."}
                    {step === "awaiting_payment" && "SENDING PAYMENT PROMPT..."}
                    {step === "polling" && "CHECK YOUR PHONE"}
                    {step === "failed" && "PAYMENT DIDN'T GO THROUGH"}
                </p>

                {statusMessage && <p className="mt-3 text-sm text-neutral-500">{statusMessage}</p>}

                {step === "failed" && (
                    <button
                        onClick={handleRetryPayment}
                        className="mt-8 h-11 border border-neutral-900 px-6 text-[13px] tracking-wide"
                    >
                        RETRY PAYMENT
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md px-6 py-12">
            <h1 className="font-serif text-2xl">Checkout</h1>

            <form onSubmit={handlePlaceOrder} className="mt-8 space-y-5">
                <input
                    required
                    placeholder="Full name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
                <input
                    required
                    placeholder="M-Pesa phone number (e.g. 0712345678)"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
                <input
                    required
                    placeholder="Delivery address"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
                <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
                <input
                    required
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <div className="flex items-center justify-between border-t border-base-300 pt-5 text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span>KES {total.toLocaleString()}</span>
                </div>
                <p className="text-[12px] text-neutral-400">
                    Final total (incl. shipping) is confirmed after placing your order.
                </p>

                <button
                    type="submit"
                    className="h-12 w-full bg-neutral-900 text-[13px] tracking-wide text-white"
                >
                    PLACE ORDER AND PAY WITH M-PESA
                </button>
            </form>
        </div>
    );
}
