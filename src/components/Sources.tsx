import React from 'react';

export default function Sources(): JSX.Element {
  const sources: { title: string; link?: string }[] = [
    { title: 'DARPA reports on mosaic warfare', link: 'https://www.darpa.mil/' },
    { title: 'US DoD Joint All-Domain Command & Control (JADC2)' },
    { title: 'War on the Rocks – Auftragstaktik og AI' },
    { title: 'RAND – Human–Machine Teaming' },
    { title: 'Chinese and Russian white papers on AI-enabled C2' },
    { title: 'Project Maven' },
    { title: 'AI-2027 (inspirationskilde)', link: 'https://ai-2027.com/' },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6" id="kilder">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Kilder
        </h2>
        <p className="text-slate-400 mb-6">
          Et udvalg af de vigtigste kilder, der har informeret fortællingen. Den fulde liste kan deles som bilag.
        </p>
        <ul className="grid gap-3 sm:gap-4">
          {sources.map((s, i) => (
            <li key={i} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              {s.link ? (
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                  {s.title}
                </a>
              ) : (
                <span className="text-slate-200">{s.title}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


