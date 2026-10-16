import slideData from '@/data/slides.json';
import pdfContent from '@/data/pdf-content.json';
import winterImage from '@/assets/ai-winter.jpg';
import { addedSlides } from '@/lib/added-slides';
import { biSlides, closingSlides } from '@/lib/bi-slides';

export type SlideImage = { url: string; x: number; y: number; w: number; h: number; ratio: number };
export type DeckSlide = { id: string; section: string; title: string; paragraphs: string[]; images: SlideImage[]; links: { url: string; label: string }[]; source?: string; original?: number; transition?: boolean; cover?: boolean; added?: boolean; sourceText: string[]; icons?: Record<string, string> };
// The imported data holds absolute `/__l5e/...` asset paths. Vite rewrites asset
// imports for a subpath deploy but not strings inside JSON, so they are prefixed
// here; anything else (bundled imports, already-prefixed URLs) is left alone.
const assetBase = import.meta.env.BASE_URL.replace(/\/$/, '');
const withBase = (url: string) => (url.startsWith('/__l5e/') ? assetBase + url : url);
const refined: Record<string, { title: string; paragraphs: string[]; icons: Record<string, string>; sourceText: string[] }> = pdfContent;
const originals: DeckSlide[] = slideData.filter(slide => !slide.transition).map(slide => {
  const merged = { ...slide, ...refined[slide.id] };
  return {
    ...merged,
    images: merged.images.map(image => ({ ...image, url: withBase(image.url) })),
    ...(merged.icons ? { icons: Object.fromEntries(Object.entries(merged.icons).map(([char, url]) => [char, withBase(url)])) } : {}),
  };
});
// Explicit user-approved amendments, separate from immutable imported content.
export const removedSlideIds = [
  'slide02-52', // Original approved removal before the cover was added.
  // Numbers in the 109-slide deck, before applying this batch of removals.
  'slide01-10', 'slide01-11', 'slide01-12', 'slide01-13', 'slide01-14', 'slide01-15', // 11–16
  'slide01-17', 'slide01-19', 'slide01-21', 'slide01-23', // 18, 20, 22, 24
  'slide02-48', 'slide02-49', // 77, 78
];
export const biAmendments: Record<string, Record<number, string>> = {
  'slides03-14': { 2: '\uf080 Relatórios e dashboards de BI em múltiplas plataformas' },
  'slides03-20': { 1: '\uf625Painéis de um Sistema de BI que mostram os indicadores mais importantes' },
};
// Title, body and destination changes the user approved for imported slides. Every
// departure from the source files is listed here, so the originals stay auditable.
export const slideAmendments: Record<string, { title?: string; dropParagraphs?: true; links?: { url: string; label: string }[] }> = {
  // The debate figure is a still from the series 1923; the link opens that clip.
  'slide01-26': { links: [{ url: 'https://www.facebook.com/hashtagsal/videos/1479867622636167/', label: 'Ver a cena da série 1923' }] },
  // Only the extra content stays; the three activity lines were dropped.
  'slide01-27': { title: 'Conteúdo Extra', dropParagraphs: true },
  'slide02-56': { links: [{ url: 'https://teachablemachine.withgoogle.com/', label: 'Abrir o Teachable Machine' }] },
  // The Kaggle destination moved into the source grid, so the footer button is dropped.
  'slide02-60': { links: [] },
};
const displayedOriginals = originals.filter(slide => !removedSlideIds.includes(slide.id)).map(slide => {
  const amend = slideAmendments[slide.id];
  return {
    ...slide,
    title: amend?.title ?? slide.title,
    paragraphs: amend?.dropParagraphs ? [] : slide.paragraphs.map((text, index) => biAmendments[slide.id]?.[index] ?? text),
    links: amend?.links ?? slide.links,
  };
});
const cover: DeckSlide = { id: 'capa-disciplina', section: 'Disciplina', title: 'Inteligência Artificial e Bussines Inteligence', paragraphs: ['Inteligência Artificial · Machine Learning · BI e Apoio à Decisão'], images: originals[0]?.images ?? [], links: [], cover: true, sourceText: [] };
const connection = (id: string, title: string, paragraph: string): DeckSlide => ({ id, title, section: 'Conexão', paragraphs: [paragraph], images: [], links: [], transition: true, sourceText: [] });
const winterSlide: DeckSlide = {
  id: 'inverno-ia', section: 'Inteligência Artificial', title: 'Inverdo da IA',
  paragraphs: [], links: [], sourceText: [], added: true,
  images: [{ url: winterImage, x: 0, y: 0, w: 1536, h: 1024, ratio: 1.5 }],
};
export const slides: DeckSlide[] = [
  cover,
  ...displayedOriginals.filter(slide => slide.source === 'slide01.odp').flatMap(slide =>
    slide.id === 'slide01-16' ? [winterSlide, slide]
      // The added block closes the chapter's arc right before the Debate slide.
      : slide.id === 'slide01-26' ? [...addedSlides, slide]
        : [slide]),
  connection('conexao-ia-ml', 'Da inteligência artificial ao aprendizado de máquina', 'A seguir: como dados e modelos permitem o aprendizado de máquina.'),
  ...displayedOriginals.filter(slide => slide.source === 'slide02.odp'),
  connection('conexao-ml-sad', 'Do aprendizado de máquina ao BI e apoio à decisão', 'Sistemas de BI organizam dados e indicadores para apoiar decisões de negócio. Sistemas de Apoio à Decisão também podem usar modelos e simulações para avaliar alternativas.'),
  // BI answers the data-overload problem the deck has just posed, before the SAD
  // definition that builds on it; the closing pair ends the course.
  ...displayedOriginals.filter(slide => slide.source === 'slides03.pdf').flatMap(slide =>
    slide.id === 'slides03-17' ? [...biSlides, slide] : [slide]),
  ...closingSlides,
];
export const chapters = [
  { title: 'Inteligência Artificial', short: 'Inteligência Artificial', source: 'slide01.odp', number: '01' },
  { title: 'Machine Learning', short: 'Machine Learning', source: 'slide02.odp', number: '02' },
  { title: 'BI e Sistemas de Apoio à Decisão', short: 'BI e Apoio à Decisão', source: 'slides03.pdf', number: '03' },
].map(chapter => ({ ...chapter, start: slides.findIndex(slide => slide.source === chapter.source), end: slides.reduce((last, slide, index) => slide.source === chapter.source ? index : last, -1) }));
export function clampSlide(value: number) { return Math.max(0, Math.min(slides.length - 1, Number.isFinite(value) ? value : 0)); }