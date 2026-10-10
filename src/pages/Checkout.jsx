import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useAddresses } from "../hooks/useAddresses";
import * as orderService from "../services/orderService";
import AddressList from "../components/AddressList";
import AddressForm from "../components/AddressForm";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000;

export default function Checkout() {
    const items = useCartStore((s) => s.items);
    const total = useCartStore((s) => s.total);
    const refreshCart = useCartStore((s) => s.refreshCart);

    const navigate = useNavigate();

    const {
        addresses,
        loading: loadingAddresses,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress
    } = useAddresses();

    // ----------------------------------------
    // ADDRESS STATE
    // ----------------------------------------

    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [usingDifferentAddress, setUsingDifferentAddress] =
        useState(false);

    const [temporaryAddress, setTemporaryAddress] =
        useState(null);

    const [submittingAddress, setSubmittingAddress] =
        useState(false);

    // ----------------------------------------
    // CHECKOUT STATE
    // ----------------------------------------

    const [step, setStep] = useState("form");
    const [order, setOrder] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    // ----------------------------------------
    // SELECTED SAVED ADDRESS
    // ----------------------------------------

    const selectedAddress =
        addresses.find(
            (address) => address._id === selectedAddressId
        ) ||
        addresses.find(
            (address) => address.isDefault
        ) ||
        addresses[0] ||
        null;

    // ----------------------------------------
    // CURRENT SHIPPING ADDRESS
    // ----------------------------------------

    const currentShippingAddress =
        temporaryAddress || selectedAddress;

    // ----------------------------------------
    // USE DIFFERENT ADDRESS
    // ----------------------------------------

    const handleUseDifferentAddress = () => {
        setUsingDifferentAddress(true);

        // Clear any previous temporary address
        setTemporaryAddress(null);
    };

    // ----------------------------------------
    // TEMPORARY ADDRESS SUBMIT
    // ----------------------------------------

    const handleTemporaryAddress = async (form) => {
        setSubmittingAddress(true);

        try {
            setTemporaryAddress({
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                country: form.country.trim(),
                saveAddress: form.saveAddress === true
            });

            setUsingDifferentAddress(false);

            toast.success("Shipping address selected");
        } finally {
            setSubmittingAddress(false);
        }
    };

    // ----------------------------------------
    // RETURN TO SAVED ADDRESSES
    // ----------------------------------------

    const handleUseSavedAddress = () => {
        setTemporaryAddress(null);
        setUsingDifferentAddress(false);
    };

    // ----------------------------------------
    // PLACE ORDER
    // ----------------------------------------

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!currentShippingAddress) {
            toast.error(
                "Please select or add a shipping address"
            );
            return;
        }

        setStep("placing");

        try {
            let orderPayload;

            // ----------------------------------------
            // TEMPORARY / CUSTOM ADDRESS
            // ----------------------------------------

            if (temporaryAddress) {
                orderPayload = {
                    shippingAddress: {
                        fullName:
                            temporaryAddress.fullName,
                        phone:
                            temporaryAddress.phone,
                        address:
                            temporaryAddress.address,
                        city:
                            temporaryAddress.city,
                        country:
                            temporaryAddress.country
                    },

                    saveAddress:
                        temporaryAddress.saveAddress
                };
            }

            // ----------------------------------------
            // SAVED ADDRESS
            // ----------------------------------------

            else {
                orderPayload = {
                    addressId: selectedAddress._id
                };
            }

            // ----------------------------------------
            // CREATE ORDER
            // ----------------------------------------

            const orderRes =
                await orderService.placeOrder(
                    orderPayload
                );

            const createdOrder = orderRes.data;

            setOrder(createdOrder);

            // ----------------------------------------
            // REFRESH CART
            // ----------------------------------------

            await refreshCart();

            // ----------------------------------------
            // START PAYMENT
            // ----------------------------------------

            setStep("awaiting_payment");

            const payRes =
                await orderService.payForOrder({
                    orderId: createdOrder._id,
                    phone:
                        currentShippingAddress.phone
                });

            setStatusMessage(
                payRes.data.message
            );

            pollPaymentStatus(
                payRes.data.checkoutRequestId,
                createdOrder._id
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Unable to place order"
            );

            setStep("form");
        }
    };

    // ----------------------------------------
    // POLL PAYMENT STATUS
    // ----------------------------------------

    const pollPaymentStatus = (
        checkoutRequestId,
        orderId
    ) => {
        setStep("polling");

        const startedAt = Date.now();

        const interval = setInterval(async () => {

            if (
                Date.now() - startedAt >
                POLL_TIMEOUT_MS
            ) {
                clearInterval(interval);

                setStatusMessage(
                    "Still waiting on confirmation — check your Orders page shortly."
                );

                setStep("timed_out");

                return;
            }

            try {

                const res =
                    await orderService.getPaymentStatus(
                        checkoutRequestId
                    );

                if (
                    res.data.status === "success"
                ) {
                    clearInterval(interval);

                    toast.success(
                        "Payment successful"
                    );

                    navigate(
                        `/orders/${orderId}`,
                        { replace: true }
                    );
                }

                else if (
                    res.data.status === "failed"
                ) {
                    clearInterval(interval);

                    setStatusMessage(
                        res.data.resultDescription ||
                        "Payment failed. You can retry below."
                    );

                    setStep("failed");
                }

            } catch {
                // Continue polling
            }

        }, POLL_INTERVAL_MS);
    };

    // ----------------------------------------
    // RETRY PAYMENT
    // ----------------------------------------

    const handleRetryPayment = async () => {

        if (
            !order ||
            !currentShippingAddress
        ) {
            return;
        }

        setStep("awaiting_payment");

        try {

            const payRes =
                await orderService.payForOrder({
                    orderId: order._id,
                    phone:
                        currentShippingAddress.phone
                });

            setStatusMessage(
                payRes.data.message
            );

            pollPaymentStatus(
                payRes.data.checkoutRequestId,
                order._id
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Unable to retry payment"
            );

            setStep("failed");
        }
    };

    // ----------------------------------------
    // EMPTY CART
    // ----------------------------------------

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

    // ----------------------------------------
    // PAYMENT STATES
    // ----------------------------------------

    if (step !== "form") {
        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">

                <p className="text-[13px] tracking-wide text-neutral-700">

                    {step === "placing" &&
                        "PLACING YOUR ORDER..."}

                    {step === "awaiting_payment" &&
                        "SENDING PAYMENT PROMPT..."}

                    {step === "polling" &&
                        "CHECK YOUR PHONE"}

                    {step === "timed_out" &&
                        "STILL WAITING ON CONFIRMATION"}

                    {step === "failed" &&
                        "PAYMENT DIDN'T GO THROUGH"}

                </p>

                {statusMessage && (
                    <p className="mt-3 text-sm text-neutral-500">
                        {statusMessage}
                    </p>
                )}

                {(step === "failed" ||
                    step === "timed_out") && (

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

    // ----------------------------------------
    // CHECKOUT FORM
    // ----------------------------------------

    return (
        <div className="mx-auto max-w-md px-6 py-12">

            <h1 className="font-serif text-2xl">
                Checkout
            </h1>

            <div className="mt-8">

                <p className="mb-3 text-[11px] tracking-[1.5px] text-neutral-400">
                    SHIPPING ADDRESS
                </p>

                {loadingAddresses ? (

                    <p className="text-[13px] text-neutral-400">
                        Loading addresses...
                    </p>

                ) : usingDifferentAddress ? (

                    // ----------------------------------------
                    // CUSTOM ADDRESS FORM
                    // ----------------------------------------

                    <div className="space-y-4">

                        <AddressForm
                            checkoutMode
                            onSubmit={
                                handleTemporaryAddress
                            }
                            onCancel={
                                handleUseSavedAddress
                            }
                            submitting={
                                submittingAddress
                            }
                        />

                    </div>

                ) : temporaryAddress ? (

                    // ----------------------------------------
                    // TEMPORARY ADDRESS PREVIEW
                    // ----------------------------------------

                    <div className="space-y-4">

                        <div className="border border-neutral-900 p-4">

                            <p className="text-sm font-medium">
                                {temporaryAddress.fullName}
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                {temporaryAddress.phone}
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                {temporaryAddress.address}
                            </p>

                            <p className="text-sm text-neutral-500">
                                {temporaryAddress.city},{" "}
                                {temporaryAddress.country}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={
                                handleUseDifferentAddress
                            }
                            className="w-full border border-neutral-300 py-3 text-[13px]"
                        >
                            EDIT ADDRESS
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleUseSavedAddress
                            }
                            className="w-full text-[12px] text-neutral-500 underline underline-offset-4"
                        >
                            USE SAVED ADDRESS INSTEAD
                        </button>

                    </div>

                ) : (

                    // ----------------------------------------
                    // SAVED ADDRESSES
                    // ----------------------------------------

                    <AddressList
                        addresses={addresses}
                        onAdd={addAddress}
                        onEdit={editAddress}
                        onDelete={deleteAddress}
                        onSetDefault={
                            setDefaultAddress
                        }
                        selectable
                        selectedId={
                            selectedAddress?._id
                        }
                        onSelect={
                            setSelectedAddressId
                        }
                        onUseDifferentAddress={
                            handleUseDifferentAddress
                        }
                    />

                )}

            </div>

            {/* ----------------------------------------
                ORDER TOTAL
            ---------------------------------------- */}

            <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5 text-sm">

                <span className="text-neutral-500">
                    Subtotal
                </span>

                <span>
                    KES {total.toLocaleString()}
                </span>

            </div>

            <p className="text-[12px] text-neutral-400">
                Final total (incl. shipping) is confirmed after placing your order.
            </p>

            {/* ----------------------------------------
                PLACE ORDER
            ---------------------------------------- */}

            <button
                onClick={handlePlaceOrder}
                disabled={!currentShippingAddress}
                className="mt-6 h-12 w-full bg-neutral-900 text-[13px] tracking-wide text-white disabled:opacity-40"
            >
                PLACE ORDER AND PAY WITH M-PESA
            </button>

        </div>
    );
}