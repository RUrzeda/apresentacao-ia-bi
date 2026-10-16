import type { DeckSlide } from '@/lib/presentation';

export function algorithmColumns(slide: DeckSlide) {
  const divider = slide.paragraphs.findIndex(text => text.trim() === 'Utilização');
  if (slide.paragraphs[0]?.trim() !== 'Algoritmos' || divider < 1) return null;
  return { leftTitle: slide.paragraphs[0], rightTitle: slide.paragraphs[divider], left: slide.paragraphs.slice(1, divider), right: slide.paragraphs.slice(divider + 1) };
}

export function textGroups(slide: DeckSlide): string[][] {
  const paragraphs = slide.id === 'slides03-10'
    ? slide.paragraphs.flatMap(text => text.split(/(?=[\uF073\uF200\uF0E8\uF0C0])/u).filter(Boolean))
    : slide.paragraphs;
  if (slide.id === 'slides03-10') return paragraphs.map(text => [text]);
  const groups: string[][] = [];
  for (const text of paragraphs) {
    const label = text.replace(/[\uE000-\uF8FF]/gu, '').trim();
    const heading = label.length < 65 && (label.endsWith(':') || ['Características', 'Quem toma', 'Frequência', 'Interativos', 'Usam Dados', 'Usam Modelos', 'Resolvem Problemas Complexos', 'Estratégico', 'Tático', 'Operacional'].includes(label));
    if (heading || !groups.length) groups.push([text]);
    else groups[groups.length - 1]?.push(text);
  }
  return groups;
}

export function figureBounds(slide: DeckSlide) {
  const left = Math.min(...slide.images.map(image => image.x));
  const top = Math.min(...slide.images.map(image => image.y));
  return { left, top, width: Math.max(...slide.images.map(image => image.x + image.w)) - left, height: Math.max(...slide.images.map(image => image.y + image.h)) - top };
}