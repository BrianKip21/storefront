import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import * as collectionService from "../services/collectionService";
import * as categoryService from "../services/categoryService";
import * as brandService from "../services/brandService";

import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";

export default function CollectionDetail() {
    const { slug } = useParams();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [collection, setCollection] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [categories, setCategories] =
        useState([]);

    const [brands, setBrands] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category") || "";

    const brand =
        searchParams.get("brand") || "";

    const sort =
        searchParams.get("sort") || "newest";

    const page =
        Number(searchParams.get("page")) || 1;

    /*
     * Load filter options.
     */
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [
                    categoryResponse,
                    brandResponse
                ] = await Promise.all([
                    categoryService.getCategories(),
                    brandService.getBrands()
                ]);

                setCategories(
                    categoryResponse.data || []
                );

                setBrands(
                    brandResponse.data || []
                );
            } catch {
                // Filters are optional, so don't
                // interrupt the main collection page.
            }
        };

        loadFilters();
    }, []);

    /*
     * Load collection products.
     */
    useEffect(() => {
        const loadCollection = async () => {
            try {
                setLoading(true);

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

                const res =
                    await collectionService
                        .getCollectionBySlug(
                            slug,
                            params
                        );

                setCollection(
                    res.collection
                );

                setProducts(
                    res.products || []
                );

                setPagination(
                    res.pagination || null
                );
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load collection";

                toast.error(message);

                setCollection(null);
                setProducts([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        };

        loadCollection();
    }, [
        slug,
        search,
        category,
        brand,
        sort,
        page
    ]);

    /*
     * Update a URL filter.
     *
     * Changing a filter resets pagination
     * back to page 1.
     */
    const updateParam = (key, value) => {
        const next =
            new URLSearchParams(searchParams);

        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }

        next.delete("page");

        setSearchParams(next);
    };

    /*
     * Change pagination page.
     */
    const handlePageChange = (nextPage) => {
        if (!pagination) return;

        if (
            nextPage < 1 ||
            nextPage > pagination.totalPages
        ) {
            return;
        }

        const next =
            new URLSearchParams(searchParams);

        next.set(
            "page",
            String(nextPage)
        );

        setSearchParams(next);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    /*
     * Initial loading state.
     */
    if (loading && !collection) {
        return <LoadingSpinner />;
    }

    /*
     * Collection could not be found.
     */
    if (!collection) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-20 text-center">
                <p className="text-sm text-neutral-500">
                    Collection not found.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Collection header */}
            <section className="border-b border-neutral-200 px-6 py-14 text-center">
                <p className="text-[11px] tracking-[1.5px] text-neutral-400">
                    COLLECTION
                </p>

                <h1 className="mt-2 font-serif text-3xl tracking-tight">
                    {collection.name}
                </h1>

                {collection.description && (
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                        {collection.description}
                    </p>
                )}
            </section>

            {/* Products */}
            <main className="mx-auto max-w-6xl px-6 py-8">
                {/* Filters */}
                <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-neutral-200 pb-4 text-[13px]">
                    <div className="w-full sm:w-48">
                        <SearchBar
                            defaultValue={search}
                            onSearch={(value) =>
                                updateParam(
                                    "search",
                                    value
                                )
                            }
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) =>
                            updateParam(
                                "category",
                                e.target.value
                            )
                        }
                        className="bg-transparent text-neutral-600 outline-none"
                    >
                        <option value="">
                            All categories
                        </option>

                        {categories.map(
                            (categoryItem) => (
                                <option
                                    key={
                                        categoryItem._id
                                    }
                                    value={
                                        categoryItem._id
                                    }
                                >
                                    {
                                        categoryItem.name
                                    }
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={brand}
                        onChange={(e) =>
                            updateParam(
                                "brand",
                                e.target.value
                            )
                        }
                        className="bg-transparent text-neutral-600 outline-none"
                    >
                        <option value="">
                            All brands
                        </option>

                        {brands.map(
                            (brandItem) => (
                                <option
                                    key={
                                        brandItem._id
                                    }
                                    value={
                                        brandItem._id
                                    }
                                >
                                    {brandItem.name}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) =>
                            updateParam(
                                "sort",
                                e.target.value
                            )
                        }
                        className="sm:ml-auto bg-transparent text-neutral-600 outline-none"
                    >
                        <option value="newest">
                            Newest
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

                {/* Products */}
                {loading ? (
                    <div className="py-16">
                        <LoadingSpinner />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <ProductGrid
                            products={products}
                        />

                        <Pagination
                            pagination={pagination}
                            onPageChange={
                                handlePageChange
                            }
                        />
                    </>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-sm text-neutral-500">
                            No products found in this
                            collection.
                        </p>

                        {(search ||
                            category ||
                            brand) && (
                            <button
                                type="button"
                                onClick={() => {
                                    const next =
                                        new URLSearchParams();

                                    setSearchParams(
                                        next
                                    );
                                }}
                                className="mt-3 text-sm underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

