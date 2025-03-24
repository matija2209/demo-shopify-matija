import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Testimonial } from '~/types/testimonial';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface FeaturedTestimonialsProps {
    testimonials?: { key: string; value: string };
}

function isTestimonial(item: unknown): item is Testimonial {
    return (
        typeof item === 'object' &&
        item !== null &&
        'name' in item &&
        'content' in item &&
        'createdAt' in item
    );
}

export function FeaturedTestimonials({ testimonials }: FeaturedTestimonialsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    if (!testimonials?.value) return null;

    let allTestimonials: Testimonial[] = [];
    try {
        const parsedTestimonials = JSON.parse(testimonials.value);

        if (Array.isArray(parsedTestimonials)) {
            allTestimonials = parsedTestimonials.filter(isTestimonial);
        }
    } catch (error) {
        console.error('Error parsing testimonials metafield', error);
        return null;
    }

    // Filter only featured testimonials or if none are marked, take up to 3
    const featuredTestimonials = allTestimonials.filter(t => t.isFeatured === true);
    const testimonialsToShow = featuredTestimonials.length > 0
        ? featuredTestimonials
        : allTestimonials.slice(0, 3);

    if (testimonialsToShow.length === 0) return null;

    const handlePrev = () => {
        setActiveIndex((prev) =>
            prev === 0 ? testimonialsToShow.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === testimonialsToShow.length - 1 ? 0 : prev + 1
        );
    };

    const activeTestimonial = testimonialsToShow[activeIndex];

    return (
        <div
            ref={sectionRef}
            className={`transition-all duration-1000 ${isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold uppercase tracking-wide transition-all delay-300 duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}>
                    REAL REVIEWS
                </h2>
            </div>

            <div className="max-w-4xl mx-auto relative">
                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-red-500 transition-all ${isInView ? 'opacity-100 delay-500' : 'opacity-0'
                        }`}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={40} />
                </button>

                <button
                    onClick={handleNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-red-500 transition-all ${isInView ? 'opacity-100 delay-500' : 'opacity-0'
                        }`}
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={40} />
                </button>

                {/* Testimonial Card */}
                <div className="px-12">
                    <div className={`text-center transition-all duration-700 delay-300 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}>
                        {/* Stars */}
                        <div className="flex justify-center mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={28}
                                    fill="#e53e3e"
                                    color="#e53e3e"
                                    className={`transition-all ${isInView ? 'animate-bounce' : ''
                                        }`}
                                    style={{
                                        animationDelay: `${i * 100}ms`,
                                        animationDuration: '1s',
                                        animationIterationCount: 1
                                    }}
                                />
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-4xl font-serif text-red-500 mb-6">
                            {activeTestimonial.title || "Sleep like a baby"}
                        </h3>

                        {/* Content */}
                        <p className="text-2xl text-red-500 font-serif mb-4">
                            {activeTestimonial.content}
                        </p>

                        {/* Author */}
                        <p className="text-red-500 font-serif text-xl">
                            -{activeTestimonial.name}
                        </p>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className={`flex justify-center mt-8 gap-2 transition-all duration-700 delay-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}>
                    {testimonialsToShow.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-red-500' : 'bg-red-300'
                                }`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeaturedTestimonials;