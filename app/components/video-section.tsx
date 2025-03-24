import { Link } from '@remix-run/react';
import React from 'react';
import { Button } from '~/components/ui/button';

const VideoSection = () => {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Video Background Section */}
            <div className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center text-center px-4">
                {/* Video Background */}
                <video
                    className="absolute inset-0 object-cover w-full h-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="https://cdn.shopify.com/videos/c/o/v/54b7adb0eb1f4eb2baf20f130a18b243.mp4" type="video/mp4" />
                    Vaš brskalnik ne podpira video oznake.
                </video>

                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Content container */}
                <div className="relative z-10 max-w-3xl mx-auto">
                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-4 tracking-wide">
                        Živite polno. Krepite svojo kožo.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl font-light text-white mb-8">
                        Prehranski dodatki, nega kože in rešitve za zdravje.
                    </p>

                    {/* CTA Button */}
                    <Link to="/collections">
                        <Button
                            className="bg-primary hover:bg-primary/80 text-white px-12 py-6 text-lg uppercase font-medium"
                        >
                            Nakupuj zdaj
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Rotating banner at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-primary py-3">
                <div className="flex animate-marquee whitespace-nowrap">
                    <div className="flex space-x-8 mx-4">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Vegansko</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Odobreno od zdravnikov</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Klinično preizkušeno</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Brez estrogena</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Vegansko</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-white font-medium">Odobreno od zdravnikov</span>
                        </div>
                    </div>
                    {/* Repeated section remains the same */}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default VideoSection;