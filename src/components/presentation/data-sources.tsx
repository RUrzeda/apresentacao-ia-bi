import { ArrowUpRight } from 'lucide-react';

export type DataSource = { name: string; domain: string; url: string; note: string; art: 'kaggle' | 'brasil' | 'busca' | 'academico' | 'modelos' | 'estatistica' };

// Free, no-login-required sources a student can open in class.
export const dataSources: DataSource[] = [
  { name: 'Kaggle', domain: 'kaggle.com', url: 'https://www.kaggle.com/', note: 'Milhares de conjuntos prontos, com notebooks e competições.', art: 'kaggle' },
  { name: 'Dados Abertos', domain: 'dados.gov.br', url: 'https://dados.gov.br/', note: 'Portal brasileiro de dados públicos do governo federal.', art: 'brasil' },
  { name: 'IBGE', domain: 'sidra.ibge.gov.br', url: 'https://sidra.ibge.gov.br/', note: 'Estatísticas oficiais do Brasil: população, renda, produção.', art: 'estatistica' },
  { name: 'Dataset Search', domain: 'datasetsearch.research.google.com', url: 'https://datasetsearch.research.google.com/', note: 'Busca do Google que encontra conjuntos em toda a web.', art: 'busca' },
  { name: 'UCI ML Repository', domain: 'archive.ics.uci.edu', url: 'https://archive.ics.uci.edu/', note: 'Clássicos do aprendizado de máquina, usados em artigos há décadas.', art: 'academico' },
  { name: 'Hugging Face', domain: 'huggingface.co/datasets', url: 'https://huggingface.co/datasets', note: 'Conjuntos de texto, imagem e áudio usados para treinar modelos.', art: 'modelos' },
];

// Each tile carries its own mark so the grid reads as one system and nothing
// depends on third-party logo files.
function Art({ kind }: { kind: DataSource['art'] }) {
  return <svg className="source-art" viewBox="0 0 120 80" aria-hidden="true">
    {kind === 'kaggle' && <>
      {[0, 1, 2, 3].map(i => <rect key={i} x={22 + i * 20} y={54 - i * 12} width={13} height={10 + i * 12} rx={2} />)}
    </>}
    {kind === 'brasil' && <>
      <circle cx={60} cy={40} r={26} className="art-ring" />
      <path d="M34 40 h52 M60 14 v52 M40 22 q20 18 40 36 M80 22 q-20 18 -40 36" className="art-line" />
    </>}
    {kind === 'estatistica' && <>
      <path d="M26 58 L46 38 L62 48 L94 20" className="art-line" />
      <circle cx={46} cy={38} r={4} /><circle cx={62} cy={48} r={4} /><circle cx={94} cy={20} r={4} />
    </>}
    {kind === 'busca' && <>
      <circle cx={54} cy={36} r={20} className="art-ring" />
      <path d="M69 51 L92 66" className="art-line" />
    </>}
    {kind === 'academico' && <>
      <path d="M60 18 L96 34 L60 50 L24 34 Z" />
      <path d="M36 41 v16 q24 12 48 0 v-16" className="art-line" />
    </>}
    {kind === 'modelos' && <>
      <circle cx={34} cy={24} r={7} /><circle cx={34} cy={56} r={7} /><circle cx={86} cy={40} r={9} />
      <circle cx={60} cy={40} r={7} />
      <path d="M41 26 L54 38 M41 54 L54 42 M67 40 L77 40" className="art-line" />
    </>}
  </svg>;
}

// Thumbnails and the overview wrap slides in a button, where a nested <a> is
// invalid; the stage and the print sheet get real links.
export function DataSources({ linkable = true }: { linkable?: boolean }) {
  return <div className="source-grid">
    {dataSources.map(source => {
      const inner = <>
        <Art kind={source.art} />
        <span className="source-name">{source.name}{linkable && <ArrowUpRight size={26} />}</span>
        <span className="source-note">{source.note}</span>
        <span className="source-domain">{source.domain}</span>
      </>;
      return linkable
        ? <a className="source-card" key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" title={source.url}>{inner}</a>
        : <div className="source-card" key={source.url}>{inner}</div>;
    })}
  </div>;
}
