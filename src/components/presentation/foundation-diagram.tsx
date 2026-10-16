import { useState } from 'react';

// The graphics live in one viewBox so they scale with the same 1920x1080
// ScaledSlide transform as every other slide; the tabs and caption stay real
// HTML so they keep the deck's typography and stay keyboard reachable.
// The viewBox matches the box the slide leaves for it, so the drawing fills the
// full width instead of being letterboxed down by preserveAspectRatio.
const VIEW = { w: 1728, h: 430 };

type Mode = 'tarefa' | 'fundacao';

const sources = ['Texto', 'Imagens', 'Código', 'Áudio', 'Vídeo', 'Dados tabulares'];

const tasks: { label: string; note: string }[] = [
  { label: 'Perguntas e respostas', note: 'A mesma base responde perguntas sem treino específico: basta descrever a tarefa no prompt.' },
  { label: 'Resumo', note: 'Resumir é pedir uma reescrita mais curta — nenhum conjunto rotulado de resumos é necessário.' },
  { label: 'Tradução', note: 'A tradução emerge do pré-treino multilíngue, não de pares de frases traduzidas rotuladas.' },
  { label: 'Geração de imagem', note: 'O pré-treino sobre pares de imagem e texto permite gerar imagens a partir de descrições.' },
  { label: 'Programação', note: 'O código visto no pré-treino vira sugestão e completação, afinadas por ajuste fino.' },
  { label: 'Classificação', note: 'Com poucos exemplos, ou nenhum, o modelo separa as classes que você definir.' },
];

const CHIP_H = 54, CHIP_GAP = 11, TOP = 46;
const COL_H = sources.length * CHIP_H + (sources.length - 1) * CHIP_GAP;
const chipY = (i: number) => TOP + i * (CHIP_H + CHIP_GAP);
const chipMid = (i: number) => chipY(i) + CHIP_H / 2;

const LEFT_X = 0, LEFT_W = 290;
const CORE_X = 624, CORE_W = 480, CORE_H = 200;
const CORE_Y = TOP + COL_H / 2 - CORE_H / 2;
const RIGHT_X = VIEW.w - 340, RIGHT_W = 340;
const CORE_MID = CORE_Y + CORE_H / 2;

// One labelled dataset -> one model -> one task, repeated for every task.
const legacyRows = [
  { data: 'Textos rotulados', model: 'Modelo A', task: 'Resumo' },
  { data: 'Imagens rotuladas', model: 'Modelo B', task: 'Classificação' },
  { data: 'Pares traduzidos', model: 'Modelo C', task: 'Tradução' },
];

function curve(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// Thumbnails and the print sheet render this inside a <button>, so the controls
// only become real interactive elements on the stage.
export function FoundationDiagram({ interactive = false }: { interactive?: boolean }) {
  const [mode, setMode] = useState<Mode>('fundacao');
  const [active, setActive] = useState<number | null>(null);
  const pick = (next: Mode) => { setMode(next); setActive(null); };
  const caption = mode === 'tarefa'
    ? 'Cada tarefa exige seu próprio conjunto rotulado e seu próprio treino. Nada do que um modelo aprendeu é reaproveitado pelos outros.'
    : active !== null
      ? tasks[active]!.note
      : `Um único pré-treino, sem rótulos, concentra o custo. Cada tarefa vem depois por adaptação — ajuste fino ou prompt.${interactive ? ' Percorra as tarefas à direita.' : ''}`;

  return (
    <div className="fm-diagram">
      <div className="fm-tabs" {...(interactive ? { role: 'tablist', 'aria-label': 'Como as tarefas são obtidas' } : {})}>
        {([['tarefa', 'Um modelo por tarefa'], ['fundacao', 'Modelo de fundação']] as const).map(([value, label]) => {
          const className = `fm-tab ${mode === value ? 'is-on' : ''}`;
          return interactive
            ? <button key={value} type="button" role="tab" aria-selected={mode === value} className={className}
                onClick={() => pick(value)} onMouseEnter={() => pick(value)}>{label}</button>
            : <span key={value} className={className}>{label}</span>;
        })}
      </div>

      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img"
        aria-label={mode === 'fundacao'
          ? 'Dados não rotulados de vários tipos convergem para um único modelo de fundação, do qual saem seis tarefas obtidas por adaptação'
          : 'Três conjuntos rotulados distintos treinam três modelos separados, cada um resolvendo uma única tarefa'}>

        {mode === 'fundacao' ? <>
          <g className="fm-links">
            {sources.map((label, i) => <path key={label} d={curve(LEFT_W, chipMid(i), CORE_X, CORE_MID)} />)}
            {tasks.map(({ label }, i) => (
              <path key={label} className={active === i ? 'is-on' : active === null ? '' : 'is-off'}
                d={curve(CORE_X + CORE_W, CORE_MID, RIGHT_X, chipMid(i))} />
            ))}
          </g>

          <text className="fm-col-head" x={LEFT_X} y={TOP - 18}>DADOS NÃO ROTULADOS</text>
          {sources.map((label, i) => (
            <g key={label} className="fm-chip">
              <rect x={LEFT_X} y={chipY(i)} width={LEFT_W} height={CHIP_H} rx={8} />
              <text x={LEFT_X + LEFT_W / 2} y={chipMid(i) + 9} textAnchor="middle">{label}</text>
            </g>
          ))}

          <g className="fm-core">
            <rect x={CORE_X} y={CORE_Y} width={CORE_W} height={CORE_H} rx={16} />
            <text className="fm-core-title" x={CORE_X + CORE_W / 2} y={CORE_Y + 78} textAnchor="middle">Modelo de fundação</text>
            <text className="fm-core-sub" x={CORE_X + CORE_W / 2} y={CORE_Y + 124} textAnchor="middle">um único pré-treino,</text>
            <text className="fm-core-sub" x={CORE_X + CORE_W / 2} y={CORE_Y + 162} textAnchor="middle">em escala, sem rótulos</text>
          </g>

          <text className="fm-col-head" x={RIGHT_X + RIGHT_W} y={TOP - 18} textAnchor="end">TAREFAS POR ADAPTAÇÃO</text>
          {tasks.map(({ label }, i) => (
            <g key={label} className={`fm-chip ${interactive ? 'fm-task' : ''} ${active === i ? 'is-on' : ''}`}
              {...(interactive ? {
                tabIndex: 0, role: 'button', 'aria-label': `Tarefa: ${label}`,
                onMouseEnter: () => setActive(i), onMouseLeave: () => setActive(null),
                onFocus: () => setActive(i), onBlur: () => setActive(null),
                onClick: () => setActive(active === i ? null : i),
              } : {})}>
              <rect x={RIGHT_X} y={chipY(i)} width={RIGHT_W} height={CHIP_H} rx={8} />
              <text x={RIGHT_X + RIGHT_W / 2} y={chipMid(i) + 9} textAnchor="middle">{label}</text>
            </g>
          ))}
        </> : <g className="fm-legacy">
          {legacyRows.map((row, i) => {
            const y = TOP + 16 + i * 122, mid = y + 38;
            return <g key={row.model}>
              <path className="fm-legacy-link" d={curve(360, mid, 650, mid)} />
              <path className="fm-legacy-link" d={curve(1010, mid, 1300, mid)} />
              <g className="fm-chip fm-chip-muted">
                <rect x={30} y={y} width={330} height={76} rx={8} />
                <text x={195} y={mid + 9} textAnchor="middle">{row.data}</text>
              </g>
              <g className="fm-chip fm-chip-model">
                <rect x={650} y={y} width={360} height={76} rx={12} />
                <text x={830} y={mid + 9} textAnchor="middle">{row.model}</text>
              </g>
              <g className="fm-chip">
                <rect x={1300} y={y} width={398} height={76} rx={8} />
                <text x={1499} y={mid + 9} textAnchor="middle">{row.task}</text>
              </g>
            </g>;
          })}
        </g>}
      </svg>

      <p className="fm-caption">{caption}</p>
    </div>
  );
}
