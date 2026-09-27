import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Loader2, CheckCircle2, Clock3 } from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "../stores/cartStore";
import * as orderService from "../services/orderService";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const MAX_PAYMENT_ATTEMPTS = 3;

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

    const [paymentAttempts, setPaymentAttempts] = useState(0);
    const [paymentLockedUntil, setPaymentLockedUntil] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);

    const pollingIntervalRef = useRef(null);

    // ============================================
    // CLEAN UP PAYMENT POLLING
    // ============================================

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // ============================================
    // HANDLE INPUT
    // ============================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ============================================
    // FORMAT LOCK TIME
    // ============================================

    const getLockMessage = () => {
        if (!paymentLockedUntil) {
            return "Please try again later.";
        }

        const lockedUntil = new Date(paymentLockedUntil);
        const now = new Date();

        const remainingMs =
            lockedUntil.getTime() - now.getTime();

        if (remainingMs <= 0) {
            return "You can try the payment again now.";
        }

        const remainingMinutes = Math.ceil(
            remainingMs / 60000
        );

        if (remainingMinutes === 1) {
            return "Please try again in about 1 minute.";
        }

        return `Please try again in about ${remainingMinutes} minutes.`;
    };

    // ============================================
    // PLACE ORDER
    // ============================================

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        setStep("placing");
        setStatusMessage("");

        try {
            const orderRes =
                await orderService.placeOrder({
                    shippingAddress: address
                });

            const createdOrder = orderRes.data;

            setOrder(createdOrder);

            await refreshCart();

            // Start payment
            await initiatePayment(
                createdOrder._id,
                address.phone
            );

        } catch (error) {
            console.error(
                "Checkout error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Unable to place order"
            );

            setStep("form");
        }
    };

    // ============================================
    // INITIATE PAYMENT
    // ============================================

    const initiatePayment = async (
        orderId,
        phone
    ) => {
        setStep("awaiting_payment");
        setStatusMessage(
            "Sending payment prompt to your phone..."
        );

        try {
            const payRes =
                await orderService.payForOrder({
                    orderId,
                    phone
                });

            const paymentData = payRes.data;

            if (paymentData?.paymentAttempts != null) {
                setPaymentAttempts(
                    paymentData.paymentAttempts
                );
            }

            if (paymentData?.paymentLockedUntil) {
                setPaymentLockedUntil(
                    paymentData.paymentLockedUntil
                );
            }

            setStatusMessage(
                paymentData?.message ||
                "Payment prompt sent. Check your phone."
            );

            pollPaymentStatus(
                paymentData.checkoutRequestId,
                orderId
            );

        } catch (error) {
            console.error(
                "Payment initiation error:",
                error
            );

            handlePaymentError(error);
        }
    };

    // ============================================
    // HANDLE PAYMENT ERROR
    // ============================================

    const handlePaymentError = (error) => {
        const response =
            error?.response?.data;

        const message =
            response?.message ||
            error.message ||
            "Payment could not be initiated.";

        if (response?.paymentAttempts != null) {
            setPaymentAttempts(
                response.paymentAttempts
            );
        }

        if (response?.paymentLockedUntil) {
            setPaymentLockedUntil(
                response.paymentLockedUntil
            );
        }

        if (response?.locked) {
            setStatusMessage(
                `${message} ${getLockMessage()}`
            );

            setStep("locked");
            return;
        }

        setStatusMessage(message);
        setStep("failed");
    };

    // ============================================
    // POLL PAYMENT STATUS
    // ============================================

    const pollPaymentStatus = (
        checkoutRequestId,
        orderId
    ) => {
        if (!checkoutRequestId) {
            setStatusMessage(
                "Payment request could not be tracked."
            );

            setStep("failed");
            return;
        }

        setStep("polling");

        const startedAt = Date.now();

        if (pollingIntervalRef.current) {
            clearInterval(
                pollingIntervalRef.current
            );
        }

        pollingIntervalRef.current =
            setInterval(async () => {
                // ----------------------------------------
                // 5-MINUTE PAYMENT WINDOW
                // ----------------------------------------

                if (
                    Date.now() - startedAt >
                    POLL_TIMEOUT_MS
                ) {
                    clearInterval(
                        pollingIntervalRef.current
                    );

                    pollingIntervalRef.current = null;

                    setStatusMessage(
                        "The payment request has expired. You can try again."
                    );

                    setStep("failed");

                    return;
                }

                try {
                    const res =
                        await orderService.getPaymentStatus(
                            checkoutRequestId
                        );

                    const payment =
                        res.data;

                    // ----------------------------------------
                    // SUCCESS
                    // ----------------------------------------

                    if (
                        payment.status ===
                        "success"
                    ) {
                        clearInterval(
                            pollingIntervalRef.current
                        );

                        pollingIntervalRef.current =
                            null;

                        setStep("success");

                        toast.success(
                            "Payment successful!"
                        );

                        setTimeout(() => {
                            navigate(
                                `/orders/${orderId}`,
                                {
                                    replace: true
                                }
                            );
                        }, 1000);

                        return;
                    }

                    // ----------------------------------------
                    // FAILED
                    // ----------------------------------------

                    if (
                        payment.status ===
                        "failed"
                    ) {
                        clearInterval(
                            pollingIntervalRef.current
                        );

                        pollingIntervalRef.current =
                            null;

                        setStatusMessage(
                            payment.resultDescription ||
                            "Payment failed. You can try again."
                        );

                        setStep("failed");

                        // If backend provides these
                        if (
                            payment.paymentAttempts !=
                            null
                        ) {
                            setPaymentAttempts(
                                payment.paymentAttempts
                            );
                        }

                        if (
                            payment.paymentLockedUntil
                        ) {
                            setPaymentLockedUntil(
                                payment.paymentLockedUntil
                            );
                        }

                        if (
                            payment.locked
                        ) {
                            setStep("locked");
                        }
                    }

                } catch (error) {
                    // Don't immediately fail the UI
                    // because a temporary polling error
                    // does not necessarily mean payment failed.
                    console.warn(
                        "Payment status polling error:",
                        error.message
                    );
                }
            }, POLL_INTERVAL_MS);
    };

    // ============================================
    // RETRY PAYMENT
    // ============================================

    const handleRetryPayment = async () => {
        if (!order?._id) {
            toast.error(
                "Order information is missing."
            );
            return;
        }

        if (isRetrying) {
            return;
        }

        setIsRetrying(true);

        setStatusMessage(
            "Sending a new payment prompt..."
        );

        try {
            await initiatePayment(
                order._id,
                address.phone
            );

        } catch (error) {
            handlePaymentError(error);
        } finally {
            setIsRetrying(false);
        }
    };

    // ============================================
    // EMPTY CART
    // ============================================

    if (
        !items.length &&
        step === "form"
    ) {
        return (
            <p className="py-24 text-center text-neutral-400">
                Your cart is empty.
            </p>
        );
    }

    // ============================================
    // PAYMENT SUCCESS
    // ============================================

    if (step === "success") {
        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">

                <CheckCircle2
                    size={42}
                    strokeWidth={1.5}
                    className="mx-auto"
                />

                <p className="mt-6 text-[13px] tracking-wide text-neutral-700">
                    PAYMENT SUCCESSFUL
                </p>

                <p className="mt-3 text-sm text-neutral-500">
                    Your order has been confirmed.
                </p>
            </div>
        );
    }

    // ============================================
    // PAYMENT LOCKED
    // ============================================

    if (step === "locked") {
        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">

                <Clock3
                    size={38}
                    strokeWidth={1.5}
                    className="mx-auto"
                />

                <p className="mt-6 text-[13px] tracking-wide text-neutral-700">
                    PAYMENT TEMPORARILY LOCKED
                </p>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                    You have reached the maximum number
                    of payment attempts.
                </p>

                <p className="mt-2 text-sm text-neutral-500">
                    {getLockMessage()}
                </p>
            </div>
        );
    }

    // ============================================
    // PAYMENT FLOW
    // ============================================

    if (step !== "form") {
        const attemptsRemaining =
            Math.max(
                MAX_PAYMENT_ATTEMPTS -
                paymentAttempts,
                0
            );

        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">

                {step === "placing" && (
                    <Loader2
                        size={28}
                        className="mx-auto animate-spin"
                        strokeWidth={1.5}
                    />
                )}

                {step === "awaiting_payment" && (
                    <Loader2
                        size={28}
                        className="mx-auto animate-spin"
                        strokeWidth={1.5}
                    />
                )}

                {step === "polling" && (
                    <Clock3
                        size={30}
                        className="mx-auto"
                        strokeWidth={1.5}
                    />
                )}

                {step === "failed" && (
                    <RotateCcw
                        size={32}
                        className="mx-auto"
                        strokeWidth={1.5}
                    />
                )}

                <p className="mt-6 text-[13px] tracking-wide text-neutral-700">

                    {step === "placing" &&
                        "PLACING YOUR ORDER..."}

                    {step === "awaiting_payment" &&
                        "SENDING PAYMENT PROMPT..."}

                    {step === "polling" &&
                        "CHECK YOUR PHONE"}

                    {step === "failed" &&
                        "PAYMENT DIDN'T GO THROUGH"}
                </p>

                {statusMessage && (
                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                        {statusMessage}
                    </p>
                )}

                {/* ----------------------------------------
                    ATTEMPTS REMAINING
                ---------------------------------------- */}

                {step === "failed" &&
                    paymentAttempts > 0 &&
                    !paymentLockedUntil && (
                        <p className="mt-4 text-xs text-neutral-400">
                            {attemptsRemaining}{" "}
                            {attemptsRemaining === 1
                                ? "attempt"
                                : "attempts"}{" "}
                            remaining
                        </p>
                    )}

                {/* ----------------------------------------
                    RETRY BUTTON
                ---------------------------------------- */}

                {step === "failed" &&
                    !paymentLockedUntil && (
                        <button
                            type="button"
                            onClick={
                                handleRetryPayment
                            }
                            disabled={isRetrying}
                            className="mx-auto mt-8 flex h-11 items-center gap-2 border border-neutral-900 px-6 text-[13px] tracking-wide transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isRetrying ? (
                                <>
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                    TRYING AGAIN...
                                </>
                            ) : (
                                <>
                                    <RotateCcw
                                        size={15}
                                    />
                                    TRY AGAIN
                                </>
                            )}
                        </button>
                    )}
            </div>
        );
    }

    // ============================================
    // CHECKOUT FORM
    // ============================================

    return (
        <div className="mx-auto max-w-md px-6 py-12">

            <h1 className="font-serif text-2xl">
                Checkout
            </h1>

            <form
                onSubmit={handlePlaceOrder}
                className="mt-8 space-y-5"
            >

                <input
                    required
                    name="fullName"
                    placeholder="Full name"
                    value={address.fullName}
                    onChange={handleChange}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    required
                    name="phone"
                    placeholder="M-Pesa phone number (e.g. 0712345678)"
                    value={address.phone}
                    onChange={handleChange}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    required
                    name="address"
                    placeholder="Delivery address"
                    value={address.address}
                    onChange={handleChange}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    required
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    required
                    name="country"
                    placeholder="Country"
                    value={address.country}
                    onChange={handleChange}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <div className="flex items-center justify-between border-t border-base-300 pt-5 text-sm">
                    <span className="text-neutral-500">
                        Subtotal
                    </span>

                    <span>
                        KES{" "}
                        {total.toLocaleString()}
                    </span>
                </div>

                <p className="text-[12px] text-neutral-400">
                    Final total (incl. shipping) is
                    confirmed after placing your order.
                </p>

                <button
                    type="submit"
                    disabled={step === "placing"}
                    className="flex h-12 w-full items-center justify-center gap-2 bg-neutral-900 text-[13px] tracking-wide text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {step === "placing" ? (
                        <>
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                            PLACING ORDER...
                        </>
                    ) : (
                        "PLACE ORDER AND PAY WITH M-PESA"
                    )}
                </button>

            </form>
        </div>
    );
}
