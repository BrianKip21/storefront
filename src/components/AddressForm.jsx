import { useState } from "react";
import toast from "react-hot-toast";

const normalizeKenyanPhone = (phone) => {
    const value = phone.trim().replace(/\s+/g, "");

    // 0712345678 / 0112345678
    if (/^0[17]\d{8}$/.test(value)) {
        return `254${value.slice(1)}`;
    }

    // +254712345678 / +254112345678
    if (/^\+254[17]\d{8}$/.test(value)) {
        return value.slice(1);
    }

    // 254712345678 / 254112345678
    if (/^254[17]\d{8}$/.test(value)) {
        return value;
    }

    return null;
};

export default function AddressForm({
    initialData,
    onSubmit,
    onCancel,
    submitting,
    checkoutMode = false
}) {
    const [form, setForm] = useState({
        label: initialData?.label || "Home",
        fullName: initialData?.fullName || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        country: initialData?.country || "Kenya",
        isDefault: initialData?.isDefault || false,
        saveAddress: false
    });

    const handleChange = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const normalizedPhone = normalizeKenyanPhone(form.phone);

        if (!normalizedPhone) {
            toast.error(
                "Enter a valid Kenyan phone number, e.g. 0712345678"
            );
            return;
        }

        onSubmit({
            ...form,
            phone: normalizedPhone
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 border border-neutral-200 p-5"
        >
            {/* NAME */}

            <input
                placeholder="Full name"
                required
                value={form.fullName}
                onChange={(e) =>
                    handleChange("fullName", e.target.value)
                }
                className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
            />

            {/* PHONE */}

            <input
                type="tel"
                inputMode="numeric"
                placeholder="Phone number (e.g. 0712345678)"
                required
                value={form.phone}
                onChange={(e) =>
                    handleChange("phone", e.target.value)
                }
                className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
            />

            {/* ADDRESS */}

            <input
                placeholder="Address"
                required
                value={form.address}
                onChange={(e) =>
                    handleChange("address", e.target.value)
                }
                className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
            />

            {/* CITY + COUNTRY */}

            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="City"
                    required
                    value={form.city}
                    onChange={(e) =>
                        handleChange("city", e.target.value)
                    }
                    className="border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    placeholder="Country"
                    required
                    value={form.country}
                    onChange={(e) =>
                        handleChange("country", e.target.value)
                    }
                    className="border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
            </div>

            {/* LABEL */}

            {!checkoutMode && (
                <input
                    placeholder="Label (e.g. Home, Work)"
                    value={form.label}
                    onChange={(e) =>
                        handleChange("label", e.target.value)
                    }
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />
            )}

            {/* CHECKOUT: SAVE FOR FUTURE */}

            {checkoutMode ? (
                <label className="flex items-center gap-2 pt-2 text-[12px] text-neutral-600">
                    <input
                        type="checkbox"
                        checked={form.saveAddress}
                        onChange={(e) =>
                            handleChange(
                                "saveAddress",
                                e.target.checked
                            )
                        }
                    />

                    Save this address for future orders
                </label>
            ) : (
                /* NORMAL ADDRESS MANAGEMENT */

                <label className="flex items-center gap-2 pt-2 text-[12px] text-neutral-600">
                    <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={(e) =>
                            handleChange(
                                "isDefault",
                                e.target.checked
                            )
                        }
                    />

                    Set as default address
                </label>
            )}

            {/* BUTTONS */}

            <div className="flex gap-3 pt-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="h-10 flex-1 bg-neutral-900 text-[13px] tracking-wide text-white disabled:opacity-40"
                >
                    {submitting
                        ? "PROCESSING..."
                        : checkoutMode
                            ? "USE THIS ADDRESS"
                            : "SAVE ADDRESS"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 border border-neutral-300 px-4 text-[13px]"
                >
                    CANCEL
                </button>
            </div>
        </form>
    );
}