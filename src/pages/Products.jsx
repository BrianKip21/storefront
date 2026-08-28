import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productService from "../services/productService";
import * as categoryService from "../services/categoryService";
import * as brandService from "../services/brandService";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        categoryService.getCategories().then((res) => setCategories(res.data)).catch(() => {});
        brandService.getBrands().then((res) => setBrands(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;

        productService
            .getProducts(params)
            .then((res) => {
                setProducts(res.data);
                setPagination(res.pagination);
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [search, category, brand, sort, page]);

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        next.delete("page");
        setSearchParams(next);
    };

    const goToPage = (newPage) => {
        const next = new URLSearchParams(searchParams);
        next.set("page", newPage);
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-base-300 pb-4 text-[13px]">
                <div className="w-40">
                    <SearchBar defaultValue={search} onSearch={(value) => updateParam("search", value)} />
                </div>

                <select
                    value={category}
                    onChange={(e) => updateParam("category", e.target.value)}
                    className="select select-ghost select-sm bg-transparent px-0 text-neutral-600"
                >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={brand}
                    onChange={(e) => updateParam("brand", e.target.value)}
                    className="select select-ghost select-sm bg-transparent px-0 text-neutral-600"
                >
                    <option value="">All brands</option>
                    {brands.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={(e) => updateParam("sort", e.target.value)}
                    className="select select-ghost select-sm ml-auto bg-transparent px-0 text-neutral-600"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="most_reviewed">Most Reviewed</option>
                </select>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <ProductGrid products={products} />

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-6 text-[13px] text-neutral-600">
                            <button
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => goToPage(page - 1)}
                                className="border-b border-neutral-900 disabled:border-transparent disabled:text-neutral-300"
                            >
                                Previous
                            </button>
                            <span className="text-neutral-400">
                                {pagination.page} / {pagination.totalPages}
                            </span>
                            <button
                                disabled={!pagination.hasNextPage}
                                onClick={() => goToPage(page + 1)}
                                className="border-b border-neutral-900 disabled:border-transparent disabled:text-neutral-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
