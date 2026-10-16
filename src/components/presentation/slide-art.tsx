// Drawn figures for the authored slides, so they carry the same visual weight as
// the imported ones without pulling third-party images into the repository.
// The viewBox matches the proportion of the column the slide design leaves them.
export type ArtKind = 'bi-lente' | 'bi-indicador' | 'bi-fronteira' | 'fecho-arco' | 'fecho-rota';

export const slideArt: Record<string, ArtKind> = {
  'bi-o-que-e': 'bi-lente',
  'bi-indicador': 'bi-indicador',
  'bi-fronteira': 'bi-fronteira',
  'fecho-sintese': 'fecho-arco',
  'fecho-decisao': 'fecho-rota',
};

const VIEW = '0 0 520 460';

const scatter = [
  [16, 58], [74, 40], [122, 74], [30, 118], [92, 104], [140, 146], [20, 186], [80, 176], [132, 222],
  [26, 256], [96, 248], [138, 300], [18, 330], [78, 338], [126, 382], [34, 404],
];

function Art({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case 'bi-lente':
      // Scattered records pass through one lens and come out as a readable panel.
      return <svg viewBox={VIEW} role="img" aria-label="Dados dispersos atravessam uma lente e saem como um painel de indicadores">
        {scatter.map(([x, y], i) => <circle key={i} className="art-dot" cx={x} cy={y} r={9} />)}
        <path className="art-lens" d="M212 46 Q300 230 212 414 Q124 230 212 46 Z" />
        <rect className="art-panel" x={302} y={78} width={206} height={304} rx={12} />
        <rect className="art-rule" x={326} y={110} width={118} height={14} rx={7} />
        <rect className="art-bar" x={326} y={268} width={32} height={78} />
        <rect className="art-bar" x={370} y={222} width={32} height={124} />
        <rect className="art-bar" x={414} y={180} width={32} height={166} />
        <rect className="art-bar" x={458} y={244} width={32} height={102} />
      </svg>;
    case 'bi-indicador':
      // A single indicator with its target line and the series that crosses it.
      return <svg viewBox={VIEW} role="img" aria-label="Um indicador com valor, meta e série ao longo do tempo">
        <rect className="art-panel" x={14} y={34} width={492} height={392} rx={14} />
        <rect className="art-rule" x={46} y={70} width={176} height={15} rx={7} />
        <text className="art-figure" x={46} y={166}>87%</text>
        <path className="art-target" d="M46 232 H476" />
        <text className="art-tag" x={404} y={218}>meta</text>
        <path className="art-line" d="M46 378 L132 330 L218 346 L304 274 L390 292 L476 198" />
        {[[132, 330], [218, 346], [304, 274], [390, 292], [476, 198]].map(([x, y], i) => <circle key={i} className="art-dot-on" cx={x} cy={y} r={10} />)}
      </svg>;
    case 'bi-fronteira':
      // One panel looks back at what happened, the other forward at what could.
      return <svg viewBox={VIEW} role="img" aria-label="Um painel mostra o que aconteceu e o outro os caminhos possíveis">
        <rect className="art-panel" x={14} y={28} width={492} height={182} rx={12} />
        <text className="art-tag" x={40} y={70}>BI</text>
        <path className="art-line" d="M44 176 L142 136 L240 152 L356 96 L470 70" />
        {[[142, 136], [240, 152], [356, 96]].map(([x, y], i) => <circle key={i} className="art-dot-on" cx={x} cy={y} r={9} />)}
        <rect className="art-panel art-panel-alt" x={14} y={250} width={492} height={182} rx={12} />
        <text className="art-tag art-tag-alt" x={40} y={292}>SAD</text>
        <path className="art-fork" d="M44 398 L188 348 L470 290 M188 348 L470 348 M188 348 L400 414" />
        {[[470, 290], [470, 348], [400, 414]].map(([x, y], i) => <circle key={i} className="art-dot-alt" cx={x} cy={y} r={11} />)}
      </svg>;
    case 'fecho-arco':
      // The three chapters as one chain, each feeding the next.
      return <svg viewBox={VIEW} role="img" aria-label="Os três assuntos encadeados: IA, aprendizado de máquina e BI com apoio à decisão">
        {([[72, 'IA', false], [230, 'ML', false], [388, 'BI', true]] as const).map(([cy, label, alt]) => <g key={label}>
          <circle className={alt ? 'art-ring art-ring-alt' : 'art-ring'} cx={260} cy={cy} r={64} />
          <text className={alt ? 'art-tag art-tag-alt' : 'art-tag'} x={260} y={cy + 14} textAnchor="middle">{label}</text>
        </g>)}
        {[136, 294].map(y => <g key={y}>
          <path className="art-arrow-line" d={`M260 ${y} V ${y + 30}`} />
          <path className="art-arrow" d={`M260 ${y + 30} l-11 -13 M260 ${y + 30} l11 -13`} />
        </g>)}
      </svg>;
    case 'fecho-rota':
      // Back to the route the decision chapter opened with, now with its destination.
      return <svg viewBox={VIEW} role="img" aria-label="Uma rota que sobe e termina em um marcador de destino">
        <path className="art-route" d="M58 414 C150 414 128 322 206 310 C286 298 268 204 350 196 C404 190 424 216 440 240" />
        <circle className="art-dot-on" cx={58} cy={414} r={15} />
        <path className="art-pin" d="M400 112 a46 46 0 1 1 92 0 c0 34 -46 94 -46 94 s-46 -60 -46 -94 Z" />
        <circle className="art-pin-eye" cx={446} cy={110} r={18} />
      </svg>;
  }
}

export function SlideArt({ id }: { id: string }) {
  const kind = slideArt[id];
  if (!kind) return null;
  return <div className="slide-art"><Art kind={kind} /></div>;
}
