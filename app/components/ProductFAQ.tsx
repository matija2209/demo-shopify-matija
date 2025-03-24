"use client"

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Info, MessageCircleQuestion } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    order: number;
}

interface ProductFAQProps {
    faqMetafield?: { key: string; value: string };
    title?: string;
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

export function ProductFAQ({ faqMetafield, title = "Pogosta vprašanja" }: ProductFAQProps) {
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

    if (sortedFAQs.length === 0) return null;

    return (
        <div className="w-full max-w-3xl mx-auto my-8 px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircleQuestion className="h-6 w-6 text-purple-700" />
                <h3 className="text-2xl font-bold text-purple-800">{title}</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <Accordion type="single" collapsible className="w-full">
                    {sortedFAQs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className={index === 0 ? "border-t-0" : ""}
                        >
                            <AccordionTrigger className="px-4 sm:px-6 text-left hover:no-underline text-base font-medium text-gray-800 hover:text-purple-700 focus:text-purple-700">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 sm:px-6 text-gray-600 prose-sm">
                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 px-2">
                <Info className="h-4 w-4" />
                <p>Imate dodatna vprašanja? Kontaktirajte našo podporo.</p>
            </div>
        </div>
    );
}