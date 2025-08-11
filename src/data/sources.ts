export type SourceItem = { title: string; url: string };

// Tilføj alle kilder her. Hver kilde skal have en klikbar URL.
// Du kan udvide listen til de fulde 29 (eller flere).
export const sources: SourceItem[] = [
  // Strategier, doktriner, politikker
  { title: 'DoD Data, Analytics, and AI Adoption Strategy (2023)', url: 'https://media.defense.gov/2023/Nov/02/2003320095/-1/-1/1/DOD-DAAI-ADOPTION-STRATEGY.PDF' },
  { title: 'DoD Summary of the 2018 Department of Defense Artificial Intelligence Strategy', url: 'https://media.defense.gov/2019/Feb/12/2002088963/-1/-1/1/SUMMARY-OF-DOD-AI-STRATEGY.PDF' },
  { title: 'Responsible AI Strategy and Implementation Pathway (DoD, 2022)', url: 'https://media.defense.gov/2022/Jun/22/2003028348/-1/-1/1/RESPONSIBLE%20AI%20STRATEGY%20AND%20IMPLEMENTATION%20PATHWAY.PDF' },
  { title: 'NATO Artificial Intelligence Strategy (2021)', url: 'https://www.nato.int/cps/en/natohq/official_texts_187617.htm' },
  { title: 'UK Defence Artificial Intelligence Strategy (2022)', url: 'https://www.gov.uk/government/publications/defence-artificial-intelligence-strategy' },

  // C2 / JADC2 og programmer
  { title: 'What is JADC2? (U.S. Department of Defense explainer)', url: 'https://www.defense.gov/News/Feature-Stories/Story/Article/3134424/jadc2-what-is-joint-all-domain-command-and-control/' },
  { title: 'USAF Advanced Battle Management System (ABMS)', url: 'https://www.af.mil/News/Article-Display/Article/2773339/advanced-battle-management-system/' },
  { title: 'US Army Project Convergence', url: 'https://www.army.mil/projectconvergence' },
  { title: 'US Navy Project Overmatch (overview)', url: 'https://www.navy.mil/Press-Office/News-Stories/Article/2694516/project-overmatch-to-enable-distributed-maritime-operations/' },

  // DARPA programmer og forsøg
  { title: 'DARPA Air Combat Evolution (ACE)', url: 'https://www.darpa.mil/program/air-combat-evolution' },
  { title: 'AlphaDogfight Trials – Heron AI defeats F-16 pilot (DARPA news, 2020)', url: 'https://www.darpa.mil/news-events/2020-08-26' },
  { title: 'DARPA Offensive Swarm-Enabled Tactics (OFFSET)', url: 'https://www.darpa.mil/program/offensive-swarm-enabled-tactics' },
  { title: 'DARPA Mosaic Warfare (background/overview)', url: 'https://www.darpa.mil/work-with-us/darpa-forward/mosaic-warfare' },

  // Organisationer og kontorer
  { title: 'Chief Digital and Artificial Intelligence Office (CDAO)', url: 'https://www.ai.mil/' },
  { title: 'Defense Innovation Unit (DIU)', url: 'https://www.diu.mil/' },
  { title: 'NATO DIANA – Defence Innovation Accelerator', url: 'https://www.diana.nato.int/' },

  // Human–Machine Teaming, mission command, Auftragstaktik
  { title: 'RAND – Human–Machine Teaming overview', url: 'https://www.rand.org/topics/human-machine-teaming.html' },
  { title: 'RAND – Command and Control in the Information Age', url: 'https://www.rand.org/pubs/monograph_reports/MR789.html' },
  { title: 'War on the Rocks – Mission Command and 21st-Century Warfare', url: 'https://warontherocks.com/2019/04/its-about-time-we-talked-about-mission-command/' },

  // OODA, teori og etik
  { title: 'ICRC – Autonomous weapon systems and international humanitarian law', url: 'https://www.icrc.org/en/autonomous-weapon-systems' },
  { title: 'Air University – John Boyd and the OODA Loop (primer)', url: 'https://www.airuniversity.af.edu/' },

  // Cases, analyser
  { title: 'RUSI – Lessons from the Ukraine War (special resources)', url: 'https://rusi.org/explore-our-research/publications/special-resources/ukraine' },
  { title: 'CSIS – Software-Defined Warfare / Emerging Tech analysis', url: 'https://www.csis.org/topics/technology' },

  // Udvalgte teknologier
  { title: 'AFRL – Skyborg (Autonomous Attritable Aircraft Experiment)', url: 'https://afresearchlab.com/technology/skyborg/' },
  { title: 'Project Maven – background (DoD AI/ML in ISR)', url: 'https://www.ai.mil/aw_cft.html' },
  { title: 'Joint Publication 3-0 Operations (overview page)', url: 'https://www.jcs.mil/Doctrine/Joint-Doctrine-Pubs/3-0-Operations/' },
  { title: 'NATO – Data Exploitation Framework (AI-enabler)', url: 'https://www.nato.int/cps/en/natohq/official_texts_187709.htm' },
  { title: 'US Navy – Unmanned Campaign Framework', url: 'https://www.navy.mil/Portals/1/Documents/2021%20Unmanned%20Campaign_Final.pdf' },
  { title: 'US Army – Multi-Domain Operations 2028 (concept paper)', url: 'https://api.army.mil/e2/c/downloads/2021/02/19/0e0a69cf/mdo-2028.pdf' },
  { title: 'NATO – Autonomy implementation state of play', url: 'https://www.act.nato.int/article/autonomy-implementation-state-of-play/' },
  { title: 'DoD – Algorithmic Warfare Cross-Functional Team (overview)', url: 'https://www.ai.mil/algorithmic_warfare.html' },
  { title: 'USCYBERCOM – Vision (as related to information advantage)', url: 'https://www.cybercom.mil/About/Vision-and-Mission/' },
  { title: 'JAIC (historical archive) – Joint AI Center resources', url: 'https://www.ai.mil/jaic.html' },
];


