import { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

export default function AddressList({
    addresses,
    onAdd,
    onEdit,
    onDelete,
    onSetDefault,
    selectable = false,
    selectedId,
    onSelect,
    onUseDifferentAddress
}) {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (form) => {
        setSubmitting(true);

        try {
            if (editingAddress) {
                await onEdit(editingAddress._id, form);
            } else {
                await onAdd(form);
            }

            setShowForm(false);
            setEditingAddress(null);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-3">

            {/* ----------------------------------------
                SAVED ADDRESSES
            ---------------------------------------- */}

            {addresses.map((address) => (
                <div
                    key={address._id}
                    className={
                        selectable
                            ? "cursor-pointer"
                            : ""
                    }
                    onClick={() => {
                        if (selectable) {
                            onSelect(address._id);
                        }
                    }}
                >
                    <div
                        className={
                            selectable &&
                            selectedId === address._id
                                ? "ring-2 ring-neutral-900"
                                : ""
                        }
                    >
                        <AddressCard
                            address={address}
                            onEdit={(address) => {
                                setEditingAddress(address);
                                setShowForm(true);
                            }}
                            onDelete={onDelete}
                            onSetDefault={(address) =>
                                onSetDefault(address._id)
                            }
                        />
                    </div>
                </div>
            ))}

            {/* ----------------------------------------
                ADD SAVED ADDRESS
            ---------------------------------------- */}

            {showForm ? (
                <AddressForm
                    initialData={editingAddress}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                    }}
                    submitting={submitting}
                />
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        setEditingAddress(null);
                        setShowForm(true);
                    }}
                    className="w-full border border-dashed border-neutral-300 py-3 text-[13px] text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
                >
                    + Add new address
                </button>
            )}

            {/* ----------------------------------------
                USE DIFFERENT ADDRESS
            ---------------------------------------- */}

            {selectable && onUseDifferentAddress && (
                <button
                    type="button"
                    onClick={onUseDifferentAddress}
                    className="w-full border border-neutral-200 py-3 text-[13px] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                >
                    Use a different address
                </button>
            )}

        </div>
    );
}