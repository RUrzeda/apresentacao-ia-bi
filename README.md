# Inteligência Artificial e Business Intelligence

Apresentação da disciplina, em 113 slides, navegável no navegador: miniaturas, visão
geral com busca, tela cheia, gestos no celular e impressão em PDF.

## Conteúdo

1. **Inteligência Artificial** — conceitos, histórico, Teste de Turing, Quarto Chinês,
   a era dos modelos de fundação e o debate sobre riscos.
2. **Machine Learning** — aprendizado supervisionado, não supervisionado e por reforço,
   algoritmos, bases de dados e interpretabilidade.
3. **BI e Sistemas de Apoio à Decisão** — tipos de decisão, sobrecarga de dados,
   Business Intelligence, indicadores e apoio à decisão.

Dois slides têm figuras interativas: *Modelos de Fundação* compara treinar um modelo por
tarefa com adaptar um único modelo de fundação, e *Do dado ao indicador* percorre as
cinco etapas de um pipeline de BI.

## Desenvolvimento

```sh
npm install --legacy-peer-deps
npm run dev
npm test
```

O build é estático e a base vem da variável `BASE_PATH`, porque o GitHub Pages serve o
projeto em `/<repositório>/`:

```sh
BASE_PATH=/nome-do-repositorio/ npm run build
```

A saída fica em `dist/client`. O deploy é automático a cada push na `main`, pelo
workflow em `.github/workflows/deploy.yml`.

## Procedência do conteúdo

Os slides vêm de quatro arquivos de origem (`slide01.odp`, `slide02.odp`, `slides03.pdf`
e `slide4add.odp`) e ficam em `src/data/` sem alteração. Todo desvio em relação a eles —
remoções, mudanças de título, textos retirados e links adicionados — está declarado em
registros próprios em `src/lib/presentation.ts`, e os testes exigem que os originais
batam com a fonte exceto pelo que está registrado. Os slides escritos para esta versão
(modelos de fundação, o bloco de BI e o encerramento) não têm arquivo de origem e são
marcados como conteúdo adicionado.
