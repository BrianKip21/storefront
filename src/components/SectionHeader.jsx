export default function SectionHeader({ eyebrow, title, className = "" }) {
    return (
        <div className={className}>
            {eyebrow && (
                <p className="text-[11px] tracking-[1.5px] text-neutral-400">{eyebrow}</p>
            )}
            {title && <h2 className="mt-1 font-serif text-2xl">{title}</h2>}
        </div>
    );
}
