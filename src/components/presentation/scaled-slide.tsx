import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type DeckSlide, slides } from '@/lib/presentation';
import { algorithmColumns, figureBounds } from '@/lib/slide-layout';
import { blockTexts, getSlideDesign, type CopyBlock, type SlideDesign } from '@/lib/slide-design';
import { FoundationDiagram } from '@/components/presentation/foundation-diagram';
import { DataSources } from '@/components/presentation/data-sources';
import { BiPipeline } from '@/components/presentation/bi-pipeline';
import { SlideArt } from '@/components/presentation/slide-art';

function OriginalFigures({ slide }: { slide: DeckSlide }) {
  const { left, top, width, height } = figureBounds(slide);
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [slide.id]);
  const scale = Math.min(size.width / width, size.height / height);
  return <div ref={ref} className="figure-fit"><div className="original-figures" style={{ width: width * scale, height: height * scale }}>
    {slide.images.map((im, n) => <img key={n} src={im.url} alt={`Figura original ${n + 1}`} draggable={false} style={{ left: (im.x - left) * scale, top: (im.y - top) * scale, width: im.w * scale, height: im.h * scale }} />)}
  </div></div>;
}

function RichText({ slide, text }: { slide: DeckSlide; text: string }) {
  return <>{Array.from(text).map((char, i) => slide.icons?.[char]
    ? <img className="original-inline-icon" src={slide.icons[char]} alt="" key={i}/>
    : char)}</>;
}

function LabeledText({ slide, text }: { slide: DeckSlide; text: string }) {
  const separator = slide.id === 'slide02-10' ? text.indexOf('=') : text.indexOf(':');
  const labeled = ['slide02-2', 'slide02-10', 'slides03-3', 'slides03-6'].includes(slide.id);
  if (!labeled || separator < 0) return <RichText slide={slide} text={text}/>;
  return <><strong className="inline-topic"><RichText slide={slide} text={text.slice(0, separator + 1)}/></strong><RichText slide={slide} text={text.slice(separator + 1)}/></>;
}

function CopySection({ slide, block }: { slide: DeckSlide; block: CopyBlock }) {
  const texts = blockTexts(slide, block);
  if (slide.id === 'slide01-6' && block.indices[0] === 2) return <div className="copy-block"><p className="slide-body"><RichText slide={slide} text={texts.join('')}/></p></div>;
  if (block.kind === 'list') return <ul className="semantic-list">{texts.map((text, i) => <li className="slide-body" key={i}><LabeledText slide={slide} text={text}/></li>)}</ul>;
  if (block.kind === 'topic') return <h2 className="slide-topic">{texts.map((text, i) => <span key={i}><RichText slide={slide} text={text}/></span>)}</h2>;
  if (block.kind === 'quote') return <div className="slide-statement"><p className="slide-body"><RichText slide={slide} text={texts.join(' ')}/></p></div>;
  // The four tactical topics are separate in the original PDF, despite extraction as one paragraph.
  if (slide.id === 'slides03-10' && block.indices[0] === 0) return <div className="tactical-topics">{texts.map((text, i) => {
    const colon = text.indexOf(':');
    return <section key={i}><h2 className="slide-topic"><RichText slide={slide} text={text.slice(0, colon + 1)}/></h2><p className="slide-body"><RichText slide={slide} text={text.slice(colon + 1)}/></p></section>;
  })}</div>;
  return <div className={`copy-block ${block.kind === 'note' ? 'slide-note' : ''}`}>{texts.map((text, i) => <p className="slide-body" key={i}><LabeledText slide={slide} text={text}/></p>)}</div>;
}

function DesignedFigures({ slide, design }: { slide: DeckSlide; design: SlideDesign }) {
  if (design.figures === 'art') return <SlideArt id={slide.id}/>;
  if (design.figures === 'original') return <OriginalFigures slide={slide}/>;
  const images = [...slide.images].sort((a, b) => Math.abs(a.y - b.y) < 1 ? a.x - b.x : a.y - b.y);
  return <div className={`designed-figures figures-${design.figures} figures-count-${images.length}`}>{images.map((image, i) => <div className="figure-cell" key={image.url}><img src={image.url} alt={`Figura original ${i + 1}`} draggable={false}/></div>)}</div>;
}

function Comparison({ slide, design }: { slide: DeckSlide; design: SlideDesign }) {
  if (slide.id === 'slide01-6') return <div className="comparison-copy"><CopySection slide={slide} block={design.blocks[0] ?? {kind:'body',indices:[]}}/><CopySection slide={slide} block={design.blocks[1] ?? {kind:'body',indices:[]}}/><div className="comparison-panes">{design.blocks.slice(2).map((block, i) => <section className="comparison-pane" key={i}><CopySection slide={slide} block={block}/></section>)}</div></div>;
  const pairs = slide.id === 'slide02-13' ? [design.blocks.slice(0, 2), design.blocks.slice(2)] : design.blocks.map(block => [block]);
  return <div className="comparison-panes">{pairs.map((blocks, i) => <section className="comparison-pane" key={i}>{blocks.map((block, n) => <CopySection slide={slide} block={block} key={n}/>)}{slide.images[i] && <div className="paired-figure"><img src={slide.images[i]?.url} alt={`Figura original ${i + 1}`}/></div>}</section>)}</div>;
}

