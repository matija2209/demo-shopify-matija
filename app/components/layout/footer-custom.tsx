import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';

import Logo from '@/assets/logo.png';
export function FooterCustom() {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Dummy data for phone and email
        setPhone('555 123 4567');
        setEmail('hello@mocktailvibes.com');
    }, []);

    return (
        <footer className="bg-gray-900 py-12 px-4 md:px-6 relative overflow-hidden">
            {/* Decorative gradient strip at top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500"></div>

            {/* Decorative blur circles */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-purple-500/20 blur-xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-teal-400/20 blur-xl"></div>

            <div className="max-w-4xl mx-auto relative text-secondary">
                {/* Logo and Company Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo */}
                    <div className="flex flex-col items-start">
                        <div className="border-2 border-purple-500 rounded-xl p-4 bg-black shadow-lg transform hover:scale-105 transition-all duration-300">
                            <Image src={Logo} alt="Logo" width={200} height={40} className="mb-2" />
                            <p className="text-sm text-gradient bg-gradient-to-r from-teal-400 to-purple-500 italic">
                                Živahne barve, brez alkohola, polno zabave
                            </p>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="space-y-3 text-sm">
                        <h3 className="font-bold text-white mb-4 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg] text-lg">Naša energija</h3>
                        <p className="text-gray-300 bg-black/40 p-3 rounded-xl border-l-2 border-purple-500 transform hover:-translate-y-1 transition-all duration-300">
                            Blagovna znamka Oblačil
                        </p>
                        <p className="text-gray-300 bg-black/40 p-3 rounded-xl border-l-2 border-teal-400 transform hover:-translate-y-1 transition-all duration-300">
                            Ustanovljeno 2023
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 text-sm">
                        <h3 className="font-bold text-white mb-4 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg] text-lg">Kontaktiraj nas</h3>
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="block hover:text-white bg-black/40 p-3 rounded-xl border-l-2 border-purple-500 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                            >
                                {phone}
                            </a>
                        )}
                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="block hover:text-white bg-black/40 p-3 rounded-xl border-l-2 border-teal-400 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-400/30 transition-all duration-300"
                            >
                                {email}
                            </a>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-8 border-t border-transparent bg-gradient-to-r from-teal-400/20 via-purple-500/20 to-orange-500/20 backdrop-blur-sm">
                    <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Raziskuj</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/#funkcionalnosti" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Lastnosti
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/#cenik" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Cenik
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/#o-nas" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        O nas
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Pravno</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/zasebnost" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Zasebnost
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pogoji-uporabe" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Pogoji
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Podpora</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/kontakt" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Kontakt
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-3 border-b-4 border-orange-500 pb-1 inline-block rotate-[-1deg]">Socialna omrežja</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors transform hover:-translate-y-1 hover:text-gradient hover:bg-gradient-to-r hover:from-teal-400 hover:to-purple-500 block">
                                        TikTok
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Copyright */}
                    <div className="mt-8 text-sm text-gray-400 bg-black/30 p-4 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm">
                        <p className="italic">
                            © {new Date().getFullYear()} Oblačila Vibes. Vse pravice pridržane. Ostani živahen.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}