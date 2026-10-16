import { useState } from 'react';

// Same contract as the foundation diagram: one viewBox for the graphics, real
// HTML for the caption, and interactive elements only on the stage.
// Matches the box the slide leaves, so the stages use the full height available.
const VIEW = { w: 1728, h: 515 };

const stages: { label: string; sub: string; note: string }[] = [
  { label: 'Fontes', sub: 'onde o dado nasce', note: 'ERP, CRM, planilhas, site, sensores: cada sistema guarda um pedaço da realidade, em formato próprio e com regras próprias.' },
  { label: 'Integração', sub: 'extrair, transformar, carregar', note: 'Os dados são extraídos de cada fonte, limpos, padronizados e reconciliados — é aqui que "cliente", "CLIENTE" e "Cliente Ltda" viram a mesma coisa.' },
  { label: 'Base única', sub: 'o repositório central', note: 'Um data warehouse guarda a versão oficial dos dados, já organizada para análise. Todo mundo passa a discutir o mesmo número.' },
  { label: 'Análise', sub: 'do registro ao indicador', note: 'Agregações, séries no tempo e comparações transformam milhões de registros em poucos indicadores com significado.' },
  { label: 'Painel', sub: 'o que a pessoa vê', note: 'O painel mostra só os indicadores que importam para quem decide, atualizados, no nível de detalhe daquela pessoa.' },
];

const BOX_W = 300, BOX_H = 268, GAP = 57, TOP = 84;
const boxX = (i: number) => i * (BOX_W + GAP);

export function BiPipeline({ interactive = false }: { interactive?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const caption = active !== null
    ? stages[active]!.note
    : `O dado atravessa cinco etapas antes de virar uma informação que alguém consegue usar.${interactive ? ' Percorra as etapas.' : ''}`;

  return (
    <div className="bi-pipeline">
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img"
        aria-label="Cinco etapas do Business Intelligence: fontes, integração, base única, análise e painel">
        {stages.slice(0, -1).map((stage, i) => (
          <path key={stage.label} className="bi-arrow"
            d={`M${boxX(i) + BOX_W + 8} ${TOP + BOX_H / 2} H${boxX(i + 1) - 20}`} />
        ))}
        {stages.slice(0, -1).map((stage, i) => (
          <path key={`h${stage.label}`} className="bi-arrow"
            d={`M${boxX(i + 1) - 14} ${TOP + BOX_H / 2} l-16 -10 M${boxX(i + 1) - 14} ${TOP + BOX_H / 2} l-16 10`} />
        ))}
        {stages.map(({ label, sub }, i) => (
          <g key={label} className={`bi-stage ${interactive ? 'is-live' : ''} ${active === i ? 'is-on' : ''}`}
            {...(interactive ? {
              tabIndex: 0, role: 'button', 'aria-label': `Etapa ${i + 1}: ${label}`,
              onMouseEnter: () => setActive(i), onMouseLeave: () => setActive(null),
              onFocus: () => setActive(i), onBlur: () => setActive(null),
              onClick: () => setActive(active === i ? null : i),
            } : {})}>
            <rect x={boxX(i)} y={TOP} width={BOX_W} height={BOX_H} rx={12} />
            <text className="bi-step" x={boxX(i) + 26} y={TOP + 56}>{String(i + 1).padStart(2, '0')}</text>
            <text className="bi-label" x={boxX(i) + BOX_W / 2} y={TOP + 150} textAnchor="middle">{label}</text>
            <text className="bi-sub" x={boxX(i) + BOX_W / 2} y={TOP + 198} textAnchor="middle">{sub}</text>
          </g>
        ))}
        <text className="bi-axis" x={0} y={TOP + BOX_H + 62}>DADO BRUTO</text>
        <text className="bi-axis" x={VIEW.w} y={TOP + BOX_H + 62} textAnchor="end">DECISÃO INFORMADA</text>
        <path className="bi-axis-line" d={`M0 ${TOP + BOX_H + 26} H${VIEW.w}`} />
      </svg>
      <p className="bi-caption">{caption}</p>
    </div>
  );
}
