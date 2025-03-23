import React from 'react';
import type { Testimonial } from '~/types/testimonial';

interface ReviewSnapshotProps {
    testimonials?: { key: string; value: string };
    filterByRating?: (rating: number) => void;
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

export function ReviewSnapshot({ testimonials, filterByRating }: ReviewSnapshotProps) {
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

    if (allTestimonials.length === 0) return null;

    // Calculate rating statistics
    const totalReviews = allTestimonials.length;
    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    let totalRatingSum = 0;

    allTestimonials.forEach(testimonial => {
        const rating = testimonial.rating || 5;
        totalRatingSum += rating;
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating as keyof typeof ratingCounts]++;
        }
    });

    const averageRating = totalRatingSum / totalReviews;
    const roundedAverage = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

    return (
        <div className="my-12 max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-light mb-6 tracking-wide">Pregled ocen</h2>
            <div className="border-t border-b py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Average Rating */}
                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-medium">{roundedAverage.toFixed(1)}</span>
                        <div>
                            <div className="flex mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-8 h-8 cursor-pointer hover:scale-110 transition-transform ${i < Math.floor(averageRating)
                                            ? 'text-purple-900 fill-current'
                                            : i < averageRating
                                                ? 'text-purple-900/50 fill-current'
                                                : 'text-gray-300 fill-current'
                                            }`}
                                        viewBox="0 0 24 24"
                                        onClick={() => filterByRating && filterByRating(5 - i)}
                                    >
                                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600">{totalReviews} Ocen</p>
                        </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-grow w-full md:w-auto">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingCounts[star as keyof typeof ratingCounts];
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                            return (
                                <div
                                    key={star}
                                    className="flex items-center my-2 group cursor-pointer"
                                    onClick={() => filterByRating && filterByRating(star)}
                                >
                                    <div className="w-24 text-right mr-4 group-hover:text-purple-800 transition-colors">
                                        <span>{star} {star === 1 ? 'Zvezdica' : 'Zvezdic'}</span>
                                    </div>
                                    <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden group-hover:ring-2 group-hover:ring-purple-400 transition-all">
                                        <div
                                            className={`h-full ${star === 5 || star === 4 ? 'bg-purple-800' : 'bg-gray-300'} group-hover:bg-purple-600 transition-colors`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-12 text-right ml-4 group-hover:text-purple-800 transition-colors">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
} 