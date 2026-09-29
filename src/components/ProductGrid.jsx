import ProductCard from "./ProductCard";

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[4/5] bg-neutral-100" />

            <div className="mt-4 space-y-2">
                <div className="h-3 w-3/4 bg-neutral-100" />
                <div className="h-3 w-1/2 bg-neutral-100" />
                <div className="h-3 w-1/3 bg-neutral-100" />
            </div>
        </div>
    );
}

export default function ProductGrid({ products, loading = false }) {
    // Loading state
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!products?.length) {
        return (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                <p className="font-serif text-2xl text-neutral-900">
                    Nothing found
                </p>

                <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Try adjusting your search or filters to find what you're
                    looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>
    );
}
