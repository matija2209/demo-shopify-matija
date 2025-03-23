import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

interface FAQItem {
    question: string;
    answer: string;
    order: number;
}

interface ProductFAQProps {
    faqMetafield?: { key: string; value: string };
}

function isFAQItem(item: unknown): item is FAQItem {
    return (
        typeof item === 'object' &&
        item !== null &&
        'question' in item &&
        'answer' in item &&
        'order' in item &&
        typeof (item as FAQItem).question === 'string' &&
        typeof (item as FAQItem).answer === 'string' &&
        typeof (item as FAQItem).order === 'number'
    );
}

export function ProductFAQ({ faqMetafield }: ProductFAQProps) {
    if (!faqMetafield?.value) return null;

    let faqs: FAQItem[] = [];
    try {
        const parsedFAQs = JSON.parse(faqMetafield.value);

        if (Array.isArray(parsedFAQs)) {
            faqs = parsedFAQs.filter(isFAQItem);
        }
    } catch (error) {
        console.error('Error parsing FAQ metafield', error);
        return null;
    }

    // Sort FAQs by order
    const sortedFAQs = faqs.sort((a, b) => a.order - b.order);

    return (
        <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-xl font-bold mb-4 text-purple-800">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
                {sortedFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
} 