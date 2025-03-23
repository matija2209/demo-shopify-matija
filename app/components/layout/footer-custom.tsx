import { Link, NavLink } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

import Logo from '@/assets/logo.png';

interface FooterCustomProps {
    footer: FooterQuery | null;
    header?: HeaderQuery;
    publicStoreDomain: string;
}

export function FooterCustom({
    footer,
    header,
    publicStoreDomain,
}: FooterCustomProps) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Updated business contact information
        setPhone('068 179 728');
        setEmail('matija@obrtniknaspletu.si');
    }, []);

    // Helper function to safely check URLs
    const isInternalUrl = (url: string): boolean => {
        if (!url) return false;

        const primaryDomainUrl = header?.shop?.primaryDomain?.url;

        return !!(
            url.includes('myshopify.com') ||
            url.includes(publicStoreDomain) ||
            (primaryDomainUrl && url.includes(primaryDomainUrl))
        );
    };

    return (
        <footer className="bg-gray-900 py-12 px-4 md:px-6 relative overflow-hidden">
            {/* Decorative gradient strip at top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500"></div>

            {/* Decorative blur circles */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-purple-500/20 blur-xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-teal-400/20 blur-xl"></div>

            <div className="mx-auto relative text-secondary">


                {/* Business Data + Navigation Section */}
                <div className="border-t border-transparent bg-gradient-to-r from-teal-400/20 via-purple-500/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Business Info Column */}
                        <div className="md:col-span-2">
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Podatki o podjetju</h3>
                            <div className="space-y-2 text-sm">
                                <p>Matija Žiberna, Računalniško svetovanje, s.p.</p>
                                <p>Davčna številka SI: 97182052</p>
                                <p>Matična številka: 8460485000</p>
                                <p>Datum vpisa: 2019</p>
                            </div>

                            <h3 className="font-bold text-white mt-6 mb-3 border-b-4 border-purple-500 pb-1 inline-block rotate-[-1deg]">Kontakt</h3>
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {phone}
                                </p>
                                <p className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {email}
                                </p>
                                <p className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Slovenija
                                </p>
                            </div>
                        </div>

                        {/* Legal Links Column */}
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Pravno</h3>
                            <ul className="space-y-2">
                                {(footer?.menu?.items || []).map((item) => {
                                    if (!item.url) return null;
                                    // Use safer URL handling with helper function
                                    const url = isInternalUrl(item.url)
                                        ? new URL(item.url).pathname
                                        : item.url;

                                    const isExternal = !url.startsWith('/');

                                    return (
                                        <li key={item.id}>
                                            {isExternal ? (
                                                <a
                                                    href={url}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block"
                                                >
                                                    {item.title}
                                                </a>
                                            ) : (
                                                <NavLink
                                                    end
                                                    prefetch="intent"
                                                    style={activeLinkStyle}
                                                    to={url}
                                                    className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block"
                                                >
                                                    {item.title}
                                                </NavLink>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Collections Column */}
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Kolekcije</h3>
                            <ul className="space-y-2">
                                {(header?.menu?.items || []).map((item) => {
                                    if (!item.url) return null;

                                    // Use safer URL handling with helper function
                                    const url = isInternalUrl(item.url)
                                        ? new URL(item.url).pathname
                                        : item.url;

                                    const isExternal = !url.startsWith('/');

                                    return (
                                        <li key={item.id}>
                                            {isExternal ? (
                                                <a
                                                    href={url}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block"
                                                >
                                                    {item.title}
                                                </a>
                                            ) : (
                                                <NavLink
                                                    end
                                                    prefetch="intent"
                                                    style={activeLinkStyle}
                                                    to={url}
                                                    className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block"
                                                >
                                                    {item.title}
                                                </NavLink>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 text-sm text-gray-400 bg-black/30 p-4 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm">
                        <p className="italic">
                            © {new Date().getFullYear()} ObrtnikNaSpletu. Vse pravice pridržane. Razvijamo uspešne spletne zgodbe.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Replace the fallback menu with your specific menu ID
const FOOTER_MENU = {
    id: 'gid://shopify/Menu/290819113284',
    items: [
        {
            id: 'gid://shopify/MenuItem/461633060920',
            resourceId: 'gid://shopify/ShopPolicy/23358046264',
            tags: [],
            title: 'Politika zasebnosti',
            type: 'SHOP_POLICY',
            url: '/policies/privacy-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633093688',
            resourceId: 'gid://shopify/ShopPolicy/23358013496',
            tags: [],
            title: 'Politika vračil',
            type: 'SHOP_POLICY',
            url: '/policies/refund-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633126456',
            resourceId: 'gid://shopify/ShopPolicy/23358111800',
            tags: [],
            title: 'Politika dostave',
            type: 'SHOP_POLICY',
            url: '/policies/shipping-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633159224',
            resourceId: 'gid://shopify/ShopPolicy/23358079032',
            tags: [],
            title: 'Pogoji poslovanja',
            type: 'SHOP_POLICY',
            url: '/policies/terms-of-service',
            items: [],
        },
    ],
};

// Reuse the activeLinkStyle from Footer.tsx
function activeLinkStyle({
    isActive,
    isPending,
}: {
    isActive: boolean;
    isPending: boolean;
}) {
    return {
        fontWeight: isActive ? 'bold' : undefined,
        color: isPending ? 'grey' : 'white',
    };
}