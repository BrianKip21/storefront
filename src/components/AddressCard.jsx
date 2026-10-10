export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault
}) {
    return (
        <div className="border border-neutral-200 p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium">
                            {address.label}
                        </p>

                        {address.isDefault && (
                            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-white">
                                DEFAULT
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
                        {address.fullName}
                        <br />
                        {address.address}, {address.city}
                        <br />
                        {address.country} · {address.phone}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex gap-4 text-[12px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                    }}
                    className="underline"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(address._id);
                    }}
                    className="text-red-600 underline"
                >
                    Delete
                </button>

                {!address.isDefault && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSetDefault(address);
                        }}
                        className="underline"
                    >
                        Set as default
                    </button>
                )}
            </div>
        </div>
    );
}