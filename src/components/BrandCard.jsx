import { Link } from "react-router-dom";

export default function BrandCard({ brand }) {
    return (
        <Link
            to={`/products?brand=${brand._id}`}
            className="group block border border-base-300 px-6 py-10 text-center"
        >
            <p className="text-[13px] tracking-wide text-neutral-800 group-hover:underline">
                {brand.name}
            </p>
        </Link>
    );
}
