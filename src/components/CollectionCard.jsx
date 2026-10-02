import { Link } from "react-router-dom";

export default function CollectionCard({ collection }) {
    return (
        <Link
            to={`/collections/${collection.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-sm"
        >
            {collection.image ? (
                <img
                    src={collection.image}
                    alt={collection.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="h-full w-full bg-neutral-200" />
            )}

            <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

            <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-serif text-xl tracking-wide text-white">
                    {collection.name}
                </p>
            </div>
        </Link>
    );
}