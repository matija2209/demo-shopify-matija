import React, { useState } from 'react';
import {
    Dialog,
    DialogContent
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { ZoomIn, X } from 'lucide-react';
import { Image } from '@shopify/hydrogen';

interface ProductImage {
    altText?: string | null;
    id: string;
    url: string;
    width: number;
    height: number;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
    selectedVariantImage?: ProductImage;
}

export function ProductImageGallery({
    images,
    selectedVariantImage
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(
        selectedVariantImage || images[0]
    );
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Ensure unique images by URL
    const uniqueImages = Array.from(
        new Map(images.map(img => [img.url, img])).values()
    );

    return (
        <div className="relative group">
            {/* Main Image with Fixed Height Container */}
            <div className="relative h-[500px] overflow-hidden rounded-xl">
                <Image
                    src={selectedImage.url}
                    alt={selectedImage.altText || 'Product Image'}
                    className="w-full h-full object-contain"
                />

                {/* Zoom Button */}
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 z-10"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <ZoomIn className="h-5 w-5 text-purple-600" />
                </Button>
            </div>

            {/* Image Preview Gallery - Fixed Height */}
            <div className="mt-4 grid grid-cols-4 gap-2">
                {uniqueImages.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "h-24 border-2 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500",
                            selectedImage.url === img.url
                                ? "border-purple-500 scale-105"
                                : "border-gray-300 opacity-70 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={img.url}
                            alt={img.altText || 'Product Thumbnail'}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Improved Lightbox Dialog */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent
                    className="max-w-none max-h-none p-0 border-none bg-transparent"
                >
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 z-10 text-white"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="h-8 w-8" />
                        </Button>

                        <div className="w-[90vw] h-[90vh] flex items-center justify-center">
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.altText || 'Product Image'}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}