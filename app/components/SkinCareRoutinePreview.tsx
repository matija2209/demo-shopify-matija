import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Heart, Gem, Palette, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default function SkinCareRoutinePreview() {
    const benefits = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Personalizirana nega",
            text: "Prilagojene rešitve glede na vaše edinstvene potrebe in tip kože"
        },
        {
            icon: <Gem className="w-6 h-6" />,
            title: "Premium izdelki",
            text: "Izbrana kolekcija visokokakovostnih izdelkov za nego kože"
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: "Strokovno vodstvo",
            text: "Profesionalni nasveti in rutine za optimalno zdravje vaše kože"
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500"></div>

            {/* Floating elements */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        zIndex: 0
                    }}
                    initial={{
                        y: i % 2 === 0 ? "20vh" : "-20vh",
                        scale: Math.random() * 0.5 + 0.5,
                        rotate: Math.random() * 360
                    }}
                    animate={{
                        y: i % 2 === 0 ? "-20vh" : "20vh",
                        rotate: Math.random() * 360,
                        transition: {
                            duration: Math.random() * 8 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse",
                            delay: Math.random() * 2
                        }
                    }}
                >
                    <Sparkles className={`w-${i % 3 + 2} h-${i % 3 + 2} text-pink-300/30`} />
                </motion.div>
            ))}

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold tracking-tight mb-2 rotate-[-1deg] transform inline-block pb-1 border-b-4 border-orange-400">
                            Odkrijte vašo popolno lepotno rutino
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-gray-700 font-medium italic mb-4 max-w-2xl mx-auto">
                            Ustvarite personalizirano nego kože, prilagojeno vašim edinstvenim potrebam in ciljem
                        </motion.p>

                        <motion.div variants={itemVariants}>
                            <Link to="/orodje">
                                <Button
                                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <span className="flex items-center gap-2">
                                        Preizkusite orodje za vašo rutino
                                        <span className="text-lg">→</span>
                                    </span>
                                </Button>
                            </Link>
                            <p className="mt-4 text-sm text-gray-500">Samo 2 minuti za popolnoma prilagojeno rutino</p>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                        {benefits.map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex flex-col items-center text-center gap-3">
                                    <span className="text-pink-500 bg-pink-100 p-3 rounded-full">
                                        {item.icon}
                                    </span>
                                    <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center mt-10">
                        <div className="inline-block bg-pink-100/60 backdrop-blur-sm rounded-lg p-4 max-w-xl mx-auto">
                            <p className="text-base text-pink-800 font-medium">
                                "Z našim orodjem za lepotno rutino boste odkrili kako doseči sijočo in zdravo kožo, prilagojeno vašemu tipu kože in vašim potrebam."
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}