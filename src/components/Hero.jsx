import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const heroSlides = [
    {
        image: hero1,
        eyebrow: "NEW COLLECTION",
        title: "Elevate Your Style",
        subtitle:
            "Discover carefully selected pieces designed for the modern wardrobe.",
    },
    {
        image: hero2,
        eyebrow: "CURATED FOR YOU",
        title: "Effortless Elegance",
        subtitle:
            "Timeless pieces that bring simplicity and confidence to every look.",
    },
    {
        image: hero3,
        eyebrow: "LIAAN COLLECTIONS",
        title: "Simply Exceptional",
        subtitle:
            "Discover pieces you'll want to wear again and again.",
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1 ? 0 : current + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === heroSlides.length - 1 ? 0 : current + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0 ? heroSlides.length - 1 : current - 1
        );
    };

    const slide = heroSlides[currentSlide];

    return (
        <section className="bg-page">
            <div className="relative mx-auto max-w-7xl overflow-hidden">
                <div className="relative h-[390px] sm:h-[450px] lg:h-[520px]">

                    {/* HERO IMAGE */}
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

                    {/* CONTENT */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-xl px-6 sm:px-10 lg:px-14">

                            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.28em] text-white/90 sm:mb-4 sm:text-[10px]">
                                {slide.eyebrow}
                            </p>

                            <h1 className="max-w-[280px] font-serif text-4xl leading-[1.05] text-white sm:max-w-md sm:text-5xl lg:text-6xl">
                                {slide.title}
                            </h1>

                            <p className="mt-4 max-w-[280px] text-xs leading-5 text-white/85 sm:mt-5 sm:max-w-md sm:text-sm sm:leading-6">
                                {slide.subtitle}
                            </p>

                            <Link
                                to="/collections"
                                className="mt-6 inline-flex bg-white px-6 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-900 transition-colors duration-300 hover:bg-neutral-900 hover:text-white sm:mt-7 sm:px-7 sm:py-3.5 sm:text-xs"
                            >
                                Shop Collection
                            </Link>
                        </div>
                    </div>

                    {/* PREVIOUS */}
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 sm:left-5 sm:h-10 sm:w-10"
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
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 sm:right-5 sm:h-10 sm:w-10"
                    >
                        <ChevronRight
                            size={17}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* INDICATORS */}
                    <div className="absolute bottom-5 left-6 flex items-center gap-1.5 sm:bottom-6 sm:left-10">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
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
                    <div className="absolute bottom-5 right-6 hidden text-[9px] tracking-[0.2em] text-white/80 sm:block">
                        0{currentSlide + 1} / 0{heroSlides.length}
                    </div>
                </div>
            </div>
        </section>
    );
}