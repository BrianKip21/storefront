import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
    return (
        <Link
            to={`/products?category=${category._id}`}
            className="group block bg-base-200 px-6 py-10 text-center"
        >
            <p className="text-[13px] tracking-wide text-neutral-800 group-hover:underline">
                {category.name}
            </p>
        </Link>
    );
}
