import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Image } from '@shopify/hydrogen';

const ReelsGallery = () => {
    const [activeReel, setActiveReel] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Updated data with real videos and thumbnails
    const reelsData = [

        {
            id: 1,
            username: "Sophie",
            thumbnail: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/story_1.jpg",
            videoUrl: "https://cdn.shopify.com/videos/c/o/v/d4a5b9e500df4d8085455416c36f4f17.mp4",
            caption: "Je me présente.",
            likes: 587,
            comments: 61
        },
        {
            id: 2,
            username: "Marie",
            thumbnail: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/story_2.jpg",
            videoUrl: "https://cdn.shopify.com/videos/c/o/v/d6e39bd72d124b788f17d5a417012011.mp4",
            caption: "Alors donc ça fait un mois",
            likes: 412,
            comments: 37
        },
        {
            id: 3,
            username: "Claire",
            thumbnail: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/story_3.jpg",
            videoUrl: "https://cdn.shopify.com/videos/c/o/v/5390c0d77e5a4427854aa04ab61a8618.mp4",
            caption: "Je découvre la routine Double Nettoyage",
            likes: 729,
            comments: 53
        },

    ];

    useEffect(() => {
        if (activeReel !== null && videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(error => {
                    console.error("Video playback failed:", error);
                    // Handle autoplay policy restrictions
                    setIsMuted(true);
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.play().catch(e => console.error("Still can't play:", e));
                    }
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, activeReel]);

    useEffect(() => {
        if (activeReel !== null && videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, activeReel]);

    const openReel = (id: number) => {
        setActiveReel(id);
        setIsPlaying(true);
    };

    const closeReel = () => {
        setActiveReel(null);
        setIsPlaying(false);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const navigateReel = (direction: 'next' | 'prev') => {
        const currentIndex = reelsData.findIndex(reel => reel.id === activeReel);
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % reelsData.length
            : (currentIndex - 1 + reelsData.length) % reelsData.length;

        setActiveReel(reelsData[newIndex].id);
        setIsPlaying(true);
    };

    const activeReelData = activeReel ? reelsData.find(reel => reel.id === activeReel) : null;

    return (
        <div className="w-full font-sans px-4 py-16">
            {/* Reels Gallery */}
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-6">Zgodbe naših uporabnikov</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {reelsData.map((reel) => (
                        <div
                            key={reel.id}
                            className="relative rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => openReel(reel.id)}
                        >

                            <div className="relative pb-4 bg-gray-100 rounded-lg overflow-hidden">
                                <div className="relative pb-[177%]">
                                    <Image
                                        src={reel.thumbnail}
                                        alt={`${reel.username}'s reel`}
                                        className="absolute z-40 inset-0 w-full h-full object-cover"
                                        width={300}
                                        height={530}
                                    />
                                    <div className="absolute z-50 inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="rounded-full bg-white bg-opacity-70 p-2">
                                            <Play className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                                    <p className="text-white text-sm font-medium truncate">{reel.caption}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Screen Reel Viewer */}
            {activeReel && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <video
                            ref={videoRef}
                            src={activeReelData!.videoUrl}
                            className="max-h-full max-w-full"
                            loop
                            playsInline
                            onClick={togglePlay}
                        />

                        {/* Controls overlay */}
                        <div className="absolute inset-0 flex flex-col">
                            {/* Top bar */}
                            <div className="p-4 flex justify-between items-center">
                                <button
                                    onClick={closeReel}
                                    className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={toggleMute}
                                    className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                                >
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                            </div>

                            {/* Center play/pause button */}
                            {!isPlaying && (
                                <div className="flex-grow flex items-center justify-center">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all"
                                    >
                                        <Play className="w-12 h-12" />
                                    </button>
                                </div>
                            )}

                            {/* User info and caption */}
                            <div className="p-4 bg-gradient-to-t ">
                                <h3 className="text-white text-lg font-bold">{activeReelData!.username}</h3>
                                <p className="text-white text-sm mt-1">{activeReelData!.caption}</p>
                                <div className="flex items-center mt-2 text-white text-sm">
                                    <span className="mr-4">{activeReelData!.likes} likes</span>
                                    <span>{activeReelData!.comments} comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={() => navigateReel('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={() => navigateReel('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReelsGallery;