import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Bot,
  Shield,
  Target,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';


interface TimelineSection {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  characteristics: string[];
  icon: React.ReactNode;
  status: 'past' | 'present' | 'future';
  color: string;
}



// Create translated implications function
const getImplications = (t: any) => [
  {
    title: t('implications.ethical.title'),
    description: t('implications.ethical.description'),
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-red-400',
  },
  {
    title: t('implications.strategic.title'),
    description: t('implications.strategic.description'),
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-400',
  },
  {
    title: t('implications.technological.title'),
    description: t('implications.technological.description'),
    icon: <Shield className="w-6 h-6" />,
    color: 'text-yellow-400',
  },
  {
    title: t('implications.human.title'),
    description: t('implications.human.description'),
    icon: <Users className="w-6 h-6" />,
    color: 'text-blue-400',
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Get translated implications
  const implications = getImplications(t);

  // Create translated timeline sections
  const getTimelineSections = (): TimelineSection[] => [
    {
      id: 'human-dominance',
      year: '2020-2025',
      title: t('timeline.humanDominance.title'),
      subtitle: t('timeline.humanDominance.subtitle'),
      description: t('timeline.humanDominance.description'),
      details: t('timeline.humanDominance.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.humanDominance.characteristics', { returnObjects: true }) as string[],
      icon: <Users className="w-6 h-6" />,
      status: 'past' as const,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'digital-integration',
      year: '2025-2030',
      title: t('timeline.digitalIntegration.title'),
      subtitle: t('timeline.digitalIntegration.subtitle'),
      description: t('timeline.digitalIntegration.description'),
      details: t('timeline.digitalIntegration.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.digitalIntegration.characteristics', { returnObjects: true }) as string[],
      icon: <Brain className="w-6 h-6" />,
      status: 'present' as const,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'autonomous-assistance',
      year: '2030-2035',
      title: t('timeline.autonomousAssistance.title'),
      subtitle: t('timeline.autonomousAssistance.subtitle'),
      description: t('timeline.autonomousAssistance.description'),
      details: t('timeline.autonomousAssistance.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.autonomousAssistance.characteristics', { returnObjects: true }) as string[],
      icon: <Bot className="w-6 h-6" />,
      status: 'future' as const,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'hybrid-command',
      year: '2035-2040',
      title: t('timeline.hybridCommand.title'),
      subtitle: t('timeline.hybridCommand.subtitle'),
      description: t('timeline.hybridCommand.description'),
      details: t('timeline.hybridCommand.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.hybridCommand.characteristics', { returnObjects: true }) as string[],
      icon: <Shield className="w-6 h-6" />,
      status: 'future' as const,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'machine-superiority',
      year: '2040-2045',
      title: t('timeline.machineSuperior.title'),
      subtitle: t('timeline.machineSuperior.subtitle'),
      description: t('timeline.machineSuperior.description'),
      details: t('timeline.machineSuperior.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.machineSuperior.characteristics', { returnObjects: true }) as string[],
      icon: <Target className="w-6 h-6" />,
      status: 'future' as const,
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'singularity',
      year: '2050',
      title: t('timeline.singularity.title'),
      subtitle: t('timeline.singularity.subtitle'),
      description: t('timeline.singularity.description'),
      details: t('timeline.singularity.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.singularity.characteristics', { returnObjects: true }) as string[],
      icon: <Zap className="w-6 h-6" />,
      status: 'future' as const,
      color: 'from-violet-500 to-purple-600',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);

      // Find active section
      const sections = Object.entries(sectionRefs.current);
      let currentSection = '';

      for (const [id, element] of sections) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentSection = id;
            break;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'da' ? 'en' : 'da')}
          className="px-3 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg text-white hover:bg-slate-700/80 transition-all duration-300 text-sm font-medium"
        >
          {i18n.language === 'da' ? 'EN' : 'DA'}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/40" />

        <div className="relative z-10 text-center px-6 sm:px-8 lg:px-6 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight break-words">
            {t('title')}
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            {t('subtitle')}
          </p>

          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('description')}
          </p>

          {/* Detailed Introduction Section */}
          <div className="max-w-5xl mx-auto mt-16 mb-16">
            <div className="grid gap-8 text-left">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Forestil dig en flåde af autonome fartøjer, der uden varsel
                  angriber i flok – koordineret af algoritmer frem for
                  admiraler. Dette scenarie er ikke længere science fiction.
                  Allerede i slut-10'erne eksperimenterede amerikanske styrker
                  med en såkaldt{' '}
                  <a 
                    href="https://www.foxnews.com/tech/navy-to-test-ghost-fleet-attack-drone-boats-in-war-scenarios" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 font-semibold hover:text-blue-300 underline"
                  >
                    "Ghost Fleet"
                  </a>{' '}
                  af ubemandede droner og skibe, som kunne operere koordineret
                  og selvstændigt med minimal menneskelig indblanding.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  I et flådeforsøg blev sværme af små angrebsbåde sendt i
                  simuleret kamp, netværket sammen for at overvåge, overrumple
                  og angribe fjenden – mens menneskelige operatører holdt sig på
                  sikker afstand. Avancerede algoritmer styrede disse fartøjer,
                  så de kunne undgå kollisioner, dele sensorinformation og
                  udføre kombinerede angreb, alt sammen uden kontinuerlig
                  fjernstyring. "Ghost Fleet" blev et tidligt tegn på, at
                  maskiner nu træder ind som med-kommandører på fremtidens hav –
                  et spøgelse i maskinen, der varslede en større
                  transformation af militær krigsførsel og lederskab.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  I samme periode begyndte kunstig intelligens også at assistere
                  menneskelige beslutningstagere i krigens informationsdomæne.
                  Et kendt eksempel er{' '}
                  <a 
                    href="https://www.aviationtoday.com/2020/08/31/pentagon-building-foundation-al-enabled-unmanned-systems-future-conflicts/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 font-semibold hover:text-purple-300 underline"
                  >
                    Project Maven
                  </a>
                  , Pentagons pionerprojekt for "algoritmisk krigsførelse"
                  iværksat i 2017. Maven's formål var at anvende AI til at
                  gennemtrawle dronevideooptagelser for at identificere
                  fjendtlige mål hurtigere end trætte analytiker-øjne.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Ved at automatisere den tidskrævende gennemsyn af "full-motion
                  video" fra overvågningsdroner kunne Maven drastisk reducere
                  den beslutningskompleksitet, der lå på efterretningsanalytikere, og
                  forkorte den tid det tog at udpege trusler på slagmarken.
                  Maven viste både AI'ens potentiale og dens daværende
                  begrænsninger – de tidlige algoritmer leverede værdifulde
                  hurtige detektioner, men fejlede også med falske alarmer og
                  udfordringer i at skelne kombattanter fra civile. Alligevel
                  var signalet klart: algoritmer kunne blive uvurderlige
                  "medhjælpere" for den menneskelige fører ved at filtrere data
                  og fremhæve det vigtige i tide.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Sideløbende brød en ny generation af
                  forsvarsteknologivirksomheder frem og udfordrede gamle
                  doktriner for føring. Firmaer som{' '}
                  <a 
                    href="https://www.defensenews.com/digital-show-dailies/ausa/2020/10/16/anduril-adapts-tech-to-detect-cruise-missiles-in-air-force-demo/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-semibold hover:text-cyan-300 underline"
                  >
                    Anduril Industries
                  </a>{' '}
                  begyndte at levere systemer, hvor AI ikke blot var et
                  analyseværktøj, men selve kernen i kommandosystemet. I et Air
                  Force eksperiment med Advanced Battle Management System
                  fungerede Andurils Lattice-software som hjernen, der autonomt
                  samlede data fra radar, optiske sensorer og akustiske kilder –
                  alt sammen i realtid ved frontlinjen.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Systemet identificerede indkommende trusler (f.eks.
                  krydsermissiler) og trak på machine learning for at spore dem,
                  hvorefter en menneskelig operatør blot skulle bekræfte målet
                  og godkende ildåbning. Hele processen fra sensor-detektion til
                  skudordre blev således automatiseret lige op til det sidste
                  tryk på aftrækkeren. Den menneskelige fører var rykket fra at
                  være beslutningstager til at være overvåger, der kun skulle
                  gribe ind, hvis maskinen tog fejl.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  På alle niveauer begynder de militære enheder
                  således at integrere digitale medbeslutningstagere. På gruppe- og
                  delingsniveau ser vi "menneske-maskine team" med autonome
                  droner og køretøjer i tæt samarbejde med soldaterne – droner
                  fungerer som spejdere og "loitering munition", der selv finder og
                  angriber mål, men stadig med en fører på jorden til at udstikke målet
                  og rammerne.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  På bataljons- og brigadeniveau eksperimenteres der med
                  AI-systemer som digitale rådgivere i TOC'en (Tactical Operations
                  Center), der analyserer terrændata, egen enheds status og
                  fjendebillede og foreslår dispositionsmuligheder på få
                  sekunder. Selv på strategisk niveau er spirende digitale
                  hjælpere på vej ind: algoritmer, der kan simulere et utal af
                  scenarier og forudsige konsekvenserne af operationsplaner,
                  hvilket giver generaler en hidtil uset beslutningsstøtte.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Kort sagt: Den menneskelige fører er ikke afskaffet – endnu –
                  men en digital skyggefører er trådt ind på scenen, klar til at
                  overtage mange af de funktioner, som tidligere var forbeholdt
                  mennesker.
                </p>
              </div>

              <div className="text-center mt-8">
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                  <p className="text-xl font-semibold text-blue-300">
                    {t('followDevelopment')}
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>


      </section>

      {/* Interactive Timeline Overview */}
      <section id="interactive-timeline" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t('interactiveTimelineTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
              {t('interactiveTimelineSubtitle')}
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 via-blue-500 to-purple-500 transform -translate-y-1/2"></div>
            
            {/* Timeline Items */}
            <div className="relative flex justify-between items-center">
              {getTimelineSections().map((section, index) => (
                <div key={section.id} className="flex flex-col items-center group cursor-pointer" onClick={() => {
                  const element = sectionRefs.current[section.id];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>
                  {/* Timeline Node */}
                  <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 mb-4`}>
                    <div className="text-white text-xl">
                      {section.icon}
                    </div>
                    {/* Pulse Animation */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${section.color} animate-ping opacity-20`}></div>
                  </div>
                  
                  {/* Year Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    section.status === 'past'
                      ? 'bg-green-500/20 text-green-400'
                      : section.status === 'present'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {section.year}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm font-bold text-white text-center max-w-32 group-hover:text-cyan-400 transition-colors duration-300">
                    {section.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-4">
            {getTimelineSections().map((section, index) => (
              <div 
                key={section.id} 
                className="flex items-center space-x-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  const element = sectionRefs.current[section.id];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center flex-shrink-0`}>
                  <div className="text-white">
                    {section.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      section.status === 'past'
                        ? 'bg-green-500/20 text-green-400'
                        : section.status === 'present'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {section.year}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {section.subtitle}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 sm:mt-16">
            <div className="text-center mb-4">
              <span className="text-sm text-slate-400">Scroll ned for detaljeret gennemgang</span>
            </div>
            <div className="flex justify-center">
              <div className="animate-bounce">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Evolutionens Tidslinje
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
              Følg transformationen af militære operationer gennem seks kritiske
              faser, fra menneskelig dominans til total automation. Hver fase
              repræsenterer et fundamentalt skift i hvordan krigsførelse
              planlægges, udføres og kontrolleres.
            </p>
          </div>

          {getTimelineSections().map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="mb-20 sm:mb-24 lg:mb-32 last:mb-0"
            >
              <div
                className={`transition-all duration-1000 ${
                  activeSection === section.id
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-70 transform translate-y-8'
                }`}
              >
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${section.color} mb-4 sm:mb-6 shadow-lg`}
                  >
                    {section.icon}
                  </div>

                  <div
                    className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 ${
                      section.status === 'past'
                        ? 'bg-green-500/20 text-green-400'
                        : section.status === 'present'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {section.year}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white px-4">
                    {section.title}
                  </h3>

                  <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                    {section.subtitle}
                  </p>

                  <p className="text-base sm:text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
                    {section.description}
                  </p>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-2">
                  {/* Key Developments */}
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                      Centrale Udviklinger
                    </h4>
                    <ul className="space-y-3 sm:space-y-4">
                      {section.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Characteristics */}
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                      Karakteristika
                    </h4>
                    <ul className="space-y-3 sm:space-y-4">
                      {section.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            {char}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Detailed Content Section for Digital Integration */}
                {section.id === 'digital-integration' && (
                  <div className="mt-12 sm:mt-16 space-y-6 sm:space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                        Beslutningsparitet og AI Overmatch
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        En milepæl i denne udvikling er øjeblikket, hvor AI opnår{' '}
                        <span className="text-blue-400 font-semibold">
                          beslutningsparitet
                        </span>{' '}
                        med menneskelige førere – og snart derefter overgår dem.
                        Paritet betyder, at en AI under givne omstændigheder kan
                        træffe militære beslutninger lige så godt som en trænet
                        officer, hvad angår hastighed, præcision og outcome. Et
                        tidligt glimt af denne fremtid så man i 2020, da DARPA
                        afholdt de opsigtsvækkende{' '}
                        <a 
                          href="https://aibusiness.com/verticals/ai-pilot-beats-human-5-0-in-darpa-dogfight" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 font-semibold hover:text-green-300 underline"
                        >
                          AlphaDogfight Trials
                        </a>
                        . Her konkurrerede en avanceret AI mod en erfaren F-16
                        jagerpilot i en simuleret luftkamp – og AI'en vandt
                        overlegent med 5-0.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Den kunstige pilot fra Heron Systems formåede at udkæmpe
                        dogfights i VR-simulatoren med så aggressiv og optimal
                        manøvrering, at den menneskelige pilot ikke fik ram på
                        AI'en en eneste gang. Dette var ganske vist en snæver,
                        taktikfokuseret konkurrence under kontrollerede forhold,
                        men det markerede et vendepunkt: Maskinen havde bevist, at
                        den kunne overgå mennesket i en komplekst dynamisk
                        kampdisciplin, når det kom til reaktionstid, nøjagtighed
                        og adaptation. Som DARPA's programleder efterfølgende
                        bemærkede, var næste skridt ikke en fuldautomatisk jager,
                        men snarere en symbiose hvor AI flyver kampflyet og lader
                        piloten fokusere på helhedsbilledet. Men symbiosen rummer
                        kimen til substitution. Når AI i praksis gør alt "det
                        hårde arbejde" bedre end piloten, melder spørgsmålet sig:
                        Hvornår behøver vi så ikke længere piloten?
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        Gradvis Dominans
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Beslutningsparitet forventes at dukke op gradvist, domæne
                        for domæne. Vi har allerede set det i afgrænsede miljøer
                        som luftkamp-simulationer og i skak- eller
                        strategi-lignende scenarier. I marken når AI måske paritet
                        først på taktisk niveau – f.eks. i ildledelse eller
                        kampflykontrol – hvor parametrene er tydelige, dataerne
                        rigelige og feedback hurtig. Et eksempel er algoritmer,
                        der i realtid koordinerer artilleri- og droneangreb bedre
                        end en menneskelig{' '}
                        <span className="text-cyan-400 font-semibold">
                          FAC (Forward Air Controller)
                        </span>{' '}
                        kunne under stress.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Efterhånden som datagrundlaget vokser og algoritmernes
                        træning raffineres, kan vi forvente paritet også i mere
                        komplekse opgaver: operative dispositioner (hvordan man
                        bevæger bataljoner over et landskab), logistikoptimering
                        under kamp, eller kampflykoordination på tværs af en hel
                        skvadron. Når AI-systemer konsekvent kan fremkomme med
                        lige så gode eller bedre løsningsforslag som erfarne
                        stabsofficerer, og ovenikøbet hurtigere, vil mange
                        militære organisationer se det som en opfordring til at
                        lade maskinen tage tøjlerne oftere.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                        Fra Tillid til Afhængighed
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Konsekvensen af beslutningsparitet er, at tilliden til
                        AI-beslutninger stiger markant. I starten er en
                        AI-anbefaling blot ét input blandt flere til en
                        menneskelig chef, men når algoritmen igen og igen viser
                        sig at være mindst lige så træfsikker og måske endda
                        forudseende, begynder mennesker at følge dens råd mere
                        automatisk. I nogle situationer – fx missilforsvar mod
                        hyperhurtige trusler – vil man blive nødt til at stole på
                        AI: Der er simpelthen ikke tid til menneskelig
                        dobbelttjek.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Således glider vi næsten umærkeligt fra paritet til det,
                        man kalder{' '}
                        <span className="text-red-400 font-semibold">
                          AI overmatch
                        </span>
                        : Altså at AI ikke bare matcher, men overgår mennesket så
                        tydeligt, at menneskelig indblanding faktisk forringer
                        udfaldet.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-400 flex-shrink-0" />
                        Mennesket som Flaskehals
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Et klassisk tegn på overmatch er, når mennesker bliver den
                        begrænsende faktor. Hvis fx en kampplads-AI kan analysere
                        et komplekst trusselsbillede og generere den optimale
                        forsvarsplan på 1 sekund, men planen ikke kan iværksættes,
                        før en menneskelig officer minutiøst har gennemgået og
                        godkendt den over 30 minutter, så har man et problem.
                        Modstanderen med en hurtigere beslutningssløjfe (måske med
                        AI direkte i førersædet) vil i mellemtiden have ændret
                        situationen totalt.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        For at bevare beslutningsfordelen vil presset stige på at
                        give AI'en frie tøjler. Dette argument vinder indpas i
                        takt med, at store militærøvelser og simulationer begynder
                        at demonstrere AI-systemers overlegne performance. Man kan
                        forestille sig en brigadeøvelse i midten af 2030'erne,
                        hvor et AI-baseret{' '}
                        <span className="text-blue-400 font-semibold">
                          C2-system (kommando-og-kontrol)
                        </span>{' '}
                        på rød side konsekvent outmanøvrerer den blå sides
                        menneskelige kommandører ved at forudsige blå's bevægelser
                        og ramme deres svagheder.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-400 flex-shrink-0" />
                        "Speed Kills" - Hastighed som Våben
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Når AI først har overmatch på taktisk niveau, vil det
                        brede sig opad til operativt og måske strategisk niveau.
                        Overmatch betyder ikke, at AI er ufejlbarlig eller
                        "klogere" i en generel forstand end mennesker, men at
                        inden for krigens afgrænsede domæne er dens
                        beslutningskvalitet højere. Den vil kunne træffe flere
                        korrekte beslutninger under usikkerhed, hurtigere og med
                        færre ressourcer end selv de bedste generaler.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Et ofte citeret mantra lyder:{' '}
                        <span className="text-red-400 font-semibold">
                          "Speed kills"
                        </span>{' '}
                        – den hurtigste beslutter vinder oftest i kamp. AI giver
                        ikke blot hastighed, men også en dybde af analyse som
                        mennesker ikke kan opnå under tidspres. Dermed står vi ved
                        tærsklen til et radikalt skifte: Den dygtigste militære
                        leder er ikke længere en person af kød og blod, men en
                        samling algoritmer.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-400 flex-shrink-0" />
                        Kapløbets Logik
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Betydningen heraf kan næsten ikke overvurderes. Militære
                        enheder vil gradvist begynde at uddelegere flere og flere
                        kritiske beslutninger til deres AI-systemer. Hvor det i
                        2020 stadig var kontroversielt at lade en drone autonomt
                        vælge og angribe et mål, kan det i 2035 være normal
                        praksis, blot med efterfølgende audit. "AI-partneren"
                        rykker fra bagsædet til forsædet. Samtidig glider
                        mennesket – officeren, befalingsmanden – mere ud på
                        sidelinjen som overvåger eller policy-sætter snarere end
                        direkte beslutningstager.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Måske vil man stadig have en menneskelig chef, men denne
                        persons rolle vil minde om en redaktør, der godkender
                        eller forkaster forslag fra en stab af digitale
                        assistenter, fremfor en traditionel chef, der finder på
                        planen selv.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        I slutspillet, når maskinernes dominans er klar, bliver
                        det fristende helt at fjerne de resterende menneskelige
                        "flaskehalse". Hvis en krisesituation kræver splitsekunds
                        beslutninger for at undgå katastrofe (tænk f.eks.
                        missilforsvar mod atomraketter, drone-sværme på vej mod et
                        skib, etc.), ja så kan selv sekunder brugt på at vente på
                        "go" fra en menneskelig kommandør være for langsomt.
                        Overmatchet AI vil da køre i fuld autonomi, simpelthen
                        fordi modpartens AI ellers vil udmanøvrere den. Det er
                        kapløbets logik: Når først én side bevidst vælger at lade
                        AI'en lede an for at vinde tid og kompleksitet, presses de
                        andre til det samme.{' '}
                        <span className="text-purple-400 font-semibold">
                          Beslutningsparitet var startskuddet; overmatch bliver
                          motoren, der driver os mod en fremtid hvor maskinen
                          ubestridt regerer slagmarken.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Autonomous Assistance */}
                {section.id === 'autonomous-assistance' && (
                  <div className="mt-16 space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-blue-400" />
                        Fra OODA-løkken til Kontinuerlig Beslutningsstrøm
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Med AI's indtog opløses mange af de klassiske paradigmer
                        for føring og beslutningstagning.{' '}
                        <a 
                          href="https://nuclearnetwork.csis.org/automating-the-ooda-loop-in-the-age-of-ai/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 font-semibold hover:text-blue-300 underline"
                        >
                          John Boyds berømte OODA-loop
                        </a>{' '}
                        (Observe – Orient – Decide – Act) har længe været en
                        hjørnesten i forståelsen af militær beslutningstempo. Men
                        når beslutninger træffes af neurale netværk i
                        mikrosekunder, bliver OODA-løkken mere en teoretisk skygge
                        end en praktisk model. Vi ser et paradigmeskift fra den
                        cykliske beslutningsproces til en kontinuerlig strøm af
                        neuralt output.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        I praksis betyder det, at krigens beslutningsmekanik går
                        fra at være episodisk – hvor mennesker skiftevis
                        observerer og handler – til at være permanent flydende.
                        AI'er observerer konstant via sensorer, orienterer sig
                        konstant gennem datafusion og mønstergenkendelse,
                        beslutter konstant ved at optimere mål-funktioner og
                        handler konstant gennem netværkede effektorer.{' '}
                        <span className="text-purple-400 font-semibold">
                          Den gamle sekvens smelter sammen til ét.
                        </span>
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Users className="w-6 h-6 mr-3 text-green-400" />
                        Fra Dømmekraft til Parametrisering
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        I denne nye virkelighed ændres selve rollen som "fører".
                        Traditionelt har en kommandør skullet forstå situationen
                        (situational awareness), formulere en intention, udstede
                        ordre og derefter reagere på udfaldet. AI overtager i
                        stigende grad forståelses- og beslutningsdelen, hvilket
                        reducerer den menneskelige førers rolle til primært at
                        sætte overordnede mål og begrænsninger.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Man kan sige, at vi bevæger os fra en føringsfilosofi
                        baseret på menneskelig dømmekraft til en baseret på{' '}
                        <span className="text-cyan-400 font-semibold">
                          parametrisering
                        </span>
                        . Den menneskelige leder definerer de parametre eller
                        politikker, som AI'en skal optimere efter – resten
                        overlades til algoritmen at udfylde. En amerikansk oberst
                        pointerede, at dette i yderste konsekvens betyder, at en
                        soldat (eller officer) blot skal udtrykke sin intention
                        til en maskine, fx "sikre højdedrag X for enhver pris med
                        minimal collateral damage", og AI'en vil på basis af delt
                        kontekst automatisk planlægge og udføre missionen med en
                        autonom sværm.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        <span className="text-yellow-400 font-semibold">
                          Kommandoen bliver et dialog mellem menneske og maskine
                        </span>{' '}
                        snarere end en envejs-ordreformidling.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Bot className="w-6 h-6 mr-3 text-purple-400" />
                        Serverfarm som Hovedkvarter
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Det klassiske førerhovedkvarter kan i fremtiden lige så
                        vel være en serverfarm fuld af AI-modeller som en bygning
                        fuld af officerer. De centrale beslutningsnoder i
                        netværket er måske neuronale netværk snarere end
                        skarpsindige stabsofficerer med landkort. Paradigmeskiftet
                        kan sammenlignes med overgangen fra analog til digital
                        behandling: Hvor man før så kommando og kontrol som en
                        serie af diskrete trin (OODA-løkken), ser man nu et
                        selvjusterende system, der hele tiden balancerer mod målet
                        uden stop.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-indigo-400" />
                        Neurale Interfaces og Tankens Hastighed
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Et vigtigt element er også integrationen af{' '}
                        <span className="text-blue-400 font-semibold">
                          neurale interfaces
                        </span>{' '}
                        – måske ikke i 2025, men på sigt. Hvis man forestiller sig
                        en fremtid, hvor menneskelige soldater eller ledere er
                        udstyret med hjerne-computer-forbindelser, kan intentioner
                        og beslutninger flyde direkte fra den menneskelige hjerne
                        til maskinen uden at gå vejen gennem sprog eller skrift.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Allerede i dag eksperimenteres med{' '}
                        <span className="text-green-400 font-semibold">
                          brain-computer interface-teknologier
                        </span>{' '}
                        i både civile og militære sammenhænge. I en
                        kommando-sammenhæng ville det betyde, at en fører
                        potentielt kunne "tænke\" en ordre eller reaktion, som så
                        aflæses af AI'en og behandles øjeblikkeligt. Selvom dette
                        lyder futuristisk, illustrerer det retningen: Kommandoens
                        medie skifter fra tale og tekst til data og neurale
                        signaler.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        OODA-løkken – som hvilede på en antagelse om en
                        menneskelig observatør/beslutningstager – bliver dermed en
                        abstraktion. I stedet har vi måske en{' '}
                        <span className="text-purple-400 font-semibold">
                          "Continuous Observe-Orient-Decide-Act pipeline"
                        </span>{' '}
                        drevet af maskiner, hvor mennesker kun tilfører
                        justeringer i ny og næ.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        Automatiseringens Tåge
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Paradigmeskiftet rummer også faren for, at mennesket
                        mister overblikket. En AI's beslutningslogik, især for
                        komplekse neurale netværk, er ofte uigennemsigtig selv for
                        dens programmører (
                        <span className="text-red-400 font-semibold">
                          "black box problem"
                        </span>
                        ). Når beslutninger tages så hurtigt og kontinuerligt,
                        opstår det, man kan kalde{' '}
                        <span className="text-yellow-400 font-semibold">
                          "the fog of automation"
                        </span>
                        .
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Lige som Clausewitz talte om krigens tåge pga.
                        ufuldstændig information, kan vi få en ny tåge bestående
                        af vores begrænsede evne til at forstå, hvorfor AI'en gør,
                        som den gør, i realtid. Kommando i algoritmens tidsalder
                        kræver derfor nye tillidsmekanismer og nye måder at
                        verificere, at neurale output stemmer overens med de
                        overordnede intentioner og etiske begrænsninger,
                        menneskene har defineret.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Vi skal med andre ord gentænke kontrol-begrebet i{' '}
                        <span className="text-cyan-400 font-semibold">
                          C2 (Command and Control)
                        </span>
                        : Kontrol bliver mindre mikrostyring og mere opsyn med, at
                        systemet holder sig inden for de rigtige politikker.
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Hybrid Command */}
                {section.id === 'hybrid-command' && (
                  <div className="mt-16 space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Users className="w-6 h-6 mr-3 text-blue-400" />
                        Auftragstaktik 2.0: Intention og Initiativ under
                        Algoritmisk Føring
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        I over et århundrede har kerneprincipper i militær føring
                        som førerens intention, undergivet initiativ og{' '}
                        <a 
                          href="https://warontherocks.com/2025/03/the-u-s-army-artificial-intelligence-and-mission-command/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 font-semibold hover:text-blue-300 underline"
                        >
                          auftragstaktik (opdragstaktik)
                        </a>{' '}
                        været hyldet især i vestlige doktriner. Disse idéer bygger
                        på, at mennesker på alle niveauer – når de deler en fælles
                        forståelse af målet – kan improvisere og træffe
                        beslutninger selvstændigt i overensstemmelse med chefens
                        hensigt. Hvordan transformeres disse principper, når
                        føringsstrukturen bliver digital og algoritmer overtager
                        mange funktioner?
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Til at starte med er førerens intention stadig afgørende –
                        men den skal nu oversættes til en form, som maskiner
                        forstår. Som War on the Rocks bemærker, vil soldater
                        (eller chefer) skulle finde nye måder at artikulere deres
                        intention, så en algoritme kan agere på den, fx ved at
                        definere objektiv, formål, begrænsninger og præferencer
                        klart, hvorefter AI'en eksekverer inden for disse rammer.
                        Intentionen går fra at være en ofte mundtligt eller
                        tekstuelt formuleret befaling til at være en{' '}
                        <span className="text-green-400 font-semibold">
                          datastruktur
                        </span>{' '}
                        – et sæt af parametre eller en målfunktion i AI-systemet.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        For at dette virker, må man opbygge en "fælles
                        referenceramme" mellem menneske og maskine. Det vil sige,
                        at AI'en skal trænes i at forstå konteksten for førerens
                        intention – terrænkendskab, doktrine, tidligere cases –
                        alt det, der udgør tacit knowledge hos humane ledere. Uden
                        denne delte kontekst kan misforståelser opstå (på
                        katastrofal vis). Derfor kan man forestille sig databaser
                        med "kontekstuel reference", som algoritmer kan slå op i
                        for at tolke førerens hensigt korrekt.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-purple-400" />
                        Algoritmisk Initiativ og Opportunisme
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Initiativ under algoritmisk føring bliver ligeledes
                        omformet. Oprindeligt betød initiativ, at en underordnet
                        leder turde handle selv, selvom situationen ændrede sig,
                        så længe hans handling støttede chefens intention. I en
                        fremtid med AI kan man spørge: Hvem udviser initiativ –
                        maskinen eller mennesket? Svaret er sandsynligvis: begge,
                        men på forskellige måder.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        En AI kan programmeres til at udvise en slags initiativ
                        ved at afvige fra planen, når den detekterer en mulighed
                        for at opnå målet mere effektivt – altså{' '}
                        <span className="text-cyan-400 font-semibold">
                          algoritmisk opportunisme
                        </span>
                        . Et sværmdronesystem kunne f.eks. få at vide: "Din
                        overordnede mission er rekognoscering af område X, men
                        hvis du opdager en højværdi-mål undervejs (fx et
                        fjendtligt luftforsvar), må du gerne omdirigere nogle
                        droner til at observere det nærmere eller neutralisere
                        det, så længe hovedmissionen ikke kompromitteres."
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Dette ville være analogt til, hvordan en menneskelig
                        patruljefører kunne afvige fra marchruten for at opsnappe
                        en uventet chance. AI-initiativet er dog begrænset af de
                        rammer, vi koder: det vil altid handle inden for sin{' '}
                        <span className="text-yellow-400 font-semibold">
                          "permission space"
                        </span>
                        . På den anden side kan menneskelige underordnede stadig
                        have en rolle i at udvise initiativ i tilpasningen af
                        AI'en.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-red-400" />
                        Mission-Type Orders til Maskiner
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Auftragstaktik som overordnet koncept – dvs. mission-type
                        orders med decentraliseret udførelse – kan tilsyneladende
                        trives i samspil med AI, men måske ikke på den måde
                        oprindeligt tænkt. I stedet for at det er menneskelige
                        underordnede, der selvstændigt udfører opdraget, kan det
                        være maskiner (eller human-machine teams), der får
                        udstukket opdragstaktiske ordrer.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        En kommandør kunne sige: "Denne brigade skal erobre
                        brohoved Y og holde det i 48 timer for at understøtte
                        korpsets angreb" – og i stedet for at udarbejde en
                        detaljeret plan, overlades det til en suite af AI'er til
                        at orkestrere de taktiske bevægelser, logistikkæden,
                        ildstøtte osv. inden for de overordnede retningslinjer.
                        Det er{' '}
                        <span className="text-blue-400 font-semibold">
                          auftragstaktik 2.0
                        </span>
                        : man giver en opgave og en hensigt til systemet, ikke
                        bare til en officer, og systemet finder selv vejen.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Samtidig vil nogle argumentere, at ægte auftragstaktik
                        fordrer et menneskeligt element – den gensidige tillid og
                        forståelse der opstår gennem lederskabskultur. Man kan
                        frygte en tilbagevenden til mere centraliseret kontrol,
                        paradoksalt nok, fordi en central AI potentielt kan
                        koordinere alt så godt, at behovet for menneskelig
                        decentralisering mindskes.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-green-400" />
                        Doktrinære Gnidninger: Vest vs. Øst
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Man ser allerede doktrinære gnidninger her. Vestlige
                        doktriner er bygget på trust og empowerment nedadtil;{' '}
                        <span className="text-red-400 font-semibold">
                          PLA (Kinas folkets befrielseshær)
                        </span>{' '}
                        taler derimod om "intelligentiseret krigsførelse", hvor
                        datafusion og AI i høj grad centraliserer
                        beslutningsmagten i "dynamiske dræber-netværk\" på tværs
                        af domæner.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Ikke desto mindre fremhæver også vestlige militære
                        tænkere, at AI ikke bør ses som afløser men som forlænger
                        af mission command-filosofien. Jensen & Kwon skriver
                        f.eks., at nye teknologier og "mosaic" netværk ikke
                        erstatter mission command, men udvider den – soldater skal
                        finde nye måder at udtrykke intention og overlade
                        udførelsen til algoritmer i human-machine teams.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Grundprincipperne – fx disciplineret initiativ og delt
                        forståelse – er stadig relevante, men de skal nu opnås
                        gennem uddannelse i data og algoritmer i lige så høj grad
                        som i feltøvelser. For at en fremtidig officer kan udøve
                        auftragstaktik overfor et halv-autonomt kompagni, skal hun
                        forstå, hvordan AI'en "tænker" og hvordan hun bedst
                        formulerer sin hensigt i data-termer.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
                        AI's Begrænsninger og Kreativitetens Udfordring
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        En særlig udfordring er de indbyggede bias og
                        begrænsninger i AI. Menneskelige ledere har bias og kan
                        fejle, men de kan også fornemme ting, der ikke står i
                        manualen – udvise mavefornemmelse og kreativitet. Kan
                        algoritmer det? Deep learning-netværk kan være fremragende
                        til at generalisere mønstre de har set før, men dårlige
                        til at håndtere det helt nye. Auftragstaktik netop
                        fremhæver at kunne agere i friktion og kaos.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Der vil sandsynligvis opstå situationer, hvor en rigid AI
                        falder igennem. Et klassisk eksempel: En autonom enhed har
                        ordre (hensigt) om at rykke frem til en bestemt koordinat,
                        men undervejs opstår en uforudset mulighed – f.eks.
                        opdager den en ubeskyttet fjendtlig kommandoenhed i
                        nærheden, som kunne slås ud. Har AI'en beføjelser til at
                        gribe chancen?
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Fremtidens opdragstaktik kræver derfor en form for{' '}
                        <span className="text-purple-400 font-semibold">
                          metaviden i AI'en
                        </span>{' '}
                        – regler for hvornår den skal afvige fra planen – hvilket
                        i bund og grund er det samme dilemma menneskelige
                        underordnede har: hvornår er initiativ konstruktivt og
                        hvornår er det illoyalt?
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-indigo-400" />
                        Genopfindelsen af Militært Håndværk
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Vi ser altså begyndelsen til en sammenfletning af
                        klassiske føringsprincipper med algoritmisk logik.
                        Intention bliver en algoritmisk målsætning, initiativ
                        bliver adaptiv reaktion inden for kodede rammer, og
                        auftragstaktik udstrækkes til at omfatte både mennesker og
                        maskiner som modtagere af mission-type orders.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Der vil gå årtier med eksperimenter i doktrin og praksis
                        for at finde den rette balance. Men en ting er sikkert:
                        Når soldat, fører og maskine glider sammen i én integreret
                        beslutningsenhed, må vi genopfinde den militære håndværk
                        fra bunden, så vi sikrer at maskinerne viderefører ånden i
                        vores bedste føringsprincipper fremfor blot at erstatte
                        dem med kold optimering.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        <span className="text-cyan-400 font-semibold">
                          Intention formuleres i kode, initiativ udøves via
                          adaptive algoritmer
                        </span>{' '}
                        – men kernen af militær ledelse forbliver: at skabe
                        sammenhæng mellem mål og handling, selv når både mål og
                        handling udføres af maskiner.
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Machine Superiority */}
                {section.id === 'machine-superiority' && (
                  <div className="mt-16 space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-red-400" />
                        Fra ROE til Indlejret Politik: Etik, Autonomi og
                        Suverænitet
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        En af de mest komplekse udfordringer ved skiftet til
                        digital beslutningstagning er, hvordan vi indarbejder
                        etik, jura og politik i maskinernes hjerner. I dag
                        håndhæves krigens love og regler gennem{' '}
                        <span className="text-blue-400 font-semibold">
                          Rules of Engagement (ROE)
                        </span>
                        , som er detaljerede direktiver for hvornår og hvordan
                        styrker må anvende magt. Disse ROE fortolkes og anvendes
                        af menneskelige soldater og officerer, der med deres
                        dømmekraft kan afgøre fx om et mål er lovligt, om risikoen
                        for civile tab er for høj, osv.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        I en fremtid med autonome systemer skal sådan dømmekraft
                        oversættes til{' '}
                        <span className="text-purple-400 font-semibold">
                          indlejrede politikker
                        </span>{' '}
                        – altså hardcode'ede begrænsninger eller retningslinjer,
                        som AI'en ikke kan overskride. Vi bevæger os fra at have
                        mennesker, der adlyder ROE, til at have algoritmer, der er
                        bygget med ROE (og nationale/strategiske politikker) som
                        en integreret del.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-cyan-400" />
                        Indlejret Politik i Praksis
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Hvordan ser "indlejret politik" ud i praksis? Det kunne
                        være i form af if-then regler og eksterne etik-moduler
                        eller gennem mere sofistikerede teknikker som{' '}
                        <span className="text-green-400 font-semibold">
                          værdi-justeret læring (value-aligned AI)
                        </span>
                        . For eksempel kunne en dronetaktik-AI have en indlejret
                        politik, der siger: "Hvis sandsynlighed for civile tab;
                        X%, så afbryd angreb" eller \"Angrib ikke identificerede
                        hospitaler uanset hvad".
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Disse regler skal være utvetydige og testede, da AI'en
                        ellers kan misfortolke dem. Det store problem her er, at
                        virkeligheden sjældent er sort/hvid: Mennesker kan lave
                        kontekstuelle vurderinger, AI'en følger sin kode blindt.
                        Der er frygt for scenarier, hvor en AI enten overreagerer
                        (f.eks. tager forebyggende angreb fordi dens indlejrede
                        politik siger at visse trusler altid skal neutraliseres)
                        eller undereagerer (f.eks. ikke skyder i tide fordi en
                        streng regel blokerede, selv om situationen egentlig
                        gjorde det lovligt).
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        At indkode noget så nuanceret som proportionalitet og
                        militær nødvendighed – kernebegreber i krigens love – er
                        en enorm udfordring. Det kræver tæt samarbejde mellem
                        folkeretseksperter, programmører og militærpersoner. Noget
                        man dog overvejer, er at give AI systemer{' '}
                        <span className="text-yellow-400 font-semibold">
                          "etiske neurale netværk"
                        </span>{' '}
                        ved siden af de taktiske netværk – en form for indbygget
                        samvittigheds-filter.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Users className="w-6 h-6 mr-3 text-indigo-400" />
                        Suverænitet og Multinational Udfordringer
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Suverænitet spiller også ind. Hvem "ejer" beslutningen,
                        når en multinational operation benytter en fælles AI?
                        NATO-operationer kan blive tricky: forestil dig at et
                        amerikansk-bygget AI-system foreslår et angreb under en
                        NATO indsats, men europæiske allierede har indsigelser
                        ift. deres strengere policy. Hvem sætter parametrene her?
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Vi kan se konturerne af{' '}
                        <span className="text-blue-400 font-semibold">
                          "policy negotiation protocols"
                        </span>{' '}
                        mellem allierede: at man før indsættelse bliver enige om
                        de politiske indlejrede regler. F.eks. kunne man indbygge
                        i en mission-AI: "Følg det strengeste fællesmindelige
                        etiske sæt blandt deltagerlandene". Men hvis ét land er
                        meget restriktivt og et andet ikke, kan det stække
                        effekten.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Igen kan vi vende blikket mod menneskelig praksis: i
                        dagens koalitioner findes "caveats" (nationale forbehold
                        for hvad ens tropper må). Fremover kunne vi have{' '}
                        <span className="text-purple-400 font-semibold">
                          digitale caveats
                        </span>{' '}
                        – parametre som hver nation tvinger ind i det fælles
                        system. Et potentielt teknisk virkemiddel er at gøre AI
                        beslutningsmodellen mere transparent via f.eks.
                        explainable AI, så landene kan inspicere, at deres etiske
                        krav er repræsenteret.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        Autonome Våben og Globale Normer
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Autonome våben i sig selv udløser hede etiske debatter
                        globalt. FN's konvention om visse konventionelle våben
                        (CCW) har i årevis diskuteret et forbud eller moratorium
                        på{' '}
                        <span className="text-red-400 font-semibold">
                          "killer robots"
                        </span>
                        . Mange NGO'er og nogle stater ønsker at bremse
                        udviklingen af våben, der kan dræbe uden menneskelig
                        kontrol.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        De store militærmagter (USA, Rusland, Kina) har dog været
                        lunkne overfor hårde restriktioner, netop fordi de ser et
                        militært imperativ i at udnytte AI – igen frygten for at
                        halter man bagefter i kapløbet, bliver man sårbar. Så rent
                        politisk har vi en kløft: Normerne er ikke afklarede.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Hvis vesten officielt lover aldrig at fjerne mennesket
                        helt fra loopet, men Kina eller andre gør det, står vesten
                        potentielt overfor et{' '}
                        <span className="text-yellow-400 font-semibold">
                          Moralsk Dilemma vs. Overlevelsesinstinkt
                        </span>
                        . Enten holder man sine værdier og risikerer militært
                        underlæg, eller man tilpasser sig modvilligt realpolitisk.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                        Failsafes og Flerlags-kontrol
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Det mest sandsynlige er, at militære styrker vil
                        implementere{' '}
                        <span className="text-green-400 font-semibold">
                          "failsafes"
                        </span>{' '}
                        og flerlags-kontrol for at tilfredsstille etikken i det
                        mindste frem mod 2050. Eksempelvis kunne autonome
                        dræbersystemer altid have en kommunikationslink, der
                        tillader en menneskelig kommandør at afbryde missionen,
                        hvis tid og situation tillader det.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Man kunne også forestille sig, at alle AI-beslutninger
                        logges med rationale, så de kan evalueres bagefter for
                        lovlighed (selvom det måske er ubrugeligt i øjeblikket,
                        giver det ansvarlighed bagudrettet). Indlejret politik
                        indebærer også suverænitetsbeskyttelse: En nation vil
                        sikre sig, at dens AI altid følger landets politiske
                        doktriner.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        For demokratier kunne det være ting som civil kontrol (AI
                        må ikke igangsætte brug af bestemt våben uden civil leders
                        godkendelse). For autoritære kunne det til gengæld være
                        undertrykkelsesmekanismer (fx at et lands AI aldrig vil
                        overveje at skåne visse interne fjender).
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-orange-400" />
                        Misbrug og Internationale Aftaler
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Dette er en dyster tanke – men hvis et regime er kynisk
                        nok, kan de misbruge autonome systemer til f.eks.
                        målrettet at fjerne dissidenter eller minoriteter med
                        algoritmisk effektivitet. Vi ser allerede primitiv
                        udnyttelse af algoritmer til undertrykkelse (fx Kinas
                        overvågning af uighurer via ansigtsgenkendelse).
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Overført til krig kunne en AI potentielt "prioritere"
                        visse folkegrupper som trusler hvis programmørerne bag er
                        racistisk/ideologisk biased. Derfor er der et stærkt kald
                        for internationalt samarbejde om grundlæggende principper
                        for militær AI – analogt til ikke-spredningsaftaler.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        NATO forsøger at profilere sig som en alliance baseret på
                        værdier også i teknologikapløbet, med udtalelser om
                        ansvarlig AI i forsvar etc. Spørgsmålet er, om det kan stå
                        distancen, hvis eksistentielle trusler opstår, hvor kun
                        fuld AI-autonomi kan reagere hurtigt nok.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-violet-400" />
                        Geneve-konventioner for Algoritmer
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        I sidste ende kommer vi måske til at se en slags{' '}
                        <span className="text-violet-400 font-semibold">
                          "Geneve-konventioner for algoritmer"
                        </span>
                        . Forestil dig aftaler om, at autonome systemer skal
                        genkende og respektere røde kors symboler, eller at de
                        skal indeholde en form for "etisk governor\" modul
                        udviklet under FN-tilsyn. Måske utopisk, men behovet for
                        noget lignende vil vokse i takt med at teknologien modnes.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Indtil da er overgangen fra ROE til indlejret politik et
                        eksperiment under udvikling i hver enkelt nation.
                        Militærjurister er allerede ved at kodeksificere, hvordan
                        f.eks. en drone's software kan certificeres til at
                        overholde{' '}
                        <span className="text-cyan-400 font-semibold">
                          LOAC (Law of Armed Conflict)
                        </span>
                        . NATO's forsøg på "AI principles" skal implementeres
                        praktisk.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Det er et nyt felt, hvor moralske filosofier møder
                        programmering. Og midt i dette står soldaten: trænet til
                        at følge regler, men måske nu med en ny form for regler
                        brændt fast i maskineriet han betjener. Soldaten af i
                        morgen skal have indprentet, at "bare fordi maskinen kan
                        skyde, er det ikke sikkert den bør" – ligesom soldater i
                        dag lærer at ifrågasætte ulovlige ordrer, skal de måske i
                        fremtiden lære at overvåge og eventuelt afbryde deres AI's
                        handlinger, hvis den går imod dybere principper.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Omvendt vil mange beslutninger være taget så hurtigt, at
                        der ikke var tid til moralsk skønsudøvelse – hvorefter man
                        må leve med efterspillet. Der vil opstå nye gråzoner og
                        tragiske dilemmaer. Krigens natur – kaos og
                        uforudsigelighed – sikrer, at uanset hvor meget etiske
                        guardrails vi indbygger, vil der komme situationer, som
                        tester systemets (og vores) moral. Det bliver
                        menneskehedens kollektive ansvar at gøre alt for, at selv
                        når krigen fremføres af maskiner, menneskeligheden i form
                        af moral ikke tabes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Human Dominance */}
                {section.id === 'human-dominance' && (
                  <div className="mt-16 space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        På fremtidens kampplads er tiden den altafgørende faktor.
                        At træffe beslutninger hurtigere end modstanderen kan
                        betyde forskellen mellem sejr og nederlag. Derfor har
                        integrationen af AI ikke blot handlet om at aflaste
                        mennesker, men om at ophæve de menneskelige begrænsninger
                        i tempo. Traditionelt kunne der gå lange minutter fra en
                        sensor opdagede et mål, til informationen nåede
                        beslutningstagere og videre til et våbensystem, der så
                        effektuerede et angreb. Med AI krymper denne{' '}
                        <span className="text-blue-400 font-semibold">
                          "kill chain"
                        </span>{' '}
                        dramatisk.
                      </p>

                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Under U.S. Army's{' '}
                        <a 
                          href="https://www.c4isrnet.com/artificial-intelligence/2020/09/25/the-army-just-conducted-a-massive-test-of-its-battlefield-artificial-intelligence-in-the-desert/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 font-semibold hover:text-green-300 underline"
                        >
                          Project Convergence 2020
                        </a>{' '}
                        demonstration blev dette vist i praksis: Her arbejdede et
                        kæde af AI- og autonome systemer sammen om at identificere
                        trusler og udpege det optimale våben til at neutralisere
                        dem – alt sammen på omkring 20 sekunder, en proces der før
                        tog 20 minutter. En central komponent var det AI-drevne
                        system kaldet{' '}
                        <span className="text-purple-400 font-semibold">
                          FIRESTORM
                        </span>{' '}
                        (Fires Synchronization to Optimize Responses in
                        Multi-Domain Operations).
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        FIRESTORM fungerede som et digitalt ildleder-"hjerne", der
                        modtog sensoroplysninger fra jorden, luften, rummet og
                        cyberspace, analyserede dem lynhurtigt og derefter
                        anbefalede den bedste skydende enhed til hvert nyt mål. I
                        demonstrationen udpegede FIRESTORM eksempelvis en
                        artillerienhed til at nedkæmpe et fjendtligt pansret
                        køretøj 40 km væk; operatørerne skulle blot godkende
                        forslaget med et klik, hvorefter ilden blev lagt – hele
                        denne sekvens var afsluttet hurtigere, end granaten
                        faktisk fløj mod målet. Sådan en sensor-til-effektor
                        integration i maskinhastighed ændrer fundamentalt kampens
                        tempo og karakter.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                        Edge AI og Frontlinje-Intelligence
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        For at nå til dette niveau måtte militæret kombinere flere
                        teknologiske fremskridt.{' '}
                        <span className="text-cyan-400 font-semibold">
                          Edge AI
                        </span>{' '}
                        – kunstig intelligens ude på selve frontlinjens enheder –
                        er en afgørende muligør. Fordi kommunikation kan være
                        ustabil eller langsom i kampens hede, skal droner,
                        køretøjer og sensorer kunne tænke selv uden at vente på
                        ordrer fra et fjernt kommandocenter.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Under ABMS-forsøget beskrev Anduril, hvordan deres netværk
                        af{' '}
                        <span className="text-blue-400 font-semibold">
                          Sentry Towers
                        </span>{' '}
                        med indbygget AI kunne detektere og spore trusler lokalt
                        og kun sende relevante advarsler videre, hvilket bragte
                        responstiden ned til nær nulpunktet. Edge AI på denne måde
                        sikrer, at beslutninger – i hvert fald de rutineprægede og
                        akutte – kan tages dér, hvor dataene indkommer,
                        øjeblikkeligt og uden flaskehalse.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-red-400" />
                        Sværm-koordinering og Kollektiv Intelligence
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Et andet aspekt er sværm-koordinering. Fremtidens slagmark
                        vil myldre med autonome enheder – lige fra mikrodroner,
                        der flyver i sværme som en bisværm, til flåder af
                        førerløse køretøjer på land og til havs. AI er limen, der
                        holder sådanne sværme sammen og lader dem agere som én.
                        Amerikanske forsøg med drone-sværme (fx{' '}
                        <span className="text-green-400 font-semibold">
                          DARPA's OFFSET program
                        </span>{' '}
                        og det berømte{' '}
                        <span className="text-purple-400 font-semibold">
                          Perdix-sværm test
                        </span>
                        ) viste, at dusinvis af små droner kunne flyve koordineret
                        og selv fordele opgaver som overvågning af områder eller
                        "overmande\" et forsvar ved at angribe fra flere vinkler
                        samtidigt.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        Den kinesiske PLA har ligeledes demonstreret
                        bemærkelsesværdige evner her: under en nylig øvelse blev
                        en hel sværm af droner automatisk udsendt af et system
                        kaldet{' '}
                        <a 
                          href="https://www.defenseone.com/threats/2025/03/new-products-show-chinas-quest-automate-battle/403387/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-400 font-semibold hover:text-yellow-300 underline"
                        >
                          Intelligent Precision Strike System
                        </a>
                        , der ikke blot sendte dronerne afsted, men også
                        automatisk udvalgte mål, planlagde angreb og koordinerede
                        skud på tværs af enheder. Ifølge kinesiske kilder foregik
                        næsten alle disse trin autonomt – kun den endelige
                        kommando til at skyde krævede en menneskelig accept.
                        Sådanne eksempler indvarsler et miljø, hvor krigens tempo
                        overstiger menneskets evne til at reagere uden maskinel
                        assistance.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-indigo-400" />
                        OODA-lø
                        kken i Maskinhastighed
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Med AI ved roret ændres{' '}
                        <span className="text-blue-400 font-semibold">
                          OODA-løkken
                        </span>{' '}
                        (Observe-Orient-Decide-Act) i kamp fra en sekventiel,
                        menneskelig proces til en kontinuerlig, automatiseret
                        cyklus. Hvor menneskelige beslutningstagere før måske
                        kunne gennemløbe OODA-cirklen på minutter, kan en maskine
                        gøre det på brøkdele af sekunder og tilmed køre adskillige
                        beslutningscyklusser parallelt.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        En AI kan observere slagmarken via et hav af sensorer,
                        orientere sig ved lynhurtigt at krydse nye observationer
                        med historiske data og indlærte mønstre, beslutte en
                        handling og iværksætte den – og starte forfra, i en ubrudt
                        løkke. Resultatet er en form for permanent
                        beslutningsstrøm, hvor hundredevis af mikro-beslutninger
                        træffes kontinuerligt i realtid overalt på fronten.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        For den menneskelige fjende kan dette føles som at kæmpe
                        mod selve lysets hastighed – inden man når at reagere på
                        én manøvre, har modstanderens AI allerede justeret og
                        iværksat den næste. En amerikansk oberst beskrev det som
                        at blive angrebet af en{' '}
                        <span className="text-red-400 font-semibold">
                          "algorithmic speed blitz"
                        </span>
                        , hvor beslutningsdominans tilfalder den part, der bedst
                        udnytter maskinens tempo.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-emerald-400" />
                        Forudsigende Manøvrering og Proaktiv Krigsførelse
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Samtidig bringer AI muligheden for forudsigende
                        manøvrering. Hvor mennesker baserer beslutninger på
                        erfaring, intuition og fragmentariske informationer, kan
                        AI'er trænes på enorme historiske datasets og
                        simulationsresultater for at forudsige fjendens næste træk
                        med statistisk sandsynlighed. Tænk på det som en militær
                        version af skakmotorens dybe blik i fremtidige træk.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        AI'en kan analysere et givent kampbillede og genere
                        tusindvis af mulige udfald, hvoraf den udpeger de mest
                        sandsynlige fjendtlige manøvrer og forbereder modtræk
                        allerede før fjenden selv har eksekveret sit valg. Denne
                        komplekse adaptionscyklus – hvor AI forudgriber fjendens
                        plan og hele tiden tilpasser sig – skaber en form for
                        proaktiv krigsførelse.
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        To duellerende AI-systemer kan i princippet nå at iterere
                        deres taktikker mod hinanden hundreder af gange i
                        sekundet, finjustere på baggrund af hinandens sidste
                        mikro-træk, hvilket resulterer i en hurtig evolution af
                        kampdynamikker, som mennesker knap kan følge med i.
                        Slagmarken i maskinhastighed er således ikke kun
                        hurtigere, men også mere uoverskuelig – en hyper-dynamisk
                        arena, hvor beslutninger tages og justeres kontinuerligt
                        af digitale hjerner.
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Singularity */}
                {section.id === 'singularity' && (
                  <div className="mt-12 sm:mt-16 space-y-6 sm:space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-violet-400 flex-shrink-0" />
                        Slaget i Østeuropa 2050
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Året er 2050. Et sted dybt i Østeuropa udspiller der sig en konflikt, som mange endnu har svært ved at forstå. På overfladen ligner det et regulært slag: missiler flyver, pansrede formationer rykker frem, droner svirrer på himlen som sorte insektsværme. Men noget er anderledes – stilheden. I et kommandocenter langt bag fronten står en håndfuld officerer og politikere bag panserglas og iagttager et digitalt holografisk kort over kampområdet. De taler dæmpet indbyrdes, men ingen råbende ordrer eller paniske meldinger lyder. På slagmarken sidder soldater i kampkøretøjer som passive passagerer, øjne på deres displays, fingre væk fra aftrækkere. Krigen udspiller sig gennem lynhurtige datastrømme mellem maskiner, ikke gennem menneskers råb og skud. Dette er kamppladsens singularitet – det punkt hvor menneskelig inddragelse ikke længere er relevant eller mulig i krigens beslutningssløjfer.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        På få minutter opnår den ene sides netværk en sporet fordel. Satellitter og hyperspektrale droner har fodret dens AI med rig data; kvantekommunikation sikrer, at selv jamming ikke stopper informationsflowet. AI'en – lad os kalde den Prometheus Ultima – har modelleret modstanderens hver træk. Ultima finder et svagt punkt: en midlertidig ukoordineret omstilling i fjendens sværmformation. I løbet af 1,3 sekunder har Ultima omfordelt 70% af sine effektorer – autonome kampdroner på land og i luften – for at exploite bristen. Ingen menneskelig general kunne overhovedet nå at opfatte muligheden, før den er udnyttet.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                        Politisk Paralysering og Fail-Safe Protokoller
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        I Washington, Moskva eller Beijing sidder forsvarslederne og holder vejret. Ingen har trykket på en "krigserklæringsknap"; konflikten eskalerede i glidende takt, et udfald af utallige små autonome hændelser ved grænsen. Nu er spørgsmålet: vil de lade maskinerne gå hele vejen? I princippet kunne menneskene stadig standse det – de kontrollerer trods alt de højeste niveauer: de strategiske nukleare våben, de overordnede målsætninger.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        Men her, 30 år inde i AI-æraen, har man gjort sig en bitter erfaring: at gribe ind uforudset i AI-krigens gang med menneskelige justeringer kan få katastrofale følger. Historien mindes med gysen Taiwan-krisen 2045, hvor politisk tøven og forsøg på at trække "nødbremsen" på et kørende autonomt kampnet førte til kaotiske feedback loops – og et langt blodigere udfald. Siden da har alle parter nedfældet "fail-safe protocols" der mest af alt ligner autopiloter: hvis visse betingelser mødes, lader man systemet køre sin krig på maskinens præmisser, indtil en afgørelse er nået. Og betingelserne er nu mødte.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                        Informationskrig og Psykologiske Operationer
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        På jorden krymper en gruppe fjendtlige infanterister sig i skyttegraven, mens en sværm af små seksbenede jorddroner suser hen over deres hoveder og nedkæmper deres sidste bemandede støttevåben. En sergent i gruppen råber i sin radio: "Central, hvad gør vi?! Overgiver os?!" Intet svar – for Central er ikke mennesker men en kernevæg af ødelagte servere et sted, ramt af et elektromagnetisk puls-anfald. Ingen hører hans hvæsende radio.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        På modstanderens side observerer en LLM-baseret psyops AI disse scener gennem dronernes øjne og begynder at sprede genererede beskeder på alle fjendens kommunikationskanaler: "I er omringet. Jeres kommando har forladt jer. Nedlæg våbnene for at overleve." Budskabet er skræddersyet til hver enkelt soldats profil – nogle steder er det en kvindestemme, andre en vens simulerede stemme. Informationskrig og kinetisk krig er smeltet sammen i en sømløs kampagne, alt sammen koordineret af maskiner.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400 flex-shrink-0" />
                        Krigens Afslutning og Menneskelig Irrelevans
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Da solen går ned denne dag i 2050, er slaget afgjort. Ikke med en formel kapitulation eller forhandling, men ved at det tabende netværk har erkendt nederlag og automatisk standset offensive handlinger. Sensorerne viser hvide flag rejst på isolerede pansrede vrag – dem satte de tilbageværende mennesker op, selvom maskinerne allerede vidste, at de var neutraliseret. Vinderens sværme indtager nøglepositioner og låser dem ned. Menneskelige tropper rykker frem for at sikre terræn og tage sig af fanger og civile.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        Et par generaler træder ud af kommandocentret, rystede trods sejrens tegn. Krigen blev vundet – men hvordan? De ved det godt i grove træk: Deres systemer var overlegne på visse parametre, måske bedre trænet eller med mere robust kvante-link. Men detaljerne – de utallige mikrobeslutninger der førte til dette udfald – kan ingen menneskehjerne rumme. Senere vil de få en efterretningsbrief, hvor visualiseringer forsøger at fortælle krigens historie sekund for sekund, men i virkeligheden er krigens historie nu skrevet af maskiner for maskiner. For soldaterne føltes det mest som at være statister i en storm.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        Post-Menneskets Krigsførelse
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        Dette er post-menneskets C2-miljø. Hvor tempo, kompleksitet og integritet af beslutninger har overskredet selv den dygtigste generals fatteevne, og hvor menneskets rolle i beslutningstabeller er reduceret til overordnede policyvalg før konflikten og humanitær oprydning bagefter. Kamppladsens singularitet er indtruffet – det punkt hvor krigen har udviklet en egen, maskinel dynamik, som mennesker kun kan skimte konturerne af.
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        Man kunne fristes til at kalde det et mareridt, men i militære kredse kalder nogle det for en "clean war". Ironisk nok var de totale tab lavere end i tidligere tiders langsommelige krige – netværkene søgte jo at lamme hinanden effektivt, ikke at slægte ud i meningsløs vold. Men for menneskeheden rejser sig nye spørgsmål: Hvem kæmpede egentlig denne krig? Nationerne? Eller deres algoritmer? Og hvad sker der den dag, måske ikke så fjern, at vi integrerer disse netværk med såkaldt Artificial General Intelligence, som måske endda har egne mål?
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                        Fremtidens Udfordringer og Singularitets-Protokol
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        I kølvandet på slaget træder NATO og andre allierede sammen for at sikre, at et nyt "Singularitets-protokol" bliver en prioritet – en aftale om hvordan man afskærmer kernen af menneskelig suverænitet, selv når maskinerne kæmper. For selv de sejrende generaler følte et strejf af irrelevans på denne dag. Den gradvise overgang fra menneskelig til digital føring har nået sit yderste punkt: Krigen er blevet maskinernes domæne. Menneskehedens udfordring fremover bliver at sikre, at når maskinerne nu bevæger sig derude i krigens kaos på vores vegne, så sker det stadig i tråd med vores værdier, vores etik – vores menneskelighed. Ellers vinder vi måske slag, men risikerer at tabe os selv.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Implications Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('implications.title')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
              {t('implications.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {implications.map((implication, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`${implication.color} mr-3 sm:mr-4 flex-shrink-0`}>
                    {implication.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {implication.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {implication.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-slate-600 rounded-xl">
            <blockquote className="text-lg sm:text-xl text-slate-300 leading-relaxed text-center italic">
              "{t('implications.quote')}"
            </blockquote>
            <div className="text-center mt-4 sm:mt-6">
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t('conclusion.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-slate-300 leading-relaxed px-4">
            <p>
              {t('conclusion.paragraph1')}
            </p>

            <p>
              {t('conclusion.paragraph2')}
            </p>

            <p>
              {t('conclusion.paragraph3')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm sm:text-base text-slate-400 mb-2">
            {t('footer.description')}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>


    </div>
  );
}

export default App;