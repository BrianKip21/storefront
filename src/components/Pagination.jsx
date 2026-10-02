import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    pagination,
    onPageChange
}) {
    if (!pagination) return null;

    const {
        page,
        totalPages
    } = pagination;

    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 text-sm text-neutral-600 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <span className="text-sm text-neutral-500">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 text-sm text-neutral-600 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
