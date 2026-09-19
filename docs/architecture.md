# Architecture — TV Clone

## 1. Visão Geral

O TV Clone é uma SPA em React (Vite + TypeScript) com React Router para a navegação entre páginas. Os dados de filmes e séries vêm da API do TMDB, consumidos com `fetch` dentro de `useEffect` em cada página que precisa deles. Não há backend próprio: avaliações e listas do usuário ficam no `localStorage` do navegador, controladas por um Context (`AppDataContext`) que expõe o estado e as funções para as páginas e componentes, evitando repassar props entre páginas distantes na árvore.

Toda conversão dos dados crus do TMDB acontece em `services/tmdb.ts`, então nenhuma página precisa lidar com os nomes de campo originais da API (`title` vs `name`, `poster_path`, etc.).

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Footer.tsx
│   │   └── ListsLayout.tsx
│   ├── TitleCard.tsx
│   ├── TitleCardSkeleton.tsx
│   ├── WhereToWatch.tsx
│   ├── WhereToWatchSkeleton.tsx
│   ├── TitleDetailsSkeleton.tsx
│   ├── SearchBar.tsx
│   ├── RatingStars.tsx
│   ├── ListPicker.tsx
│   └── EmptyState.tsx
├── context/
│   └── AppDataContext.tsx
├── pages/
│   ├── Home.tsx
│   ├── SearchResults.tsx
│   ├── TitleDetails.tsx
│   ├── Lists.tsx
│   ├── ListDetails.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
├── services/
│   └── tmdb.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 3. Páginas e Rotas

| Página | Rota | Objetivo |
|---|---|---|
| Home | `/` | Descobrir filmes e séries populares (F01) |
| SearchResults | `/buscar?q=termo` | Exibir os resultados da busca por título (F01) |
| TitleDetails | `/titulo/:mediaType/:id` | Detalhes do título, onde assistir (F04), avaliação (F02) e adição a listas (F03) |
| Lists | `/listas` | Criar e ver todas as listas personalizadas (F03) |
| ListDetails | `/listas/:listId` | Ver e gerenciar os títulos de uma lista (F03) |
| Profile | `/perfil` | Ver o histórico de avaliações do usuário (F02) |
| NotFound | `*` | Mensagem para endereços que não existem |

São dois layouts: `App.tsx` é o layout principal (`Header` + `<Outlet />` + `Footer` + `BottomNav`) e `ListsLayout` é um layout aninhado que mantém o título da seção fixo enquanto `/listas` e `/listas/:listId` se alternam no `<Outlet />`. As rotas são declaradas com `createBrowserRouter` em `main.tsx`.

A navegação muda conforme a largura da tela: no desktop os links ficam no `Header`, e no celular eles saem do topo e viram uma barra fixa embaixo (`BottomNav`), como no aplicativo original. O campo de busca continua no `Header` nos dois casos.

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| Header | Busca global e, no desktop, a navegação entre as páginas | — |
| BottomNav | Navegação fixa na parte de baixo da tela, só no celular | — |
| Footer | Créditos do projeto e da API | — |
| ListsLayout | Layout aninhado das páginas de listas | — |
| SearchBar | Campo de busca controlado que devolve o termo digitado | `onSearch: (termo: string) => void`, `initialTerm?: string` |
| TitleCard | Card de um filme/série: pôster, nome, ano, tipo e nota do TMDB | `title: TitleSummary`, `onQuickToggle?: (title) => void`, `isAdded?: boolean`, `onRemove?: () => void` |
| RatingStars | Seletor/exibição da nota do usuário (0,5 a 5 estrelas, com meia estrela) | `value: number`, `onChange?: (nota) => void`, `readOnly?: boolean` |
| ListPicker | Marca em quais listas o título está e permite criar uma nova | `title: TitleSummary` |
| WhereToWatch | Serviços de streaming do título no Brasil, agrupados por forma de acesso | `providers: TitleProviders \| null` |
| EmptyState | Mensagem de estado vazio ou de erro, com ação opcional | `title`, `description`, `actionLabel?`, `onAction?`, `variant?: "vazio" \| "erro"` |
| TitleCardSkeleton | Placeholder animado com o mesmo formato do `TitleCard` | — |
| TitleDetailsSkeleton | Placeholder animado com o mesmo formato da página de detalhes | — |
| WhereToWatchSkeleton | Placeholder animado da seção de streaming, usado enquanto o TMDB responde | — |

`TitleCard` navega usando `<Link>`, para que o card funcione como um link de verdade (abrir em nova aba, por exemplo). O botão `onQuickToggle` é o "+" da Referência 01: coloca o título na lista padrão "Quero assistir" e, se ele já estiver lá, tira — o mesmo botão faz as duas coisas, e o ícone vira um "X" ao passar o mouse para avisar disso. Já `onRemove` é o botão de lixeira usado na página de uma lista.

