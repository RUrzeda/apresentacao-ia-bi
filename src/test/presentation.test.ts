import { describe, expect, it } from 'vitest';
import { biAmendments, chapters, clampSlide, removedSlideIds, slideAmendments, slides } from '@/lib/presentation';
import { addedSlides } from '@/lib/added-slides';
import { dataSources } from '@/components/presentation/data-sources';
import { biSlides, closingSlides } from '@/lib/bi-slides';
import sourceSlides from '@/data/slides.json';
import refined from '@/data/pdf-content.json';
import { algorithmColumns, textGroups } from '@/lib/slide-layout';
import { blockTexts, slideDesigns } from '@/lib/slide-design';

describe('Presentation integrity', () => {
  it('assigns a deliberate individual composition to every displayed content slide', () => {
    for (const slide of slides.filter(s => !s.transition && !s.cover)) {
      const design = slideDesigns[slide.id];
      expect(design, slide.id).toBeDefined();
      if (!design || design.layout === 'algorithms') continue;
      expect(design.blocks.flatMap(block => block.indices), slide.id).toEqual(slide.paragraphs.map((_, i) => i));
      expect(design.blocks.flatMap(block => blockTexts(slide, block)).join(''), slide.id).toBe(slide.paragraphs.join(''));
    }
  });
  it('orders IA, Machine Learning, then decision support with connections between them', () => {
    expect(chapters.map(ch => slides[ch.start]?.source)).toEqual(['slide01.odp', 'slide02.odp', 'slides03.pdf']);
    expect(slides[0]?.cover).toBe(true);
    expect(slides[28]?.id).toBe('conexao-ia-ml');
    expect(slides[86]?.id).toBe('conexao-ml-sad');
  });
  it('does not change any original text, figure, or link during visual restructuring', () => {
    for (const source of sourceSlides.filter(slide => !slide.transition)) {
      if (removedSlideIds.includes(source.id)) {
        expect(slides.find(slide => slide.id === source.id)).toBeUndefined();
        continue;
      }
      const amend = slideAmendments[source.id];
      const expected = { ...source, ...(refined as Record<string, object>)[source.id] } as typeof source & { title: string };
      const actual = slides.find(slide => slide.id === source.id);
      // Everything matches the source except what is registered as an amendment.
      expect(actual).toEqual({ ...expected, paragraphs: actual?.paragraphs, title: amend?.title ?? expected.title, links: amend?.links ?? expected.links });
      const originalParagraphs = (refined as Record<string, { paragraphs: string[] }>)[source.id]?.paragraphs ?? source.paragraphs;
      expect(actual?.paragraphs).toEqual(amend?.dropParagraphs ? [] : originalParagraphs.map((text, i) => biAmendments[source.id]?.[i] ?? text));
    }
  });
  it('keeps 94 originals, two connections, one cover, the winter replacement and the added block', () => {
    expect(slides).toHaveLength(113);
    expect(slides.filter(s => s.transition)).toHaveLength(2);
    expect(slides.filter(s => s.cover)).toHaveLength(1);
    for (const [source, count] of [['slide01.odp', 17], ['slides03.pdf', 20], ['slide02.odp', 57]] as const) {
      const imported = slides.filter(s => s.source === source);
      expect(imported).toHaveLength(count);
      expect(imported.map(s => s.original)).toEqual(sourceSlides.filter(s => s.source === source && !removedSlideIds.includes(s.id)).map(s => s.original));
    }
  });
  it('replaces prior slides 11–16 in place and removes every requested source ID', () => {
    expect(slides[9]?.id).toBe('slide01-9');
    expect(slides[10]).toMatchObject({ id: 'inverno-ia', title: 'Inverdo da IA', paragraphs: [], added: true });
    expect(slides[10]?.images).toHaveLength(1);
    expect(slides[11]?.id).toBe('slide01-16');
    for (const id of removedSlideIds) expect(slides.some(slide => slide.id === id), id).toBe(false);
  });
  it('preserves every extracted paragraph or embeds the decision tree text in its original figure', () => {
    for (const slide of slides.filter(s => !s.transition && !s.cover && !biAmendments[s.id] && !slideAmendments[s.id]?.dropParagraphs && s.id !== 'slide02-6')) {
      const rendered = [slide.title, ...slide.paragraphs].join(' ');
      for (const text of slide.sourceText) expect(rendered).toContain(text);
    }
    expect(slides.find(s => s.id === 'slide02-6')?.images.length).toBe(2);
  });
  it('retains exact destinations from every original that remains in the deck', () => {
    const links = slides.flatMap(s => s.links.map(l => l.url));
    const expectedLinks = sourceSlides.filter(s => !s.transition && !removedSlideIds.includes(s.id))
      .flatMap(s => (slideAmendments[s.id]?.links ?? s.links).map(l => l.url));
    expect(links).toEqual(expectedLinks);
    expect(links).toHaveLength(4);
    expect(links).toContain('https://www.youtube.com/watch?v=rHKwIYsPXLg');
    expect(links).toContain('https://www.slideshare.net/0xdata/explaining-blackbox-machine-learning-predictions');
    // The Kaggle destination moved from a footer button into the source grid.
    expect(links).not.toContain('https://www.kaggle.com/');
    expect(dataSources.map(source => source.url)).toContain('https://www.kaggle.com/');
  });
  it('inserts the added block between Sistemas Especialistas and the Debate slide', () => {
    const start = slides.findIndex(slide => slide.id === 'extra-1');
    expect(slides[start - 1]?.id).toBe('slide01-25');
    expect(slides.slice(start, start + addedSlides.length).map(s => s.id)).toEqual(addedSlides.map(s => s.id));
    expect(slides[start + addedSlides.length]?.id).toBe('slide01-26');
    expect(addedSlides).toHaveLength(9);
  });
  it('keeps the added block inside chapter one and traceable to its own source', () => {
    const chapter = chapters[0];
    const start = slides.findIndex(slide => slide.id === 'extra-1');
    expect(chapter && start > chapter.start && start < chapter.end).toBe(true);
    const imported = addedSlides.filter(slide => slide.id !== 'modelos-de-fundacao');
    expect(imported.map(s => s.original)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const slide of imported) {
      expect(slide.source, slide.id).toBe('slide4add.odp');
      expect(slide.added, slide.id).toBe(true);
      expect(slide.images.length, slide.id).toBeGreaterThan(0);
    }
  });
  it('authors the foundation-model slide without a source and with one lead paragraph', () => {
    const slide = slides.find(s => s.id === 'modelos-de-fundacao');
    expect(slide).toMatchObject({ title: 'Modelos de Fundação', added: true, sourceText: [], images: [], links: [] });
    expect(slide?.source).toBeUndefined();
    expect(slide?.paragraphs).toHaveLength(1);
    expect(slideDesigns['modelos-de-fundacao']?.layout).toBe('diagram');
  });
  it('applies only the registered amendments to imported slides', () => {
    expect(Object.keys(slideAmendments).sort()).toEqual(['slide01-26', 'slide01-27', 'slide02-56', 'slide02-60']);
    const byId = (id: string) => slides.find(slide => slide.id === id);
    expect(byId('slide01-26')?.links.map(l => l.url)).toEqual(['https://www.facebook.com/hashtagsal/videos/1479867622636167/']);
    expect(byId('slide01-27')).toMatchObject({ title: 'Conteúdo Extra', paragraphs: [] });
    expect(byId('slide01-27')?.images).toHaveLength(6);
    expect(byId('slide02-56')?.links.map(l => l.url)).toEqual(['https://teachablemachine.withgoogle.com/']);
    expect(byId('slide02-60')?.links).toEqual([]);
  });
  it('offers free data sources, including a Brazilian public one, each with a destination', () => {
    expect(dataSources.length).toBeGreaterThanOrEqual(5);
    expect(dataSources.some(source => source.url.includes('dados.gov.br'))).toBe(true);
    for (const source of dataSources) expect(source.url, source.name).toMatch(/^https:\/\//);
    expect(new Set(dataSources.map(s => s.url)).size).toBe(dataSources.length);
  });
  it('puts the BI block between the Netflix paradox and the SAD definition', () => {
    const start = slides.findIndex(slide => slide.id === biSlides[0]?.id);
    expect(slides[start - 1]?.id).toBe('slides03-16');
    expect(slides.slice(start, start + biSlides.length).map(s => s.id)).toEqual(biSlides.map(s => s.id));
    expect(slides[start + biSlides.length]?.id).toBe('slides03-17');
    // BI has to land before the SAD definition it is the base for.
    expect(start).toBeLessThan(slides.findIndex(slide => slide.id === 'slides03-17'));
  });
  it('closes the course with authored slides after the last imported one', () => {
    expect(slides.slice(-closingSlides.length).map(s => s.id)).toEqual(closingSlides.map(s => s.id));
    expect(slides[slides.length - closingSlides.length - 1]?.id).toBe('slides03-20');
    for (const slide of [...biSlides, ...closingSlides]) {
      expect(slide.source, slide.id).toBeUndefined();
      expect(slide.added, slide.id).toBe(true);
      expect(slide.sourceText, slide.id).toEqual([]);
      expect(slide.paragraphs.length, slide.id).toBeGreaterThan(0);
    }
  });
  it('clamps navigation to valid slides', () => {
    expect(clampSlide(-1)).toBe(0);
    expect(clampSlide(200)).toBe(112);
    expect(clampSlide(NaN)).toBe(0);
  });
  it('keeps algorithm/use lists independent and preserves their exact text', () => {
    const algorithmSlides = slides.filter(slide => slide.title === 'Algoritmos e Utilização');
    expect(algorithmSlides).toHaveLength(7);
    for (const slide of algorithmSlides) {
      const columns = algorithmColumns(slide);
      expect(columns).not.toBeNull();
      if (!columns) continue;
      expect([columns.leftTitle, ...columns.left, columns.rightTitle, ...columns.right]).toEqual(slide.paragraphs);
    }
  });
  it('preserves every character while visually grouping PDF text', () => {
    for (const slide of slides.filter(slide => slide.source === 'slides03.pdf')) {
      expect(textGroups(slide).flat().join('')).toBe(slide.paragraphs.join(''));
    }
  });
});