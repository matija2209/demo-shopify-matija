import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Button } from '~/components/ui/button';
import type { Testimonial } from '~/types/testimonial';
import { ReviewSnapshot } from '~/components/ReviewSnapshot';

interface TestimonialsProps {
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

export function Testimonials({ testimonials }: TestimonialsProps) {
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedTestimonials, setExpandedTestimonials] = useState<number[]>([]);

    const TESTIMONIALS_PER_PAGE = 6;
    const TEXT_LIMIT = 200;

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

    // Sort testimonials by date (newest first)
    const sortedTestimonials = [...allTestimonials].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Filter testimonials by rating if filterRating is set
    const filteredTestimonials = filterRating
        ? sortedTestimonials.filter(t => t.rating === filterRating)
        : sortedTestimonials;

    if (sortedTestimonials.length === 0) return null;

    const handleFilterByRating = (rating: number) => {
        setFilterRating(prev => prev === rating ? null : rating);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredTestimonials.length / TESTIMONIALS_PER_PAGE);
    const startIndex = (currentPage - 1) * TESTIMONIALS_PER_PAGE;
    const paginatedTestimonials = filteredTestimonials.slice(
        startIndex,
        startIndex + TESTIMONIALS_PER_PAGE
    );

    // Toggle expanded state for a testimonial
    const toggleExpand = (index: number) => {
        setExpandedTestimonials(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="space-y-12">
            {/* Review Snapshot Component */}
            <ReviewSnapshot testimonials={testimonials} filterByRating={handleFilterByRating} />
            <div>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        {filterRating ? `Ocene z ${filterRating} zvezdicami` : "Kaj pravijo naši stranki"}
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {filterRating
                            ? `Prikazane so samo ocene z ${filterRating} zvezdicami. Najdenih ${filteredTestimonials.length} ocen.`
                            : 'Resnične ocene od resničnih strank. Ponosni smo, da smo pomagali toliko ljudem najti izdelke, ki jih imajo radi.'
                        }
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mt-4"></div>
                </div>

                {filterRating && (
                    <div className="mb-6 text-center">
                        <button
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
                            onClick={() => setFilterRating(null)}
                        >
                            Počisti filter
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedTestimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            testimonial={testimonial}
                            isExpanded={expandedTestimonials.includes(startIndex + index)}
                            onToggleExpand={() => toggleExpand(startIndex + index)}
                            textLimit={TEXT_LIMIT}
                        />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="h-9 w-9 p-0"
                        >
                            <span className="sr-only">Prejšnja stran</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>

                        {Array.from({ length: totalPages }).map((_, index) => (
                            <Button
                                key={index}
                                variant={currentPage === index + 1 ? "default" : "outline"}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`h-9 w-9 p-0 ${currentPage === index + 1 ? 'bg-purple-800 hover:bg-purple-700' : ''}`}
                            >
                                {index + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="h-9 w-9 p-0"
                        >
                            <span className="sr-only">Naslednja stran</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    isExpanded: boolean;
    onToggleExpand: () => void;
    textLimit: number;
}

function TestimonialCard({ testimonial, isExpanded, onToggleExpand, textLimit }: TestimonialCardProps) {
    const content = testimonial.content;
    const isContentLong = content.length > textLimit;
    const displayContent = isExpanded || !isContentLong
        ? content
        : content.substring(0, textLimit) + '...';

    return (
        <Card className="h-full flex flex-col border-2 border-purple-200 hover:border-purple-400 transition-colors rounded-xl overflow-hidden shadow-md hover:shadow-lg">
            <CardHeader className="bg-purple-50 pb-0">
                <div className="flex items-center mb-2">
                    {/* Star Rating */}
                    <div className="flex">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <svg
                                key={i}
                                className="w-5 h-5 text-yellow-500 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                        ))}
                    </div>

                    {/* Verified Badge if it's featured */}
                    {testimonial.isFeatured && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Preverjen nakup
                        </span>
                    )}
                </div>

                {/* Testimonial Title */}
                {testimonial.title && (
                    <h3 className="text-xl font-semibold text-purple-800">{testimonial.title}</h3>
                )}
            </CardHeader>

            <CardContent className="flex-grow py-4">
                {/* Testimonial Content */}
                <p className="text-slate-700">
                    {displayContent}
                </p>
                {isContentLong && (
                    <button
                        onClick={onToggleExpand}
                        className="text-purple-700 hover:text-purple-900 font-medium text-sm mt-2 focus:outline-none"
                    >
                        {isExpanded ? 'Prikaži manj' : 'Preberi več'}
                    </button>
                )}
            </CardContent>

            <CardFooter className="bg-purple-50 pt-2 flex items-center">
                {/* Customer Image if available */}
                {testimonial.imageUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <img
                            src={testimonial.imageUrl}
                            alt={testimonial.name || 'Stranka'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center mr-2">
                        <span className="text-purple-700 font-semibold text-sm">
                            {testimonial.name?.charAt(0) || '?'}
                        </span>
                    </div>
                )}

                {/* Customer Name */}
                <div>
                    <p className="font-medium text-sm text-purple-800">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">
                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
} 