
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
    if (!products?.length) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <p className="font-serif text-xl text-neutral-800">
                    Nothing found
                </p>

                <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-400">
                    Try adjusting your search or filters to find what you're
                    looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>
    );
}
