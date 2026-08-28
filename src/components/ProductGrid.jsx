import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
    if (!products?.length) {
        return <p className="py-20 text-center text-neutral-400">No products found.</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
