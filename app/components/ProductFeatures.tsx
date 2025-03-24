import React from 'react';
import { Leaf, Ban, CircleSlash, Sparkles, AlarmCheck, HeartHandshake, Check } from 'lucide-react';

export interface ProductFeature {
    name: string;
    icon?: string;
}

interface ProductFeaturesProps {
    features?: { key: string; value: string };
}

function isFeature(item: unknown): item is ProductFeature {
    return (
        typeof item === 'object' &&
        item !== null &&
        'name' in item &&
        typeof (item as ProductFeature).name === 'string'
    );
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
    if (!features?.value) return null;

    let productFeatures: ProductFeature[] = [];
    try {
        const parsedFeatures = JSON.parse(features.value);

        if (Array.isArray(parsedFeatures)) {
            productFeatures = parsedFeatures.filter(isFeature);
        }
    } catch (error) {
        console.error('Error parsing product features metafield', error);
        return null;
    }

    if (productFeatures.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {productFeatures.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
            ))}
        </div>
    );
}

function FeatureItem({ feature }: { feature: ProductFeature }) {
    // Map feature names to appropriate Lucide icons with className support
    const getFeatureIcon = (featureName: string) => {
        const iconProps = {
            className: "w-6 h-6" // Can be extended with "text-primary" or other Tailwind classes
        };

        switch (featureName.toLowerCase()) {
            case 'vegan':
                return <Leaf {...iconProps} />;
            case 'gluten-free':
                return <Ban {...iconProps} />;
            case 'cruelty-free':
                return <HeartHandshake {...iconProps} />;
            case 'no estrogen or added hormones':
                return <CircleSlash {...iconProps} />;
            case 'soy free':
                return <Ban {...iconProps} />;
            case 'dermatologist & allergy tested':
                return <AlarmCheck {...iconProps} />;
            default:
                // Generic feature icon
                return <Check {...iconProps} />;
        }
    };

    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mb-3 text-primary">
                {getFeatureIcon(feature.name)}
            </div>
            <p className="text-sm font-medium text-slate-800">{feature.name}</p>
        </div>
    );
}