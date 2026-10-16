import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Copy, Grid2X2, Maximize, Menu, PanelLeftClose, Play, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScaledSlide, SlideLayout } from '@/components/presentation/scaled-slide';
import { chapters, clampSlide, slides } from '@/lib/presentation';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { slide?: number; print?: boolean } => ({ slide: clampSlide(Number(search['slide'] ?? 1) - 1) + 1, print: search['print'] === true || search['print'] === 'true' || search['print'] === '' }),
  head: () => ({ meta: [
    { title: 'Inteligência Artificial e Bussines Inteligence | Disciplina' },
    { name: 'description', content: 'Disciplina de Inteligência Artificial e Bussines Inteligence: Machine Learning, BI e Sistemas de Apoio à Decisão, com figuras e referências originais.' },
    { property: 'og:title', content: 'Inteligência Artificial e Bussines Inteligence' },
    { property: 'og:description', content: 'Apresentação da disciplina com inteligência artificial, aprendizado de máquina, BI e apoio à decisão.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Presentation,
});

function Presentation() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const index = clampSlide((search.slide ?? 1) - 1);
  const current = slides[index];
  const [sidebar, setSidebar] = useState(true);
  const [overview, setOverview] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<number | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const go = useCallback((n: number) => { void navigate({ search: { slide: clampSlide(n) + 1, print: false }, replace: true }); }, [navigate]);
  const exit = useCallback(() => { setPresenting(false); if (document.fullscreenElement) void document.exitFullscreen().catch(() => {}); }, []);
  const present = useCallback(() => { setOverview(false); setPresenting(true); void document.documentElement.requestFullscreen?.().catch(() => {}); }, []);
  const wakeControls = useCallback(() => { setControlsVisible(true); if (idleTimer.current) clearTimeout(idleTimer.current); idleTimer.current = setTimeout(() => setControlsVisible(false), 2500); }, []);
  useEffect(() => { if (presenting) wakeControls(); return () => { if (idleTimer.current) clearTimeout(idleTimer.current); }; }, [presenting, wakeControls]);

  useEffect(() => { if (window.innerWidth < 640) setSidebar(false); }, []);
  useEffect(() => { if (current) document.title = `${index + 1}/${slides.length} — ${current.title || current.section}`; }, [index, current]);
  useEffect(() => {
    const active = thumbs.current?.querySelector('[data-active="true"]');
    if (active instanceof HTMLElement) active.scrollIntoView({ block: 'nearest' });
  }, [index, sidebar]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
      if (e.key.toLowerCase() === 'g' && !presenting) setOverview(v => !v);
      if (e.key === 'F5') { e.preventDefault(); present(); }
      if (e.key === 'Escape') { exit(); setOverview(false); }
    };
    window.addEventListener('keydown', handler);
    const fullscreen = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener('fullscreenchange', fullscreen);
    return () => { window.removeEventListener('keydown', handler); document.removeEventListener('fullscreenchange', fullscreen); };
  }, [index, go, present, presenting, exit]);
  const swipe = (end: number) => { if (touchStart.current !== null && Math.abs(end - touchStart.current) > 55) go(index + (end < touchStart.current ? 1 : -1)); touchStart.current = null; };
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const print = async () => {
    await navigate({ search: { slide: index + 1, print: true }, replace: true });
    await document.fonts.ready;
    await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>('.print-deck img')).map(image => image.decode().catch(() => {})));
    window.print();
  };
  if (!current) return null;

  return <>
    <div className="deck-app">
      <header className="deck-toolbar">
        <div className="deck-brand"><span className="brand-symbol"><BookOpen size={20}/></span><div><div className="brand-title">Inteligência Artificial & BI</div><div className="brand-subtitle">MACHINE LEARNING · APOIO À DECISÃO</div></div></div>
        <div className="toolbar-actions">
          <Button variant="ghost" size="icon" title={sidebar ? 'Ocultar miniaturas' : 'Mostrar miniaturas'} aria-label="Alternar miniaturas" onClick={() => setSidebar(v => !v)}>{sidebar ? <PanelLeftClose/> : <Menu/>}</Button>
          <Button variant={overview ? 'secondary' : 'ghost'} size="icon" title="Visão geral" aria-label="Visão geral" onClick={() => setOverview(v => !v)}><Grid2X2/></Button>
          <span className="toolbar-divider"/>
          <Button variant="ghost" size="icon" title="Copiar link deste slide" aria-label="Copiar link deste slide" onClick={copy}>{copied ? <Check/> : <Copy/>}</Button>
          <Button variant="ghost" size="icon" className="toolbar-secondary" title="Imprimir ou salvar em PDF" aria-label="Imprimir apresentação" onClick={print}><Printer/></Button>
          <Button onClick={present} title="Apresentar em tela cheia"><Play/><span className="present-label">Apresentar</span></Button>
        </div>
      </header>
      <div className="deck-workspace">
        {sidebar && <aside className="deck-sidebar">
          <div className="sidebar-heading"><span>Conteúdo</span><span>{slides.length} slides</span></div>
          <nav className="chapter-list" aria-label="Assuntos">{chapters.map(ch => <Button key={ch.number} variant={index >= ch.start && index <= ch.end ? 'secondary' : 'ghost'} className="chapter-button" onClick={() => { go(ch.start); setOverview(false); }}><span className="chapter-number">{ch.number}</span>{ch.short}</Button>)}</nav>
          <div className="thumbnail-list" ref={thumbs}>{slides.map((slide, n) => <Button key={slide.id} variant="ghost" className="thumbnail-button" data-active={index === n} aria-label={`Ir ao slide ${n + 1}: ${slide.title || slide.section}`} onClick={() => { go(n); setOverview(false); if (window.innerWidth < 640) setSidebar(false); }}><div className="thumb-frame"><ScaledSlide index={n}/></div><div className="thumb-caption"><span>{String(n + 1).padStart(2, '0')}</span><span>{slide.title || slide.section}</span></div></Button>)}</div>
        </aside>}
        {overview ? <section className="overview"><div className="overview-header"><h1>Visão geral <span className="text-muted-foreground text-sm font-normal">/ {slides.length} slides</span></h1><input className="overview-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar no conteúdo" aria-label="Buscar slides"/></div><div className="overview-grid">{slides.map((slide, n) => ({ slide, n })).filter(({ slide }) => `${slide.title} ${slide.section} ${slide.paragraphs.join(' ')}`.toLowerCase().includes(query.toLowerCase())).map(({ slide, n }) => <Button variant="ghost" className="overview-item" key={slide.id} aria-label={`Abrir slide ${n + 1}`} onClick={() => { go(n); setOverview(false); }}><div className="thumb-frame"><ScaledSlide index={n}/></div><div className="thumb-caption"><span>{n + 1}</span><span>{slide.title || slide.section}</span></div></Button>)}</div></section> : <main className="deck-stage">
          <div className="stage-heading"><div><div className="stage-kicker">{current.section}</div><div className="stage-title">{current.title || current.section}</div></div><span className="stage-origin">{current.cover ? 'Capa da disciplina' : current.transition ? 'Conexão entre assuntos' : current.source ? `${current.source} · ${current.original}` : 'Slide adicional'}</span></div>
          <div className="canvas-area" onTouchStart={e => { touchStart.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={e => { const x = e.changedTouches[0]?.clientX; if (x !== undefined) swipe(x); }}><div className="canvas-sheet"><ScaledSlide index={index} interactive/></div></div>
          {current.links.length > 0 && <nav className="external-links" aria-label="Links deste slide">{current.links.map(link => <Button asChild variant="outline" key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" title={link.url}><Play/>{link.label === 'Vídeo externo' ? 'Assistir ao vídeo' : link.label === 'Link original' ? 'Abrir referência' : link.label}</a></Button>)}</nav>}
          <footer className="stage-footer"><span className="footer-chapter">{[current.cover ? 'Capa' : current.transition ? 'Conexão' : chapters.find(ch => index >= ch.start && index <= ch.end)?.number ? `${chapters.find(ch => index >= ch.start && index <= ch.end)?.number} / 03` : null, current.section].filter(Boolean).join(' · ')}</span><div className="slide-navigation"><Button variant="ghost" size="icon" aria-label="Slide anterior" title="Slide anterior" disabled={index === 0} onClick={() => go(index - 1)}><ChevronLeft/></Button><span className="slide-counter">{String(index + 1).padStart(2, '0')} <span className="text-muted-foreground">/ {slides.length}</span></span><Button variant="ghost" size="icon" aria-label="Próximo slide" title="Próximo slide" disabled={index === slides.length - 1} onClick={() => go(index + 1)}><ChevronRight/></Button></div><Button variant="ghost" size="icon" title="Tela cheia" aria-label="Tela cheia" onClick={present}><Maximize/></Button></footer>
          <div className="deck-progress"><div className="deck-progress-fill" style={{ width: `${(index + 1) / slides.length * 100}%` }}/></div>
        </main>}
      </div>
    </div>
    {presenting && <div className={`presentation-mode ${controlsVisible ? 'controls-awake' : 'controls-idle'}`} onPointerMove={wakeControls} onTouchStart={e => { wakeControls(); touchStart.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={e => { const x = e.changedTouches[0]?.clientX; if (x !== undefined) swipe(x); }}><div className="presentation-canvas"><ScaledSlide index={index} interactive/></div><div className="presentation-controls"><Button variant="ghost" size="icon" disabled={index === 0} aria-label="Anterior em tela cheia" onClick={() => go(index - 1)}><ArrowLeft/></Button><span className="slide-counter">{index + 1} / {slides.length}</span><Button variant="ghost" size="icon" disabled={index === slides.length - 1} aria-label="Próximo em tela cheia" onClick={() => go(index + 1)}><ArrowRight/></Button>{current.links.map(link => <Button asChild variant="outline" size="icon" key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" title={link.url} aria-label="Abrir link externo"><Play/></a></Button>)}<Button variant="ghost" size="icon" aria-label="Sair da apresentação" title="Sair da apresentação" onClick={exit}><X/></Button></div></div>}
    <div className="print-deck">{slides.map((slide, n) => <div key={slide.id} className="print-page"><SlideLayout slide={slide} index={n}/></div>)}</div>
  </>;
}
