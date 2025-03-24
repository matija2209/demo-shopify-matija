import { FlaskConical, Brush, Moon, Apple, Circle, Clock, X, Palette } from 'lucide-react';

import { cn } from '~/lib/utils';
import { motion } from 'framer-motion';
import {
  Droplets,
  Sparkles,
  Shield,

  Waves,
  Heart,
  Leaf,
  AlertCircle,
  XCircle,
  Ban,
  AlertTriangle,
  ShieldOff,
  XOctagon,
  Wind,

} from "lucide-react";


// Add these SVG components at the top level
const WaveSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.path
      d="M0 60 Q 25 40, 50 60 T 100 60 V100 H0 Z"
      fill="currentColor"
      initial={{ d: "M0 60 Q 25 40, 50 60 T 100 60 V100 H0 Z" }}
      animate={{
        d: [
          "M0 60 Q 25 40, 50 60 T 100 60 V100 H0 Z",
          "M0 60 Q 25 50, 50 40 T 100 60 V100 H0 Z",
          "M0 60 Q 25 40, 50 60 T 100 60 V100 H0 Z"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

const SunSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.circle
      cx="50"
      cy="50"
      r="20"
      fill="currentColor"
      animate={{ r: [18, 22, 18] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.g
      stroke="currentColor"
      strokeWidth="3"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      style={{ originX: "50px", originY: "50px" }}
    >
      <line x1="50" y1="10" x2="50" y2="30" />
      <line x1="50" y1="70" x2="50" y2="90" />
      <line x1="10" y1="50" x2="30" y2="50" />
      <line x1="70" y1="50" x2="90" y2="50" />
    </motion.g>
  </svg>
);

const FlameSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.path
      fill="currentColor"
      initial={{ d: "M50 90 Q30 70, 40 50 Q35 30, 50 10 Q65 30, 60 50 Q70 70, 50 90 Z" }}
      animate={{
        d: [
          "M50 90 Q30 70, 40 50 Q35 30, 50 10 Q65 30, 60 50 Q70 70, 50 90 Z",
          "M50 92 Q32 72, 42 52 Q36 28, 50 8 Q64 28, 58 52 Q68 72, 50 92 Z",
          "M50 90 Q30 70, 40 50 Q35 30, 50 10 Q65 30, 60 50 Q70 70, 50 90 Z"
        ]
      }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </svg>
);

// Add these SVG components after the existing ones

const RareSunSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.circle
      cx="30"
      cy="30"
      r="15"
      fill="#F5C86D"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.g
      initial={{ x: -10 }}
      animate={{ x: 10 }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
    >
      <ellipse cx="50" cy="50" rx="25" ry="15" fill="currentColor" />
      <ellipse cx="65" cy="55" rx="20" ry="12" fill="currentColor" />
    </motion.g>
  </svg>
);

const ModerateSunSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.circle
      cx="50"
      cy="35"
      r="18"
      fill="#FFC93C"
      animate={{ r: [17, 20, 17] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.ellipse
      cx="60"
      cy="55"
      rx="22"
      ry="14"
      fill="currentColor"
      animate={{ x: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </svg>
);

const FrequentSunSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <motion.circle
      cx="50"
      cy="50"
      r="20"
      fill="#FFB400"
      animate={{ r: [18, 22, 18] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.g
      stroke="#FFB400"
      strokeWidth="3"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      style={{ originX: "50px", originY: "50px" }}
    >
      <line x1="50" y1="10" x2="50" y2="25" />
      <line x1="50" y1="75" x2="50" y2="90" />
      <line x1="10" y1="50" x2="25" y2="50" />
      <line x1="75" y1="50" x2="90" y2="50" />
    </motion.g>
  </svg>
);


// Add this component for the animated particles
const SunParticles = ({ type }: { type: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-1 h-1 rounded-full",
            type === "sun" && "bg-yellow-200/30",
            type === "rain" && "bg-blue-200/30",
            type === "clouds" && "bg-gray-200/30"
          )}
          initial={{
            x: Math.random() * 100 + "%",
            y: -10,
            opacity: 0
          }}
          animate={{
            y: "110%",
            opacity: type === "clouds" ? [0, 1, 0] : 1
          }}
          transition={{
            duration: type === "sun" ? 2 : type === "clouds" ? 4 : 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: type === "clouds" ? "easeInOut" : "linear"
          }}
          style={{
            scale: type === "clouds" ? 1 + Math.random() * 2 : 1
          }}
        />
      ))}
    </div>
  );
};


const sunExposureOptions = [
  {
    value: 'RARE',
    label: 'Redka Izpostavljenost Soncu',
    description: 'Minimalen čas preživet zunaj',
    icon: <RareSunSVG />,
    effects: ["Nižji nivo vitamina D", "Manj poškodb sonca", "Minimalno porjavenje"],
    recommendations: ["Vitaminski D dodatki", "Nežna UV zaščita"],
    theme: {
      background: "from-sky-900 to-sky-950",
      color: "text-sky-400",
      glow: "shadow-[0_0_30px_#38bdf8]",
      particles: "rain"
    }
  },
  {
    value: 'MODERATE',
    label: 'Zmerna Izpostavljenost Soncu',
    description: 'Občasne aktivnosti na prostem',
    icon: <ModerateSunSVG />,
    effects: ["Uravnotežen vitamin D", "Nekaj UV izpostavljenosti", "Naraven sijaj"],
    recommendations: ["Dnevna zaščita pred soncem", "Antioksidanti"],
    theme: {
      background: "from-amber-800 to-amber-950",
      color: "text-amber-400",
      glow: "shadow-[0_0_40px_#fbbf24]",
      particles: "clouds"
    }
  },
  {
    value: 'FREQUENT',
    label: 'Pogosta Izpostavljenost Soncu',
    description: 'Redno preživljanje časa na direktni sončni svetlobi',
    icon: <FrequentSunSVG />,
    effects: ["Visoka UV izpostavljenost", "Pospešeno staranje", "Povečana pigmentacija"],
    recommendations: ["Visoka zaščita pred soncem", "Dodatna hidratacija"],
    theme: {
      background: "from-orange-700 to-orange-950",
      color: "text-orange-400",
      glow: "shadow-[0_0_50px_#f97316]",
      particles: "sun"
    }
  }
];

const stressLevelOptions = [
  {
    value: 'LOW',
    label: 'Nizek Stres',
    description: 'Običajno sproščen, dobro obvladuje pritisk',
    icon: <WaveSVG />,
    effects: ["Uravnotežena koža", "Naravna svetloba", "Enakomerna polt"],
    recommendations: ["Ohranjanje rutine", "Nežna nega"],
    theme: {
      background: "from-teal-900 to-teal-950",
      color: "text-teal-400",
      glow: "shadow-[0_0_30px_#2dd4bf]"
    }
  },
  {
    value: 'MEDIUM',
    label: 'Srednji Stres',
    description: 'Občasen stres iz dela/življenja',
    icon: <SunSVG />,
    effects: ["Blaga občutljivost", "Občasni izpuščaji", "Otožna polt"],
    recommendations: ["Pomirjajoči izdelki", "Sproščanje stresa"],
    theme: {
      background: "from-amber-900 to-amber-950",
      color: "text-amber-400",
      glow: "shadow-[0_0_30px_#fbbf24]"
    }
  },
  {
    value: 'HIGH',
    label: 'Visok Stres',
    description: 'Pogosto občutek preobremenjenosti',
    icon: <FlameSVG />,
    effects: ["Vnetje", "Pogosti izpuščaji", "Neenakomerna tekstura"],
    recommendations: ["Intenzivna nega", "Popravilo kožne pregrade"],
    theme: {
      background: "from-red-900 to-red-950",
      color: "text-red-400",
      glow: "shadow-[0_0_30px_#ef4444]"
    }
  }
];

const sleepPatternOptions = [
  {
    value: 'LESS_THAN_6_HRS',
    label: 'Lahek Spanje',
    description: 'Manj kot 6 ur na noč',
    icon: <Moon className="w-6 h-6" />,
    effects: ["Povečane temne kolobarje", "Počasnejša obnova kože", "Znaki stresa"],
    recommendations: ["Nočna nega", "Zmanjšanje otekline"],
    theme: {
      background: "from-purple-900 to-purple-950",
      moonColor: "from-[#E6E6FA] to-[#D8BFD8]",
      moonGlow: "shadow-[0_0_30px_#9370DB]",
      starCount: 10
    }
  },
  {
    value: '6_TO_8_HRS',
    label: 'Povprečen Spanje',
    description: '6-8 ur na noč',
    icon: <Moon className="w-6 h-6 text-yellow-500" />,
    effects: ["Normalen cikel kože", "Povprečna obnova", "Uravnotežen počitek"],
    recommendations: ["Vzdrževanje", "Nežna nega"],
    theme: {
      background: "from-blue-900 to-blue-950",
      moonColor: "from-[#F8F8FF] to-[#E6E6FA]",
      moonGlow: "shadow-[0_0_40px_#6495ED]",
      starCount: 20
    }
  },
  {
    value: 'MORE_THAN_8_HRS',
    label: 'Globok Spanje',
    description: 'Več kot 8 ur na noč',
    icon: <Moon className="w-6 h-6 text-primary" />,
    effects: ["Optimalna obnova kože", "Naravna regeneracija", "Obnova po stresu"],
    recommendations: ["Globoka hidratacija", "Pospešitev obnove"],
    theme: {
      background: "from-[#0f1729] to-[#1a2b4d]",
      moonColor: "from-[#ECF6FF] to-[#D1E5FF]",
      moonGlow: "shadow-[0_0_50px_#4A6CF7]",
      starCount: 30
    }
  }
];


// Add these section configurations at the top level
const lifestyleFactors = {
  sunExposure: {
    title: "Dnevna Izpostavljenost Soncu",
    description: "Razumevanje vaše izpostavljenosti soncu nam pomaga priporočiti ustrezno zaščito pred UV žarki",
    containerClass: "bg-gradient-to-b from-amber-50/50 to-transparent p-6 rounded-lg border border-amber-100",
    iconClass: "text-amber-500"
  },
  stressLevels: {
    title: "Obvladovanje Stresa",
    description: "Stres lahko pomembno vpliva na zdravje in videz vaše kože",
    containerClass: "bg-gradient-to-b from-rose-50/50 to-transparent p-6 rounded-lg border border-rose-100",
    iconClass: "text-rose-500"
  },
  sleepPatterns: {
    title: "Spalne Navade",
    description: "Kakovosten spanec je ključen za regeneracijo in obnovo kože",
    containerClass: "bg-gradient-to-b from-sky-50/50 to-transparent p-6 rounded-lg border border-sky-100",
    iconClass: "text-sky-500"
  }
};

const exfoliationFrequencyOptions = [
  {
    value: "NEVER",
    label: "Nikoli",
    description: "Trenutno brez rutine eksfoliacije",
    icon: Circle,
    details: "Najprimernejše za izjemno občutljivo kožo ali začetnike v negi kože"
  },
  {
    value: "WEEKLY",
    label: "Tedensko",
    description: "Občasna nežna eksfoliacija",
    icon: Circle,
    details: "Idealno za občutljivo ali normalno kožo, ki potrebuje uravnoteženo vzdrževanje"
  },
  {
    value: "TWO_TO_THREE_TIMES_WEEK",
    label: "2-3-krat na teden",
    description: "Redna rutina eksfoliacije",
    icon: Circle,
    details: "Popolno za mastno ali kombinirano kožo, ki potrebuje pogosto obnovo celic"
  }
];

const exfoliationTypeOptions = [
  {
    value: "PHYSICAL_SCRUBS",
    label: "Fizični Piling",
    description: "Mehanska eksfoliacija z zrnatimi delci",
    icon: Brush,
    details: "Najboljše za: Mastno kožo, debelo teksturo kože. Uporabljajte z nežnim pritiskom v krožnih gibih.",
    gradient: "from-blue-50 to-blue-100"
  },
  {
    value: "CHEMICAL_EXFOLIANTS",
    label: "Kemični Eksfolianti (AHA/BHA)",
    description: "Eksfoliacija na podlagi kislin za globjo obnovo kože",
    icon: FlaskConical,
    details: "Najboljše za: Znake staranja, hiperpigmentacijo. Začnite z nižjimi koncentracijami.",
    gradient: "from-purple-50 to-purple-100"
  },
  {
    value: "ENZYME_EXFOLIATORS",
    label: "Encimski Eksfoliatorji",
    description: "Nežna eksfoliacija na podlagi proteinov",
    icon: Apple,
    details: "Najboljše za: Občutljivo kožo, nagnjeno k rosacej. Naravna možnost, pridobljena iz sadja.",
    gradient: "from-green-50 to-green-100"
  }
];


const preferredIngredientsOptions = [
  {
    value: "HYALURONIC_ACID",
    label: "Hialuronska Kislina",
    description: "Intenzivna hidratacija in zadrževanje vlage",
    icon: Droplets
  },
  {
    value: "VITAMIN_C",
    label: "Vitamin C",
    description: "Posvetlitev in antioksidantna zaščita",
    icon: Sparkles
  },
  {
    value: "NIACINAMIDE",
    label: "Niacinamid",
    description: "Zmanjšanje por in nadzor mastnosti",
    icon: Shield
  },
  {
    value: "CERAMIDES",
    label: "Ceramidi",
    description: "Popravilo in zaščita kožne pregrade",
    icon: FlaskConical
  },
  {
    value: "PEPTIDES",
    label: "Peptidi",
    description: "Produkcija kolagena in anti-aging",
    icon: Waves
  },
  {
    value: "PANTHENOL",
    label: "Panthenol",
    description: "Pomirjujoče in hidratantne lastnosti",
    icon: Heart
  },
  {
    value: "CENTELLA_ASIATICA",
    label: "Centella Asiatica",
    description: "Celjenje in pomirjanje vnetij kože",
    icon: Leaf
  }
];

const avoidedIngredientsOptions = [
  {
    value: "FRAGRANCE",
    label: "Dišave",
    description: "Potencialni dražilec in alergen",
    icon: AlertCircle
  },
  {
    value: "ALCOHOL",
    label: "Alkohol",
    description: "Lahko izsuši in draži",
    icon: XCircle
  },
  {
    value: "SULFATES",
    label: "Sulfati",
    description: "Agresivni čistilni agents",
    icon: Ban
  },
  {
    value: "PARABENS",
    label: "Parabeni",
    description: "Sporna konzervansa",
    icon: AlertTriangle
  },
  {
    value: "SILICONES",
    label: "Silikoni",
    description: "Lahko zamašijo pore in preprečijo absorpcijo",
    icon: ShieldOff
  },
  {
    value: "MINERAL_OIL",
    label: "Mineralno Olje",
    description: "Potencialno zamašuje pore",
    icon: XOctagon
  },
  {
    value: "ESSENTIAL_OILS",
    label: "Eterična Olja",
    description: "Lahko povzročijo občutljivost kože",
    icon: Wind
  }
];

const wearsMakeupOptions = [
  {
    value: true,
    label: 'Da, uporabljam ličila',
    description: 'Redno uporabljam kozmetične izdelke',
    icon: <Palette className="w-6 h-6" />,
    bgColor: 'bg-pink-50 hover:bg-pink-100/80'
  },
  {
    value: false,
    label: 'Ne, ne uporabljam ličil',
    description: 'Redko ali nikoli ne uporabljam kozmetičnih izdelkov',
    icon: <X className="w-6 h-6" />,
    bgColor: 'bg-gray-50 hover:bg-gray-100/80'
  }
];

const makeupTypeOptions = [
  { value: 'FOUNDATION', label: 'Podlaga', icon: '👩' },
  { value: 'CONCEALER', label: 'Korektor', icon: '💄' },
  { value: 'POWDER', label: 'Puder', icon: '🧪' },
  { value: 'BLUSH', label: 'Rdečilo', icon: '🎨' },
  { value: 'EYESHADOW', label: 'Senčilo za oči', icon: '👁️' },
  { value: 'MASCARA', label: 'Maskara', icon: '👀' },
  { value: 'LIPSTICK', label: 'Šminka', icon: '💋' },
  { value: 'EYELINER', label: 'Črtalo za oči', icon: '✍️' }
];

const frequencyOptions = [
  {
    value: 'DAILY',
    label: 'Vsakodnevno',
    description: 'Ličila nosim vsak dan',
    icon: <Clock className="w-6 h-6" />,
    bgColor: 'bg-violet-50 hover:bg-violet-100/80'
  },
  {
    value: 'FEW_TIMES_WEEK',
    label: 'Nekajkrat na teden',
    description: '3-4 krat na teden',
    icon: <Clock className="w-6 h-6" />,
    bgColor: 'bg-violet-50 hover:bg-violet-100/80'
  },
  {
    value: 'WEEKENDS_ONLY',
    label: 'Samo za vikende',
    description: 'Predvsem ob vikendih',
    icon: <Clock className="w-6 h-6" />,
    bgColor: 'bg-violet-50 hover:bg-violet-100/80'
  },
  {
    value: 'SPECIAL_OCCASIONS',
    label: 'Posebne priložnosti',
    description: 'Samo za dogodke ali priložnosti',
    icon: <Clock className="w-6 h-6" />,
    bgColor: 'bg-violet-50 hover:bg-violet-100/80'
  }
];

const makeupSection = {
  wearsMakeup: {
    title: "Uporaba ličil",
    description: "Povejte nam o svojih navadah glede ličil, da bolje razumemo vaše potrebe za nego kože",
    containerClass: "bg-gradient-to-b from-pink-50/50 to-transparent p-6 rounded-lg border border-pink-100",
    iconClass: "text-pink-500"
  },
  makeupTypes: {
    title: "Vrste ličil",
    description: "Izberite vsa ličila, ki jih redno uporabljate",
    containerClass: "bg-gradient-to-b from-purple-50/50 to-transparent p-6 rounded-lg border border-purple-100",
    iconClass: "text-purple-500"
  },
  frequency: {
    title: "Pogostost uporabe",
    description: "Kako pogosto običajno uporabljate ličila?",
    containerClass: "bg-gradient-to-b from-violet-50/50 to-transparent p-6 rounded-lg border border-violet-100",
    iconClass: "text-violet-500"
  }
};

const skinGoalOptions = [
  {
    value: "ANTI_AGING",
    label: "Proti staranju",
    description: "Zmanjšanje finih linij in gub",
    icon: "✨",
    illustration: (
      <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">✨</span>
      </div>
    )
  },
  {
    value: "ACNE",
    label: "Nadzor aken",
    description: "Preprečevanje in zdravljenje izpuščajev",
    icon: "🔍",
    illustration: (
      <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">🔍</span>
      </div>
    )
  },
  {
    value: "HYDRATION",
    label: "Hidratacija",
    description: "Izboljšanje zadrževanja vlage",
    icon: "💧",
    illustration: (
      <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">💧</span>
      </div>
    )
  },
  {
    value: "BRIGHTENING",
    label: "Posvetlitev",
    description: "Zmanjšanje temnih madežev in neenakomerne pigmentacije",
    icon: "✨",
    illustration: (
      <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">✨</span>
      </div>
    )
  },
  {
    value: "PORE_MINIMIZATION",
    label: "Zmanjšanje por",
    description: "Izpopolnjevanje in zmanjšanje vidnih por",
    icon: "⭐",
    illustration: (
      <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">⭐</span>
      </div>
    )
  }
]


export {
  sunExposureOptions,
  stressLevelOptions,
  sleepPatternOptions,
  lifestyleFactors,
  exfoliationFrequencyOptions,
  exfoliationTypeOptions,
  WaveSVG,
  SunSVG,
  FlameSVG,
  RareSunSVG,
  ModerateSunSVG,
  FrequentSunSVG,
  SunParticles,
  preferredIngredientsOptions,
  avoidedIngredientsOptions,
  makeupTypeOptions,
  frequencyOptions,
  wearsMakeupOptions,
  makeupSection,
  skinGoalOptions
}