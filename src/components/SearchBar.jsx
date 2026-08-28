import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ defaultValue = "", onSearch, placeholder = "Search" }) {
    const [value, setValue] = useState(defaultValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-neutral-300 pb-1">
            <Search size={14} strokeWidth={1.5} className="text-neutral-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
        </form>
    );
}
