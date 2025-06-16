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
import MobileZoomControls from './components/MobileZoomControls';


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
const getImplications = (t: (key: string) => string) => [
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
                  {t('heroIntro.ghostFleet.paragraph1').split('"Ghost Fleet"').map((part, index) => (
                    index === 0 ? (
                      <span key={index}>
                        {part}
                        <a 
                          href="https://www.foxnews.com/tech/navy-to-test-ghost-fleet-attack-drone-boats-in-war-scenarios" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 font-semibold hover:text-blue-300 underline"
                        >
                    "Ghost Fleet"
                        </a>
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  ))}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.ghostFleet.paragraph2')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.projectMaven.paragraph1').split('Project Maven').map((part, index) => (
                    index === 0 ? (
                      <span key={index}>
                        {part}
                        <a 
                          href="https://www.aviationtoday.com/2020/08/31/pentagon-building-foundation-al-enabled-unmanned-systems-future-conflicts/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 font-semibold hover:text-purple-300 underline"
                        >
                    Project Maven
                        </a>
                  </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  ))}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.projectMaven.paragraph2')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.anduril.paragraph1').split('Anduril Industries').map((part, index) => (
                    index === 0 ? (
                      <span key={index}>
                        {part}
                        <a 
                          href="https://www.defensenews.com/digital-show-dailies/ausa/2020/10/16/anduril-adapts-tech-to-detect-cruise-missiles-in-air-force-demo/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 font-semibold hover:text-cyan-300 underline"
                        >
                    Anduril Industries
                        </a>
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  ))}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.anduril.paragraph2')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.integration.paragraph1')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.integration.paragraph2')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('heroIntro.integration.paragraph3')}
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
                          {getTimelineSections().map((section) => (
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
            {getTimelineSections().map((section) => (
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
                  <span className="text-sm text-slate-400">{t('timeline.scrollHint')}</span>
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

          {getTimelineSections().map((section) => (
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
                      {t('timeline.keyDevelopments')}
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
                      {t('timeline.characteristics')}
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
                        {t('detailedSections.digitalIntegration.decisionParity.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.decisionParity.intro').split('AlphaDogfight Trials')[0]}
                        <span className="text-blue-400 font-semibold">
                          {t('detailedSections.digitalIntegration.decisionParity.intro').includes('beslutningsparitet') ? 'beslutningsparitet' : 'decision parity'}
                        </span>
                        {t('detailedSections.digitalIntegration.decisionParity.intro').split('beslutningsparitet')[1]?.split('decision parity')[1] || t('detailedSections.digitalIntegration.decisionParity.intro').split('decision parity')[1]}{' '}
                        <a 
                          href="https://aibusiness.com/verticals/ai-pilot-beats-human-5-0-in-darpa-dogfight" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 font-semibold hover:text-green-300 underline"
                        >
                          AlphaDogfight Trials
                        </a>
                        {t('detailedSections.digitalIntegration.decisionParity.intro').split('AlphaDogfight Trials')[1]}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.decisionParity.heronSystems')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.gradualDominance.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.gradualDominance.intro').split('FAC')[0]}
                        <span className="text-cyan-400 font-semibold">
                          FAC (Forward Air Controller)
                        </span>
                        {t('detailedSections.digitalIntegration.gradualDominance.intro').split('FAC')[1]?.replace(' (Forward Air Controller)', '') || t('detailedSections.digitalIntegration.gradualDominance.intro').split('FAC (Forward Air Controller)')[1]}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.gradualDominance.complexTasks')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.trustToDependency.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.trustToDependency.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.trustToDependency.aiOvermatch').split('AI overmatch')[0]}
                        <span className="text-red-400 font-semibold">
                          AI overmatch
                        </span>
                        {t('detailedSections.digitalIntegration.trustToDependency.aiOvermatch').split('AI overmatch')[1]}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.humanBottleneck.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.humanBottleneck.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.humanBottleneck.c2System').split('C2-system')[0]}
                        <span className="text-blue-400 font-semibold">
                          C2-system ({t('detailedSections.digitalIntegration.humanBottleneck.c2System').includes('kommando-og-kontrol') ? 'kommando-og-kontrol' : 'command and control'})
                        </span>
                        {t('detailedSections.digitalIntegration.humanBottleneck.c2System').split('C2-system')[1]?.replace(' (kommando-og-kontrol)', '').replace(' (command and control)', '') || t('detailedSections.digitalIntegration.humanBottleneck.c2System').split('C2 system')[1]?.replace(' (command and control)', '')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.speedKills.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.speedKills.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.speedKills.speedMantra').split('"Speed kills"')[0]}
                        <span className="text-red-400 font-semibold">
                          "Speed kills"
                        </span>
                        {t('detailedSections.digitalIntegration.speedKills.speedMantra').split('"Speed kills"')[1]}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.raceLogic.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.raceLogic.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.raceLogic.editorRole')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.raceLogic.finalGame').split('Beslutningsparitet var startskuddet')[0]}{' '}
                        <span className="text-purple-400 font-semibold">
                          {t('detailedSections.digitalIntegration.raceLogic.finalGame').includes('Beslutningsparitet var startskuddet') 
                            ? 'Beslutningsparitet var startskuddet; overmatch bliver motoren, der driver os mod en fremtid hvor maskinen ubestridt regerer slagmarken.'
                            : 'Decision parity was the starting shot; overmatch becomes the engine that drives us toward a future where the machine undisputedly rules the battlefield.'}
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
                        {t('detailedSections.autonomousAssistance.oodaToStream.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.oodaToStream.intro').split('John Boyd')[0]}
                        <a 
                          href="https://nuclearnetwork.csis.org/automating-the-ooda-loop-in-the-age-of-ai/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 font-semibold hover:text-blue-300 underline"
                        >
                          {t('detailedSections.autonomousAssistance.oodaToStream.intro').includes('John Boyds berømte') ? 'John Boyds berømte OODA-loop' : 'John Boyd\'s famous OODA loop'}
                        </a>
                        {t('detailedSections.autonomousAssistance.oodaToStream.intro').split('OODA-loop')[1] || t('detailedSections.autonomousAssistance.oodaToStream.intro').split('OODA loop')[1]}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.oodaToStream.continuousFlow').split('Den gamle sekvens smelter sammen til ét')[0] || t('detailedSections.autonomousAssistance.oodaToStream.continuousFlow').split('The old sequence melts together into one')[0]}
                        <span className="text-purple-400 font-semibold">
                          {t('detailedSections.autonomousAssistance.oodaToStream.continuousFlow').includes('Den gamle sekvens smelter sammen til ét') ? 'Den gamle sekvens smelter sammen til ét.' : 'The old sequence melts together into one.'}
                        </span>
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Users className="w-6 h-6 mr-3 text-green-400" />
                        {t('detailedSections.autonomousAssistance.judgmentToParameters.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.judgmentToParameters.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization').split('parametrisering')[0] || t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization').split('parameterization')[0]}
                        <span className="text-cyan-400 font-semibold">
                          {t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization').includes('parametrisering') ? 'parametrisering' : 'parameterization'}
                        </span>
                        {t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization').split('parametrisering')[1] || t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization').split('parameterization')[1]}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        <span className="text-yellow-400 font-semibold">
                          {t('detailedSections.autonomousAssistance.judgmentToParameters.humanMachineDialogue')}
                        </span>
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Bot className="w-6 h-6 mr-3 text-purple-400" />
                        {t('detailedSections.autonomousAssistance.serverfarmHQ.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.serverfarmHQ.intro')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-indigo-400" />
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.intro').split('neurale interfaces')[0] || t('detailedSections.autonomousAssistance.neuralInterfaces.intro').split('neural interfaces')[0]}
                        <span className="text-blue-400 font-semibold">
                          {t('detailedSections.autonomousAssistance.neuralInterfaces.intro').includes('neurale interfaces') ? 'neurale interfaces' : 'neural interfaces'}
                        </span>
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.intro').split('neurale interfaces')[1] || t('detailedSections.autonomousAssistance.neuralInterfaces.intro').split('neural interfaces')[1]}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer').split('brain-computer interface-teknologier')[0] || t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer').split('brain-computer interface technologies')[0]}
                        <span className="text-green-400 font-semibold">
                          {t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer').includes('brain-computer interface-teknologier') ? 'brain-computer interface-teknologier' : 'brain-computer interface technologies'}
                        </span>
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer').split('brain-computer interface-teknologier')[1] || t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer').split('brain-computer interface technologies')[1]}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.continuousPipeline').split('"Continuous Observe-Orient-Decide-Act pipeline"')[0]}
                        <span className="text-purple-400 font-semibold">
                          "Continuous Observe-Orient-Decide-Act pipeline"
                        </span>
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.continuousPipeline').split('"Continuous Observe-Orient-Decide-Act pipeline"')[1]}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.intro').split('"black box problem"')[0]}
                        <span className="text-red-400 font-semibold">
                          "black box problem"
                        </span>
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.intro').split('"black box problem"')[1].split('"the fog of automation"')[0]}
                        <span className="text-yellow-400 font-semibold">
                          "the fog of automation"
                        </span>
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.intro').split('"the fog of automation"')[1]}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.newFog')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.controlRedefined').split('C2 (Command and Control)')[0]}
                        <span className="text-cyan-400 font-semibold">
                          C2 (Command and Control)
                        </span>
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.controlRedefined').split('C2 (Command and Control)')[1]}
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
                        {t('detailedSections.hybridCommand.auftragstaktik2.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.auftragstaktik2.intro').split('auftragstaktik (opdragstaktik)').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <a 
                                href="https://warontherocks.com/2025/03/the-u-s-army-artificial-intelligence-and-mission-command/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 font-semibold hover:text-blue-300 underline"
                              >
                          auftragstaktik (opdragstaktik)
                              </a>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.auftragstaktik2.intentionTranslation').split('datastruktur').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-green-400 font-semibold">
                          datastruktur
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.auftragstaktik2.sharedFramework')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-purple-400" />
                        {t('detailedSections.hybridCommand.algorithmicInitiative.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.algorithmicInitiative.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.algorithmicInitiative.opportunism').split('algoritmisk opportunisme').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-cyan-400 font-semibold">
                          algoritmisk opportunisme
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.algorithmicInitiative.permissionSpace').split('"permission space"').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-yellow-400 font-semibold">
                          "permission space"
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.hybridCommand.missionTypeOrders.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.missionTypeOrders.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.missionTypeOrders.auftragstaktik2Point0').split('auftragstaktik 2.0').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-blue-400 font-semibold">
                          auftragstaktik 2.0
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.missionTypeOrders.humanElement')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-green-400" />
                        {t('detailedSections.hybridCommand.doctrinalFrictions.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.doctrinalFrictions.intro').split('PLA (Kinas folkets befrielseshær)').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-red-400 font-semibold">
                          PLA (Kinas folkets befrielseshær)
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.doctrinalFrictions.westernApproach')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.doctrinalFrictions.futureOfficer')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
                        {t('detailedSections.hybridCommand.aiLimitations.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.aiLimitations.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.aiLimitations.unexpectedOpportunity')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.aiLimitations.metaKnowledge').split('metaviden i AI\'en').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-purple-400 font-semibold">
                          metaviden i AI'en
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-indigo-400" />
                        {t('detailedSections.hybridCommand.militaryCraft.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.militaryCraft.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.militaryCraft.experimentation')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.militaryCraft.coreLeadership').split('Intention formuleres i kode, initiativ udøves via adaptive algoritmer').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                        <span className="text-cyan-400 font-semibold">
                                Intention formuleres i kode, initiativ udøves via adaptive algoritmer
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
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
                        {t('detailedSections.machineSuperiority.roeToEmbeddedPolicy.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.roeToEmbeddedPolicy.intro').split('Rules of Engagement (ROE)').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-blue-400 font-semibold">
                          Rules of Engagement (ROE)
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.roeToEmbeddedPolicy.embeddedPolicies').split('indlejrede politikker').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-purple-400 font-semibold">
                          indlejrede politikker
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-cyan-400" />
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.intro').split('værdi-justeret læring (value-aligned AI)').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-green-400 font-semibold">
                          værdi-justeret læring (value-aligned AI)
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.misinterpretation')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.ethicalNetworks').split('"etiske neurale netværk"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-yellow-400 font-semibold">
                          "etiske neurale netværk"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Users className="w-6 h-6 mr-3 text-indigo-400" />
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.policyNegotiation').split('"policy negotiation protocols"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-blue-400 font-semibold">
                          "policy negotiation protocols"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.digitalCaveats').split('digitale caveats').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-purple-400 font-semibold">
                          digitale caveats
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.intro').split('"killer robots"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-red-400 font-semibold">
                          "killer robots"
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.militaryImperative')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.moralDilemma').split('Moralsk Dilemma vs. Overlevelsesinstinkt').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-yellow-400 font-semibold">
                          Moralsk Dilemma vs. Overlevelsesinstinkt
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                        {t('detailedSections.machineSuperiority.failsafesControl.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.failsafesControl.intro').split('"failsafes"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-green-400 font-semibold">
                          "failsafes"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.failsafesControl.logging')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.failsafesControl.politicalDifferences')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-orange-400" />
                        {t('detailedSections.machineSuperiority.misuseInternationalAgreements.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.misuseInternationalAgreements.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.misuseInternationalAgreements.biasedProgramming')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.misuseInternationalAgreements.natoValues')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-violet-400" />
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.intro').split('"Geneve-konventioner for algoritmer"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-violet-400 font-semibold">
                          "Geneve-konventioner for algoritmer"
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.loac').split('LOAC (Law of Armed Conflict)').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-cyan-400 font-semibold">
                          LOAC (Law of Armed Conflict)
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.moralProgramming')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.humanityInWarfare')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Content Section for Human Dominance */}
                {section.id === 'human-dominance' && (
                  <div className="mt-16 space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.humanDominance.intro').split('"kill chain"').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                        <span className="text-blue-400 font-semibold">
                          "kill chain"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>

                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.humanDominance.projectConvergence').split('Project Convergence 2020').map((part, index) => (
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <a 
                                href="https://www.c4isrnet.com/artificial-intelligence/2020/09/25/the-army-just-conducted-a-massive-test-of-its-battlefield-artificial-intelligence-in-the-desert/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-green-400 font-semibold hover:text-green-300 underline"
                              >
                          Project Convergence 2020
                              </a>
                            </span>
                          ) : index === 1 ? (
                            <span key={index}>
                              {part.split('FIRESTORM')[0]}
                        <span className="text-purple-400 font-semibold">
                          FIRESTORM
                              </span>
                              {part.split('FIRESTORM')[1]}
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        ))}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.humanDominance.firestorm')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                        {t('detailedSections.humanDominance.edgeAI.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.edgeAI.intro')
                      }} />
                      <p className="text-lg text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.edgeAI.sentryTowers')
                      }} />
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.humanDominance.swarmCoordination.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.swarmCoordination.intro')
                      }} />
                      <p className="text-lg text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.swarmCoordination.chineseCapabilities')
                      }} />
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-indigo-400" />
                        {t('detailedSections.humanDominance.oodaLoop.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.oodaLoop.intro')
                      }} />
                      <p className="text-lg text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: t('detailedSections.humanDominance.oodaLoop.aiAdvantage')
                      }} />
                    </div>


                  </div>
                )}

                {/* Detailed Content Section for Singularity */}
                {section.id === 'singularity' && (
                  <div className="mt-12 sm:mt-16 space-y-6 sm:space-y-8">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-violet-400 flex-shrink-0" />
                        {t('detailedSections.singularity.battleEasternEurope.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.battleEasternEurope.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.battleEasternEurope.prometheusUltima').split('Prometheus Ultima').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-cyan-400 font-semibold">
                                Prometheus Ultima
                        </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                        {t('detailedSections.singularity.politicalParalysis.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.politicalParalysis.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.politicalParalysis.failSafeProtocols').split('"fail-safe protocols"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-orange-400 font-semibold">
                                "fail-safe protocols"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                        {t('detailedSections.singularity.informationWarfare.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.informationWarfare.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.informationWarfare.psyops').split('LLM-baseret').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-purple-400 font-semibold">
                                LLM-baseret
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400 flex-shrink-0" />
                        {t('detailedSections.singularity.warConclusion.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.warConclusion.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.warConclusion.generalsBewilderment').split('kvante-link').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-blue-400 font-semibold">
                                kvante-link
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                  </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        {t('detailedSections.singularity.postHumanWarfare.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.postHumanWarfare.intro').split('C2-miljø').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-cyan-400 font-semibold">
                                C2-miljø
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.postHumanWarfare.cleanWar').split('"clean war"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-green-400 font-semibold">
                                "clean war"
                              </span>
                            </span>
                          ) : index === 1 ? (
                            <span key={index}>
                              {part.split('Artificial General Intelligence')[0]}
                              <span className="text-red-400 font-semibold">
                                Artificial General Intelligence
                              </span>
                              {part.split('Artificial General Intelligence')[1]}
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                        {t('detailedSections.singularity.futureChallenges.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.futureChallenges.content').split('"Singularitets-protokol"').map((part, index) => 
                          index === 0 ? (
                            <span key={index}>
                              {part}
                              <span className="text-yellow-400 font-semibold">
                                "Singularitets-protokol"
                              </span>
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
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

      {/* Mobile Zoom Controls */}
      <MobileZoomControls />

    </div>
  );
}

export default App;