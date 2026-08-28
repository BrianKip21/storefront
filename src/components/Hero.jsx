export default function Hero({
    eyebrow = "RADICALLY TRANSPARENT",
    title = "Fewer, better things",
    subtitle = "Considered essentials, made to last."
}) {
    return (
        <div className="border-b border-base-300 px-6 py-16 text-center sm:py-24">
            <p className="text-[11px] tracking-[2px] text-neutral-400">{eyebrow}</p>
            <h1 className="mx-auto mt-3 max-w-md font-serif text-3xl leading-snug sm:text-4xl">
                {title}
            </h1>
            {subtitle && <p className="mt-3 text-sm text-neutral-500">{subtitle}</p>}
        </div>
    );
}
