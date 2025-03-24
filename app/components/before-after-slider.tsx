import React from 'react';
import ReactCompareImage from 'react-compare-image';

const BeforeAfterSlider = () => {
    // Image pairs
    const imagePairs = [
        {
            id: 1,
            before: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/before_2.jpg?v=1742804618",
            after: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/after_2.png?v=1742804619",
            name: "Ana",
            description: "Rezultati po 3 mesecih zdravljenja"
        },
        {
            id: 2,
            before: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/before.png?v=1742804619",
            after: "https://cdn.shopify.com/s/files/1/0924/5894/2788/files/after.jpg?v=1742804619",
            name: "Ana",
            description: "Rezultati po 3 mesecih zdravljenja"
        }
    ];

    return (
        <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-orange-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">

                <header>
                    <h2 className="text-3xl font-bold text-center mb-2">Pred/po</h2>
                    <h3 className="text-2xl text-center mb-8">Njihove zgodbe</h3>

                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {imagePairs.map((pair) => (
                        <div key={pair.id} className="flex flex-col items-center">
                            <div className="w-full h-96 rounded-lg shadow-lg overflow-hidden">
                                <ReactCompareImage
                                    leftImage={pair.before}
                                    rightImage={pair.after}
                                    leftImageLabel="pred"
                                    rightImageLabel="po"
                                    handle={
                                        <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                                            <div className="flex space-x-0.5">
                                                <div className="w-0.5 h-4 bg-gray-400"></div>
                                                <div className="w-0.5 h-4 bg-gray-400"></div>
                                                <div className="w-0.5 h-4 bg-gray-400"></div>
                                            </div>
                                        </div>
                                    }
                                    sliderLineColor="#ffffff"
                                    sliderLineWidth={2}
                                    handleSize={40}
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-gray-600">{pair.description}</p>
                                <p className="text-xl font-semibold mt-1">{pair.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-4">Pred / Po: Resnični Rezultati</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Odkrijte neverjetne preobrazbe naših uporabnikov.
                        Povlecite drsnik, da vidite razliko pred in po zdravljenju.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BeforeAfterSlider;