// `interactive` turns on hover/click controls; `linkable` says anchors are legal here.
// Thumbnails and the overview wrap slides in a button, where a nested <a> is invalid;
// the print sheet does not, so it keeps real links.
export function SlideLayout({ slide, index, interactive = false, linkable = true }: { slide: DeckSlide; index: number; interactive?: boolean; linkable?: boolean }) {
  const design = getSlideDesign(slide);
  const columns = algorithmColumns(slide);
  const articleRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const fit = () => {
      const heading = article.querySelector<HTMLElement>('.slide-title');
      const main = article.querySelector<HTMLElement>('.slide-main');
      if (!main) return;
      main.style.top = `${heading ? heading.offsetTop + heading.offsetHeight + 46 : 150}px`;
      let font = design.body;
      article.style.setProperty('--slide-body', `${font}px`);
      const overflowing = () => [...main.querySelectorAll<HTMLElement>('.slide-copy,.comparison-pane,.algorithm-column')].some(el => el.scrollHeight > el.clientHeight + 2);
      while (main.clientHeight && overflowing() && font > 28) article.style.setProperty('--slide-body', `${--font}px`);
    };
    fit();
    void document.fonts.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(article);
    return () => observer.disconnect();
  }, [slide.id, design]);
  return <article ref={articleRef} data-slide-id={slide.id} data-design={design.layout} className={`slide-content individual-design design-${design.layout} ${slide.transition ? 'slide-transition' : ''} ${slide.id === 'slides03-18' ? 'design-ingredients' : ''}`} style={{ '--slide-body': `${design.body}px`, '--slide-title': `${design.title}px`, '--text-share': `${design.textShare}fr`, '--figure-share': `${100 - design.textShare}fr` } as React.CSSProperties} aria-label={`Slide ${index + 1}`}>
    <header className="slide-topline"><span className="slide-kicker">{slide.transition ? 'Conexão entre assuntos' : slide.section}</span><span className="slide-chrome">{String(index + 1).padStart(3, '0')} / {slides.length}</span></header>
    {slide.cover ? <div className="course-cover"><div className="cover-art">{slide.images.map(image => <img key={image.url} src={image.url} alt=""/>)}</div><div className="cover-copy"><span className="slide-kicker">Disciplina</span><h1 className="slide-title-lg">Inteligência Artificial<br/><span>e Bussines Inteligence</span></h1><p className="slide-body-lg">{slide.paragraphs[0]}</p></div></div> : slide.transition ? <div className="transition-content"><span className="transition-line"/><h1 className="slide-title-lg">{slide.title}</h1><p className="slide-body-lg">{slide.paragraphs[0]}</p><div className="transition-path slide-caption"><span>{slide.id === 'conexao-ia-ml' ? 'Inteligência Artificial' : 'Machine Learning'}</span><ArrowUpRight size={34}/><span>{slide.id === 'conexao-ia-ml' ? 'Machine Learning' : 'BI e Apoio à Decisão'}</span></div></div> : <>
      {slide.title && <h1 className="slide-title">{slide.title}</h1>}
      <div className={`slide-main ${(slide.images.length || design.figures === 'art') && design.textShare > 0 && design.textShare < 100 ? 'with-figures' : 'text-only'} ${design.layout === 'gallery' ? 'figures-only' : ''}`}>
        {columns ? <div className="algorithm-boards">{[{title:columns.leftTitle,items:columns.left},{title:columns.rightTitle,items:columns.right}].map((column, i) => <section className="algorithm-column" key={i}><h2 className="column-title">{column.title}</h2><ul>{column.items.map((text, n) => <li className="slide-body" key={n}><RichText slide={slide} text={text}/></li>)}</ul></section>)}</div>
          : design.layout === 'pipeline' ? <div className="diagram-stage"><div className="slide-copy diagram-lead">{design.blocks.map((block, i) => <CopySection slide={slide} block={block} key={i}/>)}</div><BiPipeline interactive={interactive}/></div>
          : design.layout === 'sources' ? <DataSources linkable={linkable}/>
          : design.layout === 'diagram' ? <div className="diagram-stage"><div className="slide-copy diagram-lead">{design.blocks.map((block, i) => <CopySection slide={slide} block={block} key={i}/>)}</div><FoundationDiagram interactive={interactive}/></div>
          : design.layout === 'comparison' ? <Comparison slide={slide} design={design}/>
          : <>{design.blocks.length > 0 && <div className="slide-copy">{design.blocks.map((block, i) => <CopySection slide={slide} block={block} key={i}/>)}</div>}{(slide.images.length > 0 || design.figures === 'art') && <div className="slide-figure-area"><DesignedFigures slide={slide} design={design}/></div>}</>}
      </div>
      {slide.links.length > 0 && <div className="slide-links">{slide.links.map((link, i) => {
        const inner = <>{link.url.includes('youtube.com') ? <Play/> : <ArrowUpRight/>}{link.label === 'Vídeo externo' ? 'Assistir ao vídeo' : link.label === 'Link original' ? 'Abrir link original' : link.label}</>;
        return <Button key={i} asChild variant="outline" className="slide-link">{linkable
          ? <a href={link.url} target="_blank" rel="noopener noreferrer">{inner}</a>
          : <span>{inner}</span>}</Button>;
      })}</div>}
    </>}
    <footer className="slide-footer"><span>IA · MACHINE LEARNING · BI · APOIO À DECISÃO</span><span>{slide.cover ? 'Capa da disciplina' : slide.transition ? 'Slide de conexão' : slide.source ? `${slide.source} · slide ${slide.original}` : 'Slide adicional'}</span></footer>
  </article>;
}

export function ScaledSlide({ index, interactive = false }: { index: number; interactive?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect) setScale(Math.min(rect.width / 1920, rect.height / 1080));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const slide = slides[index];
  if (!slide) return null;
  return <div ref={ref} className={`scaled-slide ${interactive ? 'interactive-slide' : ''}`}><div className="slide-wrapper" style={{ transform: `scale(${scale})` }}><SlideLayout slide={slide} index={index} interactive={interactive} linkable={interactive}/></div></div>;
}