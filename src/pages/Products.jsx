
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
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
    const [filtersOpen, setFiltersOpen] = useState(false);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = Number(searchParams.get("page")) || 1;

    // ---------------------------------------------------------
    // LOAD FILTER OPTIONS
    // ---------------------------------------------------------

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [categoryRes, brandRes] = await Promise.all([
                    categoryService.getCategories(),
                    brandService.getBrands()
                ]);

                setCategories(categoryRes.data || []);
                setBrands(brandRes.data || []);
            } catch (error) {
                console.error("Failed to load filters:", error);
            }
        };

        loadFilters();
    }, []);

    // ---------------------------------------------------------
    // LOAD PRODUCTS
    // ---------------------------------------------------------

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);

            try {
                const params = {
                    page,
                    limit: 12,
                    sort
                };

                if (search) {
                    params.search = search;
                }

                if (category) {
                    params.category = category;
                }

                if (brand) {
                    params.brand = brand;
                }

                console.log("Fetching products with:", params);

                const res = await productService.getProducts(params);

                console.log("Products returned:", res.data);

                setProducts(res.data || []);
                setPagination(res.pagination || null);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error(
                    error?.message || "Failed to load products"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [search, category, brand, sort, page]);

    // ---------------------------------------------------------
    // UPDATE URL FILTER
    // ---------------------------------------------------------

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);

        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }

        // Whenever a filter changes, return to page 1
        next.delete("page");

        setSearchParams(next);
    };

    // ---------------------------------------------------------
    // CLEAR ALL FILTERS
    // ---------------------------------------------------------

    const clearFilters = () => {
        const next = new URLSearchParams();

        if (search) {
            next.set("search", search);
        }

        setSearchParams(next);
    };

    // ---------------------------------------------------------
    // PAGINATION
    // ---------------------------------------------------------

    const goToPage = (newPage) => {
        const next = new URLSearchParams(searchParams);

        next.set("page", newPage);

        setSearchParams(next);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const hasFilters =
        category ||
        brand ||
        search;

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-8 flex items-end justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-neutral-400">
                        Shop
                    </p>

                    <h1 className="mt-2 font-serif text-3xl tracking-tight">
                        All products
                    </h1>

                    {!loading && pagination && (
                        <p className="mt-2 text-xs text-neutral-400">
                            {pagination.totalCount}{" "}
                            {pagination.totalCount === 1
                                ? "piece"
                                : "pieces"}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="flex items-center gap-2 border-b border-neutral-900 pb-1 text-xs tracking-wide"
                >
                    <SlidersHorizontal size={14} strokeWidth={1.5} />

                    {filtersOpen
                        ? "Hide filters"
                        : "Filter & sort"}
                </button>
            </div>

            {/* =================================================
                FILTER PANEL
            ================================================= */}

            {filtersOpen && (
                <div className="mb-10 border-y border-neutral-200 py-6">

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {/* SEARCH */}

                        <div>
                            <p className="mb-3 text-[10px] uppercase tracking-[1.5px] text-neutral-400">
                                Search
                            </p>

                            <SearchBar
                                defaultValue={search}
                                onSearch={(value) =>
                                    updateParam("search", value)
                                }
                            />
                        </div>

                        {/* CATEGORY */}

                        <div>
                            <p className="mb-3 text-[10px] uppercase tracking-[1.5px] text-neutral-400">
                                Category
                            </p>

                            <select
                                value={category}
                                onChange={(e) =>
                                    updateParam(
                                        "category",
                                        e.target.value
                                    )
                                }
                                className="h-10 w-full border-b border-neutral-300 bg-transparent px-0 text-sm outline-none focus:border-neutral-900"
                            >
                                <option value="">
                                    All categories
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* BRAND */}

                        <div>
                            <p className="mb-3 text-[10px] uppercase tracking-[1.5px] text-neutral-400">
                                Brand
                            </p>

                            <select
                                value={brand}
                                onChange={(e) =>
                                    updateParam(
                                        "brand",
                                        e.target.value
                                    )
                                }
                                className="h-10 w-full border-b border-neutral-300 bg-transparent px-0 text-sm outline-none focus:border-neutral-900"
                            >
                                <option value="">
                                    All brands
                                </option>

                                {brands.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SORT */}

                        <div>
                            <p className="mb-3 text-[10px] uppercase tracking-[1.5px] text-neutral-400">
                                Sort by
                            </p>

                            <select
                                value={sort}
                                onChange={(e) =>
                                    updateParam(
                                        "sort",
                                        e.target.value
                                    )
                                }
                                className="h-10 w-full border-b border-neutral-300 bg-transparent px-0 text-sm outline-none focus:border-neutral-900"
                            >
                                <option value="newest">
                                    Newest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                                <option value="price_asc">
                                    Price: Low to High
                                </option>

                                <option value="price_desc">
                                    Price: High to Low
                                </option>

                                <option value="rating">
                                    Top Rated
                                </option>

                                <option value="most_reviewed">
                                    Most Reviewed
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ACTIVE FILTERS */}

                    {hasFilters && (
                        <div className="mt-6 flex flex-wrap items-center gap-3">

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateParam("search", "")
                                    }
                                    className="flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs"
                                >
                                    Search: {search}
                                    <X size={12} />
                                </button>
                            )}

                            {category && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateParam("category", "")
                                    }
                                    className="flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs"
                                >
                                    Category:{" "}
                                    {
                                        categories.find(
                                            (item) =>
                                                item._id === category
                                        )?.name
                                    }
                                    <X size={12} />
                                </button>
                            )}

                            {brand && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateParam("brand", "")
                                    }
                                    className="flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs"
                                >
                                    Brand:{" "}
                                    {
                                        brands.find(
                                            (item) =>
                                                item._id === brand
                                        )?.name
                                    }
                                    <X size={12} />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="ml-auto text-xs text-neutral-400 underline underline-offset-4 hover:text-neutral-900"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* =================================================
                PRODUCTS
            ================================================= */}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <ProductGrid products={products} />

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {pagination &&
                        pagination.totalPages > 1 && (
                            <div className="mt-14 flex items-center justify-center gap-8 text-xs">

                                <button
                                    type="button"
                                    disabled={
                                        !pagination.hasPreviousPage
                                    }
                                    onClick={() =>
                                        goToPage(page - 1)
                                    }
                                    className="border-b border-neutral-900 pb-1 disabled:border-transparent disabled:text-neutral-300"
                                >
                                    Previous
                                </button>

                                <span className="text-neutral-400">
                                    {pagination.page} /{" "}
                                    {pagination.totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        !pagination.hasNextPage
                                    }
                                    onClick={() =>
                                        goToPage(page + 1)
                                    }
                                    className="border-b border-neutral-900 pb-1 disabled:border-transparent disabled:text-neutral-300"
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

