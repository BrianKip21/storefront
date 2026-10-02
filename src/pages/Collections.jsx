import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as collectionService from "../services/collectionService";
import CollectionCard from "../components/CollectionCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Collections() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        collectionService.getCollections()
            .then((res) => setCollections(res.collections || []))
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">
                EXPLORE
            </p>

            <h1 className="mt-2 font-serif text-3xl">
                Our collections
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {collections.map((collection) => (
                    <CollectionCard
                        key={collection._id}
                        collection={collection}
                    />
                ))}
            </div>
        </div>
    );
}