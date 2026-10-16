import type { DeckSlide } from '@/lib/presentation';

// Authored for this deck: nothing here comes from the imported source files, so
// every slide carries no source and is marked as added.
const authored = (id: string, title: string, paragraphs: string[], section = 'BI e Sistemas de Apoio à Decisão'): DeckSlide => ({
  id, title, section,
  added: true, paragraphs, images: [], links: [], sourceText: [],
});
const closing = (id: string, title: string, paragraphs: string[]) => authored(id, title, paragraphs, 'Encerramento');

// Inserted between the Netflix paradox and the SAD definition: the deck states
// the problem of data overload, and BI is the first answer to it.
export const biSlides: DeckSlide[] = [
  authored('bi-o-que-e', 'O que é Business Intelligence?', [
    'BI é tornar visível o que a empresa já sabe',
    'Business Intelligence é o conjunto de processos e ferramentas que reúne os dados espalhados pela organização, organiza tudo em uma base consistente e entrega o resultado como indicadores que as pessoas conseguem ler.',
    'Responde o que aconteceu e o que está acontecendo agora',
    'Parte de dados registrados, não de opinião ou memória',
    'Entrega relatórios, painéis e indicadores — não decisões prontas',
    'É a base sobre a qual o apoio à decisão é construído',
  ]),
  authored('bi-pipeline', 'Do dado ao indicador', [
    'Entre o sistema que registra uma venda e o número que aparece no painel do diretor existe um caminho. É esse caminho que o BI constrói e mantém.',
  ]),
  authored('bi-indicador', 'O que faz um bom indicador', [
    'Nem todo número é indicador',
    'Uma métrica de vaidade cresce sempre, enche os olhos na apresentação e não muda decisão nenhuma: total de visitas acumuladas, número de seguidores, downloads desde o lançamento.',
    'Um indicador que decide tem quatro coisas:',
    'Responde a uma pergunta que alguém realmente tem',
    'Tem meta e prazo, então dá para saber se está bom ou ruim',
    'Tem um dono, alguém responsável por ele',
    'Quando sai do esperado, existe uma ação possível',
  ]),
  authored('bi-fronteira', 'Onde o BI termina e o SAD começa', [
    'BI: o retrovisor e o painel',
    'Mostra o que aconteceu e o que está acontecendo. Vendas do trimestre, estoque de hoje, atraso médio das entregas. Descreve a realidade com fidelidade.',
    'SAD: o para-brisa',
    'Pergunta o que acontece se. Simula alternativas, projeta cenários e compara caminhos, usando modelos sobre a base que o BI construiu.',
    'Sem um BI confiável, o SAD simula em cima de dados ruins — e devolve cenários convincentes sobre uma realidade que não existe.',
  ]),
];

// Closing the course: a synthesis of the three chapters and a return to the
// question the decision chapter opened with.
export const closingSlides: DeckSlide[] = [
  closing('fecho-sintese', 'O que levamos desta disciplina', [
    'Três assuntos, um percurso só',
    'Inteligência Artificial: técnicas para que máquinas exibam comportamento inteligente — do Teste de Turing ao Quarto Chinês, do inverno da IA aos modelos de fundação.',
    'Machine Learning: em vez de programar a regra, o sistema aprende a regra a partir dos dados. E a qualidade dos dados pesa mais do que a escolha do algoritmo.',
    'BI: dados espalhados por vários sistemas viram uma base única e um punhado de indicadores legíveis.',
    'Apoio à decisão: sobre essa base, modelos e simulações mostram alternativas — e a escolha final continua sendo de uma pessoa.',
  ]),
  closing('fecho-decisao', 'A decisão continua sendo sua', [
    'Começamos esta parte da disciplina com uma pergunta simples: como você decidiu o caminho para chegar aqui hoje?',
    'Provavelmente um sistema leu milhares de variáveis por você e sugeriu uma rota. A diferença é que agora você sabe o que existe por trás: os dados que alimentam, o modelo que calcula, o painel que apresenta — e o ponto exato em que a máquina para e você decide.',
    'Construir esse sistema para uma organização é o trabalho de quem entende de IA, de aprendizado de máquina e de BI ao mesmo tempo. É isso que vocês levam daqui.',
  ]),
];
