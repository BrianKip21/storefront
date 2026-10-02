import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import storyImage from "../assets/story.jpg";

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
        <div className="bg-white">

            {/* Hero */}
            <Hero />

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
                    <SectionHeader
                        eyebrow="SHOP BY CATEGORY"
                        className="mb-8"
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

            {/* New Arrivals */}
            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div className="flex items-end justify-between gap-6">
                    <SectionHeader
                        eyebrow="JUST ARRIVED"
                    />

                    <Link
                        to="/products"
                        className="hidden border-b border-neutral-900 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-900 transition-opacity hover:opacity-50 sm:inline-block"
                    >
                        Shop all
                    </Link>
                </div>

                <div className="mt-8">
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
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/products"
                        className="inline-block border-b border-neutral-900 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-900"
                    >
                        Shop all
                    </Link>
                </div>
            </section>

            {/* Collections */}
            {collections.length > 0 && (
                <section className="border-y border-neutral-100 bg-neutral-50">
                    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
                        <SectionHeader
                            eyebrow="EXPLORE OUR COLLECTIONS"
                            className="mb-8"
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
                    </div>
                </section>
            )}

            {/* Brand Story */}
            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-10">
                <div className="group relative min-h-[520px] overflow-hidden bg-neutral-900 sm:min-h-[600px]">

                    {/* Story image */}
                    <img
                        src={storyImage}
                        alt="Liaan Collections"
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />

                    {/* Story content */}
                    <div className="relative z-10 flex min-h-[520px] items-end sm:min-h-[600px]">
                        <div className="max-w-xl px-6 pb-10 sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">

                            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-[10px]">
                                LIAAN COLLECTIONS
                            </p>

                            <h2 className="mt-3 max-w-lg font-serif text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Style should feel personal.
                            </h2>

                            <p className="mt-4 max-w-md text-xs leading-6 text-white/80 sm:text-sm">
                                We curate thoughtfully selected
                                thrift pieces for people who want
                                to dress differently, express
                                themselves freely, and find pieces
                                worth keeping.
                            </p>

                            <Link
                                to="/collections"
                                className="mt-7 inline-flex bg-white px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white sm:px-7"
                            >
                                Explore the collection
                            </Link>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
