import { sources } from '../data/sources';
import i18n from '../i18n';

export default function Sources(): JSX.Element {
  const tr = (da: string, en: string) => (i18n.language.startsWith('en') ? en : da);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6" id="kilder">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          {tr('Kilder','Sources')}
        </h2>
        <p className="text-slate-400 mb-6">
          {tr('Alle tilgængelige, klikbare kilder. Senest opdateret: ','All available, clickable sources. Last updated: ')}
          <span className="text-slate-300">august 2025</span>.
        </p>
        <ul className="grid gap-3 sm:gap-4">
          {sources.map((s, i) => (
            <li key={i} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