O estado de carregamento é sempre representado por skeletons com o formato do conteúdo que vai aparecer, e não por um indicador genérico: como o placeholder ocupa o mesmo espaço do card real, a página não muda de altura quando os dados do TMDB chegam.

A troca de página usa a View Transitions API, ligada pelo `viewTransition` dos links do React Router. O pôster do card e o pôster da página de detalhes compartilham o mesmo `view-transition-name`, então a imagem cresce de um lugar para o outro em vez de sumir e reaparecer. Para isso funcionar, o `TitleCard` manda o `TitleSummary` junto na navegação (`state`), e `TitleDetails` usa esse resumo para desenhar o pôster e o título na hora, deixando o skeleton só para a sinopse e o elenco, que dependem da resposta da API. O `useViewTransitionState` garante que só o card clicado receba o nome da transição — se todos recebessem, o navegador teria que fotografar os 40 cards da página a cada navegação.

As respostas a uma ação do usuário (avaliação salva, tentativa de salvar sem nota) aparecem como toast do `sonner`, disparado pelo `toast.success`/`toast.error` no próprio manipulador do formulário. Já as falhas que impedem a página inteira de funcionar — como o TMDB fora do ar — continuam no `EmptyState`, porque nesse caso não há conteúdo para mostrar atrás do aviso e o usuário precisa do botão de tentar novamente.

## 5. Estado da Aplicação

| Estado | Onde será controlado? | Por quê? |
|---|---|---|
| Resultados da API (populares, busca, detalhes) | `useState` local em `Home`, `SearchResults` e `TitleDetails` | Cada página consome um endpoint diferente; o dado não é compartilhado entre elas |
| Carregando / erro de cada requisição | `useState` local na página que faz o `fetch` | Cada requisição tem seu próprio ciclo (carregando, sucesso, vazio, erro) |
| Termo de busca digitado | `useState` no `SearchBar` | Estado de UI que só interessa ao campo de input |
| Nota e comentário sendo editados | `useState` em `TitleDetails` | Só existem enquanto o usuário preenche o formulário |
| Avaliações do usuário | `AppDataContext`, salvo no `localStorage` | Lido em `TitleDetails` (para pré-preencher) e em `Profile` (para listar) |
| Listas personalizadas | `AppDataContext`, salvo no `localStorage` | Lido e alterado em `TitleCard`, `ListPicker`, `Lists` e `ListDetails` |

As avaliações e as listas guardam uma cópia dos dados do título (`TitleSummary`). É isso que permite ao `Profile` e ao `ListDetails` renderizarem direto do `localStorage`, sem uma requisição por item.

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Buscar populares | Ao montar `Home` | `fetch` em `/movie/popular` e `/tv/popular` do TMDB |
| Buscar por termo | Ao montar `SearchResults` e quando o `q` da URL muda | `fetch` em `/search/multi` do TMDB |
| Buscar detalhes | Ao montar `TitleDetails` e quando `:mediaType`/`:id` mudam | `fetch` em `/movie/:id` ou `/tv/:id` com `append_to_response=credits,watch/providers`, trazendo detalhes, elenco e streaming de uma vez |
| Preencher o formulário de avaliação | Ao montar `TitleDetails` e ao trocar de título | Copia a nota e o comentário já salvos para o estado do formulário. Depende do título e da carga inicial, e não de `reviews`: depois de aberto, quem manda no conteúdo do formulário é o usuário |
| Carregar dados salvos | Ao montar o `AppDataProvider` | Lê avaliações e listas do `localStorage` |
| Salvar dados | Sempre que avaliações ou listas mudam | Grava o estado atual no `localStorage` |

Os três efeitos que chamam a API usam uma variável `ativo` na função de limpeza, para descartar respostas que chegam depois de o usuário já ter mudado de busca ou de página.

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| react-router | Rotas, layouts e rotas dinâmicas (`/titulo/:mediaType/:id`, `/listas/:listId`) | Exigência do CP; navegação entre as páginas do produto |
| tailwindcss | Estilização das páginas e componentes | Já vem no template; agiliza o layout responsivo |
| lucide-react | Biblioteca de ícones (busca, estrela, adicionar, remover) | Exigência do CP; ícones leves e consistentes |
| sonner | Avisos de sucesso e erro em toast (`<Toaster />` no layout principal) | Mensagem aparece sem empurrar o conteúdo da página e some sozinha |
| API do TMDB | Fonte dos dados de filmes e séries | API gratuita e completa, com conteúdo em português |
