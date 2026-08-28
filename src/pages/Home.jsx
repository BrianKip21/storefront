import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import SectionHeader from "../components/SectionHeader";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import * as productService from "../services/productService";
import * as categoryService from "../services/categoryService";
import toast from "react-hot-toast";

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            productService.getProducts({ sort: "newest", limit: 8 }),
            categoryService.getCategories()
        ])
            .then(([productsRes, categoriesRes]) => {
                setFeatured(productsRes.data);
                setCategories(categoriesRes.data);
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <Hero />

            {categories.length > 0 && (
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <SectionHeader eyebrow="SHOP BY CATEGORY" className="mb-6" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {categories.slice(0, 4).map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-6xl px-6 py-12">
                <SectionHeader eyebrow="JUST ARRIVED" className="mb-8" />
                {loading ? <LoadingSpinner /> : <ProductGrid products={featured} />}
            </div>
        </div>
    );
}
