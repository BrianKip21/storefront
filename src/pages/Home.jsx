import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Hero from "../components/Hero";
import SectionHeader from "../components/SectionHeader";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import CollectionCard from "../components/CollectionCard";
import LoadingSpinner from "../components/LoadingSpinner";

import * as productService from "../services/productService";
import * as categoryService from "../services/categoryService";
import * as collectionService from "../services/collectionService";

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);

                const [
                    productsRes,
                    categoriesRes,
                    collectionsRes
                ] = await Promise.all([
                    productService.getProducts({
                        sort: "newest",
                        limit: 8
                    }),

                    categoryService.getCategories(),

                    collectionService.getCollections()
                ]);

                setFeatured(
                    productsRes.data || []
                );

                setCategories(
                    categoriesRes.data || []
                );

                setCollections(
                    (collectionsRes.collections || [])
                        .slice(0, 3)
                );
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load homepage"
                );
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    return (
        <div>
            <Hero />

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 py-12">
                    <SectionHeader
                        eyebrow="SHOP BY CATEGORY"
                        className="mb-6"
                    />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {categories
                            .slice(0, 4)
                            .map((category) => (
                                <CategoryCard
                                    key={category._id}
                                    category={category}
                                />
                            ))}
                    </div>
                </section>
            )}

            {/* Collections */}
            {collections.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 py-12">
                    <SectionHeader
                        eyebrow="EXPLORE OUR COLLECTIONS"
                        className="mb-6"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {collections.map(
                            (collection) => (
                                <CollectionCard
                                    key={collection._id}
                                    collection={collection}
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {/* New arrivals */}
            <section className="mx-auto max-w-6xl px-6 py-12">
                <SectionHeader
                    eyebrow="JUST ARRIVED"
                    className="mb-8"
                />

                {loading ? (
                    <LoadingSpinner />
                ) : featured.length > 0 ? (
                    <ProductGrid
                        products={featured}
                    />
                ) : (
                    <p className="py-10 text-center text-sm text-neutral-500">
                        No products available.
                    </p>
                )}
            </section>
        </div>
    );
}
