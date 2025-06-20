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

import DecisionWeightBar from './components/DecisionWeightBar';
import HighlightedText from './components/HighlightedText';
import { highlightText } from './utils/textHighlighter';
import { useHighlightedText, highlightRules } from './hooks/useHighlightedText';
import PodcastPlayer from './components/PodcastPlayer';


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
      title: t('timeline.machineSuperiority.title'),
      subtitle: t('timeline.machineSuperiority.subtitle'),
      description: t('timeline.machineSuperiority.description'),
      details: t('timeline.machineSuperiority.details', { returnObjects: true }) as string[],
      characteristics: t('timeline.machineSuperiority.characteristics', { returnObjects: true }) as string[],
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
      <div 
        className={`fixed top-24 right-4 z-50 sm:top-20 sm:right-6 transition-all duration-500 ${
          activeSection && activeSection !== '' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'da' ? 'en' : 'da')}
          className="px-3 py-1.5 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-md text-white/60 hover:bg-slate-700/60 hover:text-white/90 hover:border-slate-500/50 transition-all duration-300 text-xs font-medium shadow-md sm:px-4 sm:py-2 sm:text-sm sm:rounded-lg"
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
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  {t('heroIntro.opening.header1')}
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {t('heroIntro.opening.paragraph1')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  {t('heroIntro.opening.paragraph2')}
                </p>
                
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  {t('heroIntro.opening.header2')}
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('heroIntro.opening.paragraph3')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p 
                  className="text-lg text-slate-300 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: t('heroIntro.editorial.paragraph1') }}
                />
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('heroIntro.editorial.paragraph2')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {t('heroIntro.waves.paragraph1')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {t('heroIntro.waves.paragraph2')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {t('heroIntro.waves.paragraph3')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {t('heroIntro.waves.paragraph4')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {t('heroIntro.waves.paragraph5')}
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('heroIntro.waves.paragraph6')}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('heroIntro.transition.paragraph1')}
                </p>
              </div>

              <div className="text-center mt-8">
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                  <p className="text-xl font-semibold text-blue-300">
                    {t('followDevelopment')}
                  </p>
                </div>
              </div>

              {/* Podcast Player */}
              <div className="mt-12">
                <PodcastPlayer />
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
                        <HighlightedText
                          text={t('detailedSections.digitalIntegration.oodaToStream.intro')}
                          highlights={[
                            { word: 'OODA-loop', className: 'text-emerald-400 font-semibold' },
                            { word: 'neurale netværk', className: 'text-blue-400 font-semibold' },
                            { word: 'neural networks', className: 'text-blue-400 font-semibold' }
                          ]}
                        />
                      </p>
                      <p 
                        className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(
                            t('detailedSections.digitalIntegration.decisionParity.heronSystems'), 
                            i18n.language as 'da' | 'en'
                          ) 
                        }}
                      />
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        {t('detailedSections.digitalIntegration.gradualDominance.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.digitalIntegration.gradualDominance.intro')}
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
                        {t('detailedSections.digitalIntegration.trustToDependency.aiOvermatch')}
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
                        {t('detailedSections.digitalIntegration.humanBottleneck.c2System')}
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
                        {t('detailedSections.digitalIntegration.speedKills.speedMantra')}
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
                        {t('detailedSections.digitalIntegration.raceLogic.finalGame')}
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
                        {t('detailedSections.autonomousAssistance.oodaToStream.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.oodaToStream.continuousFlow')}
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
                        {t('detailedSections.autonomousAssistance.judgmentToParameters.parameterization')}
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
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.brainComputer')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.autonomousAssistance.neuralInterfaces.continuousPipeline')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.newFog')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.autonomousAssistance.fogOfAutomation.controlRedefined')}
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
                        {t('detailedSections.hybridCommand.auftragstaktik2.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.hybridCommand.auftragstaktik2.intentionTranslation')}
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
                        {t('detailedSections.hybridCommand.algorithmicInitiative.opportunism')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.hybridCommand.algorithmicInitiative.permissionSpace')}
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
                        {t('detailedSections.hybridCommand.missionTypeOrders.auftragstaktik2Point0')}
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
                        {t('detailedSections.hybridCommand.doctrinalFrictions.intro')}
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
                        {t('detailedSections.hybridCommand.aiLimitations.metaKnowledge')}
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
                        {t('detailedSections.hybridCommand.militaryCraft.coreLeadership')}
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
                        {t('detailedSections.machineSuperiority.roeToEmbeddedPolicy.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.roeToEmbeddedPolicy.embeddedPolicies')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <Brain className="w-6 h-6 mr-3 text-cyan-400" />
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.misinterpretation')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.embeddedPolicyPractice.ethicalNetworks')}
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
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.policyNegotiation')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.sovereigntyMultinational.digitalCaveats')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.militaryImperative')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.machineSuperiority.autonomousWeaponsNorms.moralDilemma')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                      <h4 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                        {t('detailedSections.machineSuperiority.failsafesControl.title')}
                      </h4>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.failsafesControl.intro')}
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
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.intro')}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.machineSuperiority.genevaConventionsAlgorithms.loac')}
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
                        {t('detailedSections.humanDominance.intro')}
                      </p>

                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        {t('detailedSections.humanDominance.projectConvergence')}
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
                        {t('detailedSections.singularity.battleEasternEurope.prometheusUltima')}
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
                        {t('detailedSections.singularity.politicalParalysis.failSafeProtocols')}
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
                        {t('detailedSections.singularity.informationWarfare.psyops')}
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
                        {t('detailedSections.singularity.warConclusion.generalsBewilderment')}
                      </p>
                  </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                        {t('detailedSections.singularity.postHumanWarfare.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
                        {t('detailedSections.singularity.postHumanWarfare.intro')}
                      </p>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.postHumanWarfare.cleanWar')}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                        {t('detailedSections.singularity.futureChallenges.title')}
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {t('detailedSections.singularity.futureChallenges.content')}
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

      {/* Contact Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
            <a 
              href="mailto:battlefield2050@proton.me" 
              className="text-lg sm:text-xl text-blue-400 hover:text-blue-300 transition-colors duration-200 font-mono"
            >
              {t('contact.email')}
            </a>
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

      {/* Decision Weight Bar */}
      <DecisionWeightBar activeSection={activeSection} />

    </div>
  );
}

export default App;