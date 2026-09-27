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

    // Automatically move to the next slide every 5 seconds
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
                <div className="relative h-[480px] sm:h-[540px]">

                    {/* Hero image */}
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                    />

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Hero content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-xl px-8 text-white sm:px-12 lg:px-16">

                            <p className="mb-4 text-xs font-medium tracking-[0.3em]">
                                {slide.eyebrow}
                            </p>

                            <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
                                {slide.title}
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-6 text-white/90">
                                {slide.subtitle}
                            </p>

                            <Link
                                to="/products"
                                className="mt-8 inline-flex bg-brand px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>

                    {/* Previous */}
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E3A8A] transition hover:bg-white"
                    >
                        <ChevronLeft
                            size={20}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E3A8A] transition hover:bg-white"
                    >
                        <ChevronRight
                            size={20}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`rounded-full transition-all ${
                                    currentSlide === index
                                        ? "h-1.5 w-7 bg-white"
                                        : "h-1.5 w-1.5 bg-white/60"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
