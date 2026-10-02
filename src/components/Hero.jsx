import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const heroSlides = [
    {
        image: hero1,
        eyebrow: "LIAAN COLLECTIONS",
        title: "Pieces worth keeping.",
        subtitle:
            "Curated thrift fashion for everyday expression.",
    },
    {
        image: hero2,
        eyebrow: "THE NEW EDIT",
        title: "Style, found differently.",
        subtitle:
            "Discover carefully selected pieces with a story to tell.",
    },
    {
        image: hero3,
        eyebrow: "CURATED FOR YOU",
        title: "Wear what feels like you.",
        subtitle:
            "Timeless finds selected for the modern wardrobe.",
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1
                    ? 0
                    : current + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === heroSlides.length - 1
                ? 0
                : current + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0
                ? heroSlides.length - 1
                : current - 1
        );
    };

    const slide = heroSlides[currentSlide];

    return (
        <section className="relative w-full overflow-hidden">

            <div className="relative h-[70vh] min-h-[520px] max-h-[760px]">

                {/* IMAGE */}

                <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover"
                />


                {/* IMAGE OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />


                {/* CONTENT */}

                <div className="relative z-10 flex h-full items-end">

                    <div className="max-w-xl px-6 pb-14 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">

                        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/85 sm:text-[10px]">
                            {slide.eyebrow}
                        </p>

                        <h1 className="mt-3 max-w-md font-serif text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {slide.title}
                        </h1>

                        <p className="mt-4 max-w-sm text-xs leading-6 text-white/85 sm:text-sm">
                            {slide.subtitle}
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex bg-white px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white sm:px-7"
                        >
                            Shop now
                        </Link>

                    </div>
                </div>


                {/* PREVIOUS */}

                <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                    className="absolute left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 sm:left-6"
                >
                    <ChevronLeft
                        size={17}
                        strokeWidth={1.5}
                    />
                </button>


                {/* NEXT */}

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 sm:right-6"
                >
                    <ChevronRight
                        size={17}
                        strokeWidth={1.5}
                    />
                </button>


                {/* INDICATORS */}

                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 sm:left-10">

                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() =>
                                setCurrentSlide(index)
                            }
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-1 transition-all duration-300 ${
                                currentSlide === index
                                    ? "w-8 bg-white"
                                    : "w-3 bg-white/50"
                            }`}
                        />
                    ))}

                </div>


                {/* SLIDE NUMBER */}

                <div className="absolute bottom-6 right-6 z-20 hidden text-[9px] tracking-[0.2em] text-white/75 sm:block">
                    0{currentSlide + 1} / 0{heroSlides.length}
                </div>

            </div>

        </section>
    );
}
