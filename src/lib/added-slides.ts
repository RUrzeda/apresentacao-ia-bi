import type { DeckSlide } from '@/lib/presentation';
import attention from '@/assets/deck-extra/attention-is-all-you-need.png';
import optimus from '@/assets/deck-extra/optimus-transformer.gif';
import acoes from '@/assets/deck-extra/ft-acoes-nvidia-alphabet-amazon.png';
import nuvem from '@/assets/deck-extra/nvidia-nuvem-ia.png';
import datacenter from '@/assets/deck-extra/datacenter.png';
import midjourney from '@/assets/deck-extra/midjourney-v1-v5.png';
import arxiv from '@/assets/deck-extra/arxiv-papers-ml-ia.png';
import gartner from '@/assets/deck-extra/gartner-hype-cycle.png';
import illusion from '@/assets/deck-extra/illusion-of-thinking.png';
import bracoDeFerro from '@/assets/deck-extra/braco-de-ferro-humano-robo.png';
import apertoDeMaos from '@/assets/deck-extra/aperto-de-maos-humano-robo.png';
import noVacancy from '@/assets/deck-extra/robo-no-vacancy.png';
import wefEmpregos from '@/assets/deck-extra/wef-empregos-llm.png';
import criadosEliminados from '@/assets/deck-extra/empregos-criados-eliminados.png';

// Slides imported from slide4add.odp, which was never part of the three source decks.
// Titles are the originals; figure geometry is the original frame geometry, so the
// imported block stays auditable against its source the same way slides.json is.
const imported = (
  id: string,
  original: number,
  title: string,
  images: DeckSlide['images'],
  // The text the source slide actually carried; empty when the title above is ours.
  sourceText: string[] = [title],
): DeckSlide => ({
  id, title, section: 'Inteligência Artificial',
  source: 'slide4add.odp', original, added: true,
  paragraphs: [], links: [], sourceText,
  images,
});

export const foundationSlideId = 'modelos-de-fundacao';

// Authored for this deck at the user's request: the only slide here whose text is
// not imported, kept separate from the imported block above.
const foundation: DeckSlide = {
  id: foundationSlideId,
  section: 'Inteligência Artificial',
  title: 'Modelos de Fundação',
  added: true,
  paragraphs: [
    'Um modelo de fundação é treinado uma única vez, em escala, sobre dados não rotulados — e depois adaptado a muitas tarefas diferentes, em vez de um modelo novo para cada tarefa.',
  ],
  images: [], links: [], sourceText: [],
};

export const addedSlides: DeckSlide[] = [
  imported('extra-1', 1, 'Como chegamos até aqui?', [
    { url: attention, x: 1.948, y: 4.005, w: 13.546, h: 7.116, ratio: 1.903346 },
    { url: optimus, x: 17, y: 4.6, w: 6.64, h: 6.047, ratio: 1.298701 },
  ]),
  imported('extra-2', 2, 'Como chegamos até aqui?', [
    { url: nuvem, x: 14.675, y: 2.912, w: 8.976, h: 4.777, ratio: 1.878116 },
    { url: acoes, x: 1.948, y: 4.515, w: 9.789, h: 7.831, ratio: 1.25 },
    { url: datacenter, x: 13.252, y: 8.327, w: 6.498, h: 4.332, ratio: 1.498559 },
  ]),
  foundation,
  imported('extra-3', 3, 'Avanço Rápido', [
    { url: arxiv, x: 0.161, y: 3.709, w: 12.361, h: 7.681, ratio: 1.608264 },
    { url: midjourney, x: 12.666, y: 0, w: 12.737, h: 14.287, ratio: 0.891683 },
  ]),
  imported('extra-4', 4, 'Gartner hype cycle', [
    { url: gartner, x: 4.5, y: 3.5, w: 14.672, h: 9.781, ratio: 1.5 },
  ]),
  imported('extra-5', 5, 'Atualidade', [
    { url: illusion, x: 5, y: 3.5, w: 15.888, h: 8.248, ratio: 1.926164 },
  ]),
  imported('extra-6', 6, 'Ferramenta colaborativa', [
    { url: bracoDeFerro, x: 2.284, y: 5.443, w: 8.759, h: 6.2, ratio: 1.412698 },
    { url: apertoDeMaos, x: 12.17, y: 5.443, w: 11.072, h: 6.2, ratio: 1.785714 },
  ]),
  imported('extra-7', 7, 'Qualificação', [
    { url: noVacancy, x: 5.764, y: 4.468, w: 13.611, h: 7.015, ratio: 1.940299 },
  ]),
  // Original slide 8 carries no title; the title below is added for navigation.
  imported('extra-8', 8, 'Impacto no trabalho', [
    { url: wefEmpregos, x: 0.106, y: 0.408, w: 15.595, h: 12.945, ratio: 1.204499 },
    { url: criadosEliminados, x: 15.702, y: 3.237, w: 8.361, h: 6.949, ratio: 1.938202 },
  ], []),
];
