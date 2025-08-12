export type SourceItem = { title: string; url: string };

// Tilføj alle kilder her. Hver kilde skal have en klikbar URL.
// Du kan udvide listen til de fulde 29 (eller flere).
export const sources: SourceItem[] = [
  // Strategier, doktriner, politikker
  { title: 'DoD Data, Analytics, and AI Adoption Strategy (2023) – archived release', url: 'https://web.archive.org/web/20231128132522/https://www.defense.gov/News/Releases/Release/Article/3574280/dod-releases-data-analytics-and-ai-adoption-strategy/' },
  { title: 'DoD Artificial Intelligence Strategy (2018) – archived release', url: 'https://web.archive.org/web/20190213005629/https://www.defense.gov/News/Releases/Release/Article/1753904/department-of-defense-releases-artificial-intelligence-strategy/' },
  { title: 'Responsible AI Strategy and Implementation Pathway (2022) – archived release', url: 'https://web.archive.org/web/20220623175324/https://www.defense.gov/News/Releases/Release/Article/3075593/dod-publishes-responsible-ai-strategy-and-implementation-pathway/' },
  { title: 'NATO Artificial Intelligence Strategy (2021) – archived', url: 'https://web.archive.org/web/20211022200309/https://www.nato.int/cps/en/natohq/official_texts_187617.htm' },
  { title: 'UK Defence Artificial Intelligence Strategy (2022)', url: 'https://www.gov.uk/government/publications/defence-artificial-intelligence-strategy' },

  // C2 / JADC2 og programmer
  { title: 'Joint All-Domain Command and Control (JADC2) – overview', url: 'https://en.wikipedia.org/wiki/Joint_All-Domain_Command_and_Control' },
  { title: 'USAF Advanced Battle Management System (ABMS) – fact sheet', url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/2953597/advanced-battle-management-system-abms/' },
  { title: 'US Army Project Convergence – article', url: 'https://www.army.mil/article/271862/project_convergence_capstone_4_experimentation' },
  { title: 'US Navy Project Overmatch – overview (USNI News tag)', url: 'https://news.usni.org/tag/project-overmatch' },

  // DARPA programmer og forsøg
  { title: 'DARPA Air Combat Evolution (ACE)', url: 'https://www.darpa.mil/program/air-combat-evolution' },
  { title: 'AlphaDogfight Trials – Heron AI defeats F-16 pilot (DARPA news, 2020)', url: 'https://www.darpa.mil/news-events/2020-08-26' },
  { title: 'DARPA Offensive Swarm-Enabled Tactics (OFFSET)', url: 'https://www.darpa.mil/program/offensive-swarm-enabled-tactics' },
  { title: 'CSBA – Mosaic Warfare (report hub)', url: 'https://csbaonline.org/research/publications/mosaic-warfare' },

  // Organisationer og kontorer
  { title: 'Chief Digital and Artificial Intelligence Office (CDAO)', url: 'https://www.defense.gov/About/Office-of-the-Secretary-of-Defense/Chief-Digital-and-Artificial-Intelligence-Office/' },
  { title: 'Defense Innovation Unit (DIU)', url: 'https://www.diu.mil/' },
  { title: 'NATO DIANA – Defence Innovation Accelerator (overview)', url: 'https://en.wikipedia.org/wiki/Defence_Innovation_Accelerator_for_the_North_Atlantic' },

  // Human–Machine Teaming, mission command, Auftragstaktik
  { title: 'RAND – Command and Control in the Information Age (archived)', url: 'https://web.archive.org/web/20170119211603/https://www.rand.org/pubs/monograph_reports/MR789.html' },
  { title: 'Human–machine teaming – primer (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Human%E2%80%93machine_teaming' },
  { title: 'War on the Rocks – Mission Command and 21st-Century Warfare', url: 'https://warontherocks.com/2019/04/its-about-time-we-talked-about-mission-command/' },

  // OODA, teori og etik
  { title: 'ICRC – Autonomous weapon systems and IHL (overview)', url: 'https://www.icrc.org/en/document/limits-of-autonomy-in-weapon-systems' },
  { title: 'OODA loop – primer (Wikipedia)', url: 'https://en.wikipedia.org/wiki/OODA_loop' },

  // Cases, analyser
  { title: 'RUSI – Lessons from the Ukraine War (special resources)', url: 'https://rusi.org/explore-our-research/publications/special-resources/ukraine' },
  { title: 'CSIS – Software-Defined Warfare / Emerging Tech analysis', url: 'https://www.csis.org/topics/technology' },

  // Udvalgte teknologier
  { title: 'AFRL – Skyborg (Autonomous Attritable Aircraft Experiment)', url: 'https://afresearchlab.com/technology/skyborg/' },
  { title: 'Algorithmic Warfare Cross-Functional Team (Project Maven) – Wikipedia', url: 'https://en.wikipedia.org/wiki/Algorithmic_Warfare_Cross-Functional_Team' },
  { title: 'Joint Publication 3-0 Operations (archived overview)', url: 'https://web.archive.org/web/20221015152051/https://www.jcs.mil/Doctrine/Joint-Doctrine-Pubs/3-0-Operations/' },
  { title: 'NATO – Data Exploitation Framework (AI-enabler) – archived', url: 'https://web.archive.org/web/20211130095756/https://www.nato.int/cps/en/natohq/official_texts_187709.htm' },
  { title: 'US Navy – Unmanned Campaign Framework (overview)', url: 'https://www.secnav.navy.mil/agility/Pages/Unmanned-Campaign.aspx' },
  { title: 'US Army – Multi-Domain Operations (overview)', url: 'https://en.wikipedia.org/wiki/Multi-domain_operations' },
  { title: 'NATO – Autonomy implementation state of play (archived)', url: 'https://web.archive.org/web/20211215000000/https://www.act.nato.int/article/autonomy-implementation-state-of-play/' },
  { title: 'DoD – Algorithmic Warfare Cross-Functional Team (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Algorithmic_Warfare_Cross-Functional_Team' },
  { title: 'U.S. Cyber Command – Wikipedia', url: 'https://en.wikipedia.org/wiki/United_States_Cyber_Command' },
  { title: 'Joint AI Center (JAIC) – Wikipedia', url: 'https://en.wikipedia.org/wiki/Joint_Artificial_Intelligence_Center' },
];


