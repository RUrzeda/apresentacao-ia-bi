import type { DeckSlide } from '@/lib/presentation';

export type CopyBlock = { kind: 'topic' | 'body' | 'list' | 'quote' | 'note'; indices: number[] };
export type SlideDesign = {
  layout: 'editorial' | 'history' | 'question' | 'comparison' | 'steps' | 'definition' | 'gallery' | 'algorithms' | 'labels' | 'diagram' | 'sources' | 'pipeline';
  blocks: CopyBlock[];
  figures: 'original' | 'gallery' | 'hero' | 'posters' | 'paired' | 'none' | 'art';
  body: number;
  title: number;
  textShare: number;
};
const b = (kind: CopyBlock['kind'], ...indices: number[]): CopyBlock => ({ kind, indices });
const d = (layout: SlideDesign['layout'], blocks: CopyBlock[], figures: SlideDesign['figures'] = 'original', body = 38, textShare = 50, title = 72): SlideDesign => ({ layout, blocks, figures, body, textShare, title });
const visual = (figures: SlideDesign['figures'] = 'original', title = 72) => d('gallery', [], figures, 38, 0, title);
const algorithms = () => d('algorithms', [], 'original', 36, 100);

// Deliberate, source-indexed composition for every original, not inferred from length.
export const slideDesigns: Record<string, SlideDesign> = {
  'inverno-ia': visual('hero'),
  'slide01-1': d('editorial', [b('body', 0)], 'hero', 40, 54),
  'slide01-2': d('question', [b('topic', 0), b('body', 1), b('quote', 2)], 'gallery', 40, 58),
  'slide01-3': d('editorial', [b('topic', 0), b('list', 1, 2, 3, 4, 5, 6)], 'hero', 38, 57),
  'slide01-4': d('editorial', [b('topic', 0), b('body', 1), b('list', 2, 3)], 'hero', 38, 56),
  'slide01-5': d('definition', [b('topic', 0), b('body', 1), b('body', 2)], 'gallery', 40, 56),
  'slide01-6': d('comparison', [b('quote', 0), b('topic', 1), b('body', 2, 3), b('body', 4)], 'original', 40, 100),
  'slide01-7': d('comparison', [b('topic', 0), b('topic', 1)], 'paired', 40, 100),
  'slide01-8': d('history', [b('topic', 0), b('quote', 1), b('body', 2), b('body', 3)], 'hero', 36, 57),
  'slide01-9': d('history', [b('topic', 0), b('quote', 1), b('body', 2), b('body', 3)], 'gallery', 40, 52),
  'slide01-10': d('history', [b('topic', 0), b('body', 1)], 'gallery', 42, 42),
  'slide01-11': d('history', [b('topic', 0), b('body', 1)], 'gallery', 42, 45),
  'slide01-12': d('history', [b('topic', 0), b('list', 1, 2)], 'gallery', 40, 46),
  'slide01-13': d('history', [b('topic', 0), b('list', 1, 2, 3)], 'gallery', 38, 50),
  'slide01-14': d('history', [b('topic', 0), b('body', 1), b('note', 2)], 'gallery', 40, 46),
  'slide01-15': d('history', [b('topic', 0), b('list', 1, 2)], 'gallery', 40, 46),
  'slide01-16': d('history', [b('topic', 0), b('list', 1, 2)], 'gallery', 40, 46),
  'slide01-17': d('history', [b('topic', 0), b('list', 1, 2)], 'gallery', 38, 50),
  'slide01-18': d('history', [b('topic', 0), b('body', 1), b('note', 2)], 'gallery', 40, 46),
  'slide01-19': d('history', [b('topic', 0), b('list', 1, 2)], 'gallery', 40, 46),
  'slide01-20': d('question', [b('quote', 0), b('body', 1)], 'hero', 40, 58),
  'slide01-21': visual('hero'),
  'slide01-22': d('question', [b('note', 0), b('quote', 1)], 'hero', 40, 55, 66),
  'slide01-23': visual('hero'),
  'slide01-24': visual('hero'),
  'slide01-25': d('editorial', [b('topic', 0), b('list', 1, 2)], 'gallery', 40, 50),
  'slide01-26': d('question', [b('topic', 0), b('body', 1), b('quote', 2)], 'gallery', 40, 50),
  'slide01-27': visual('posters'),
  'slide02-1': visual('hero'),
  'slide02-2': d('comparison', [b('body', 0), b('body', 1)], 'paired', 40, 100),
  'slide02-3': d('editorial', [b('body', 0), b('list', 1, 2)], 'hero', 40, 56),
  'slide02-4': d('definition', [b('body', 0), b('list', 1, 2)], 'original', 44, 100),
  'slide02-5': visual('hero'),
  'slide02-6': d('labels', [b('note', 0)], 'original', 34, 100),
  'slide02-7': d('definition', [b('body', 0), b('quote', 1)], 'hero', 40, 55),
  'slide02-8': d('steps', [b('body', 0, 1), b('note', 2), b('quote', 3)], 'hero', 38, 60),
  'slide02-9': d('steps', [b('body', 0), b('list', 1, 2, 3)], 'original', 44, 100),
  'slide02-10': d('steps', [b('list', 0, 1, 2)], 'hero', 40, 57),
  'slide02-11': visual('hero'),
  'slide02-12': d('definition', [b('body', 0), b('body', 1)], 'original', 44, 100),
  'slide02-13': d('comparison', [b('topic', 0), b('body', 1), b('topic', 2), b('body', 3)], 'paired', 40, 100),
  'slide02-14': d('labels', [b('topic', 0, 1)], 'hero', 36, 100),
  'slide02-15': d('labels', [b('topic', 0, 1)], 'hero', 36, 100),
  'slide02-16': d('editorial', [b('topic', 0), b('list', 1, 2, 3, 4)], 'original', 42, 40),
  'slide02-17': d('editorial', [b('topic', 0), b('list', 1, 2)], 'original', 44, 40),
  'slide02-18': visual('hero'),
  'slide02-19': visual('hero'),
  'slide02-20': visual('hero'),
  'slide02-21': visual(),
  'slide02-22': algorithms(),
  'slide02-23': visual('hero'),
  'slide02-24': visual(),
  'slide02-25': visual('hero'),
  'slide02-26': visual('hero'),
  'slide02-27': algorithms(),
  'slide02-28': d('definition', [b('body', 0), b('body', 1)], 'original', 42, 100, 66),
  'slide02-29': visual(),
  'slide02-30': d('steps', [b('list', 0, 1, 2)], 'original', 48, 100, 66),
  'slide02-31': visual(),
  'slide02-32': visual('hero'),
  'slide02-33': visual('hero', 66),
  'slide02-34': visual('hero', 66),
  'slide02-35': visual('hero', 66),
  'slide02-36': visual('hero'),
  'slide02-37': algorithms(),
  'slide02-38': visual('original', 60),
  'slide02-39': algorithms(),
  'slide02-40': visual(),
  'slide02-41': algorithms(),
  'slide02-42': visual('hero'),
  'slide02-43': d('definition', [b('quote', 0), b('body', 1), b('body', 2)], 'original', 40, 100, 66),
  'slide02-44': visual('hero', 66),
  'slide02-45': algorithms(),
  'slide02-46': d('definition', [b('body', 0), b('quote', 1)], 'original', 42, 100),
  'slide02-47': visual(),
  'slide02-48': visual('hero'),
  'slide02-49': visual('hero'),
  'slide02-50': algorithms(),
  'slide02-51': visual(),
  'slide02-52': visual('hero'),
  'slide02-53': visual('hero'),
  'slide02-54': visual('hero'),
  'slide02-55': visual('hero'),
  'slide02-56': visual('hero'),
  'slide02-57': visual(),
  'slide02-58': visual('hero', 66),
  'slide02-59': d('labels', [b('note', 0)], 'hero', 28, 100, 66),
  'slide02-60': d('sources', [], 'none', 30, 100, 66),
  'slides03-1': d('question', [b('quote', 0), b('body', 1)], 'hero', 40, 56),
  'slides03-2': d('editorial', [b('body', 0), b('topic', 1), b('list', 2, 3, 4)], 'hero', 36, 60),
  'slides03-3': d('steps', [b('list', 0, 1, 2), b('quote', 3)], 'hero', 36, 56, 60),
  'slides03-4': d('definition', [b('quote', 0), b('body', 1)], 'hero', 38, 56),
  'slides03-5': visual('hero'),
  'slides03-6': d('definition', [b('body', 0), b('topic', 1), b('list', 2, 3, 4)], 'hero', 36, 58),
  'slides03-7': d('editorial', [b('body', 0), b('topic', 1), b('body', 2), b('topic', 3), b('body', 4), b('topic', 5), b('body', 6)], 'hero', 32, 53, 60),
  'slides03-8': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('body', 3), b('quote', 4, 5)], 'hero', 36, 53, 60),
  'slides03-9': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('quote', 3), b('topic', 4), b('body', 5)], 'hero', 36, 65),
  'slides03-10': d('editorial', [b('body', 0), b('quote', 1)], 'hero', 34, 62, 60),
  'slides03-11': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('quote', 3), b('topic', 4), b('body', 5)], 'hero', 34, 59),
  'slides03-12': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('body', 3), b('topic', 4), b('body', 5), b('quote', 6, 7)], 'hero', 32, 60, 60),
  'slides03-13': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('quote', 3), b('note', 4), b('topic', 5), b('body', 6)], 'hero', 32, 58),
  'slides03-14': d('editorial', [b('body', 0), b('topic', 1), b('list', 2, 3, 4, 5)], 'hero', 34, 56),
  'slides03-15': d('definition', [b('topic', 0), b('body', 1), b('list', 2, 3, 4, 5)], 'hero', 34, 58),
  'slides03-16': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('quote', 3)], 'hero', 38, 55),
  'slides03-17': d('definition', [b('topic', 0), b('quote', 1), b('list', 2, 3, 4, 5)], 'hero', 32, 60, 60),
  'slides03-18': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('body', 3), b('topic', 4), b('body', 5), b('topic', 6), b('body', 7)], 'hero', 32, 80),
  'slides03-19': d('definition', [b('body', 0), b('topic', 1), b('body', 2)], 'hero', 36, 57),
  'slides03-20': d('editorial', [b('body', 0), b('list', 1, 2, 3, 4)], 'hero', 34, 56, 60),

  // Imported from slide4add.odp, inserted before the Debate slide.
  'extra-1': visual(),
  'extra-2': visual(),
  'modelos-de-fundacao': d('diagram', [b('body', 0)], 'none', 34, 100, 66),
  'extra-3': visual(),
  'extra-4': visual('hero'),
  'extra-5': visual('hero'),
  'extra-6': visual(),
  'extra-7': visual('hero'),
  'extra-8': visual(),

  // Authored BI block and course closing.
  'bi-o-que-e': d('definition', [b('topic', 0), b('body', 1), b('list', 2, 3, 4, 5)], 'art', 34, 58),
  'bi-pipeline': d('pipeline', [b('body', 0)], 'none', 34, 100, 66),
  'bi-indicador': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('list', 3, 4, 5, 6)], 'art', 32, 60),
  'bi-fronteira': d('editorial', [b('topic', 0), b('body', 1), b('topic', 2), b('body', 3), b('note', 4)], 'art', 32, 58),
  'fecho-sintese': d('definition', [b('topic', 0), b('list', 1, 2, 3, 4)], 'art', 31, 62, 66),
  'fecho-decisao': d('editorial', [b('body', 0), b('body', 1), b('body', 2)], 'art', 34, 60, 66),
};

export function getSlideDesign(slide: DeckSlide): SlideDesign {
  return slideDesigns[slide.id] ?? d('definition', [b('body', 0)], 'original');
}

// Splits only at known source boundaries and leaves every character untouched.
export function blockTexts(slide: DeckSlide, block: CopyBlock): string[] {
  const texts = block.indices.map(index => slide.paragraphs[index] ?? '');
  if (slide.id === 'slides03-10' && block.indices[0] === 0) {
    return texts.flatMap(text => text.split(/(?=[\uF073\uF200\uF0E8\uF0C0])/u).filter(Boolean));
  }
  return texts;
}