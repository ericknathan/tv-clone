# Architecture — TV Clone

## 1. Visão Geral

O TV Clone é uma SPA em React (Vite) com React Router para navegação entre páginas. Os dados de filmes e séries vêm da API do TMDB, consumidos via `useEffect` + `fetch` em cada página que precisa deles. Não há backend próprio: avaliações e listas do usuário são guardadas no navegador (`localStorage`), acessadas através de um Context (`AppDataContext`) que expõe estado e funções para as páginas e componentes, evitando prop drilling entre páginas distantes na árvore.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── TitleCard.tsx
│   ├── SearchBar.tsx
│   ├── RatingStars.tsx
│   ├── ListPicker.tsx
│   ├── EmptyState.tsx
│   └── LoadingSpinner.tsx
├── pages/
│   ├── Home.tsx
│   ├── SearchResults.tsx
│   ├── TitleDetails.tsx
│   ├── Lists.tsx
│   ├── ListDetails.tsx
│   └── Profile.tsx
├── context/
│   └── AppDataContext.tsx
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
| Home | `/` | Descobrir filmes e séries populares (F01) e acessar a busca |
| SearchResults | `/buscar?q=termo` | Exibir resultados da busca por título (F01) |
| TitleDetails | `/titulo/:mediaType/:id` | Ver detalhes de um filme/série, avaliar (F02) e adicionar a listas (F03) |
| Lists | `/listas` | Ver todas as listas personalizadas do usuário (F03) |
| ListDetails | `/listas/:listId` | Ver e gerenciar os títulos de uma lista específica (F03) |
| Profile | `/perfil` | Ver o histórico de avaliações feitas pelo usuário (F02) |

Todas as páginas compartilham um layout comum (`App.tsx` com `<Outlet />`) que renderiza `Header` (navegação + `SearchBar`) e `Footer`.

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| Header | Navegação entre páginas e busca global | — (usa `useNavigate` internamente) |
| SearchBar | Campo de busca que redireciona para `/buscar?q=` | `onSearch: (termo: string) => void` |
| TitleCard | Exibir pôster, nome e nota de um filme/série em uma grade | `title: TitleSummary`, `onClick?: () => void` |
| RatingStars | Seletor/exibição de nota de 1 a 5 estrelas | `value: number`, `onChange?: (nota: number) => void`, `readOnly?: boolean` |
| ListPicker | Checklist de listas do usuário para adicionar/remover um título | `titleId: number`, `mediaType: 'movie' \| 'tv'` |
| EmptyState | Mensagem + ilustração/ícone para estados vazios | `title: string`, `description: string`, `actionLabel?: string`, `onAction?: () => void` |
| LoadingSpinner | Indicador de carregamento reutilizável | `label?: string` |

## 5. Estado da Aplicação

| Estado | Onde será controlado? | Por quê? |
|---|---|---|
| Resultados da API (populares, busca, detalhes) | `useState` local em cada página (Home, SearchResults, TitleDetails) | Cada página consome um endpoint diferente do TMDB; não precisa ser compartilhado entre páginas |
| Termo de busca digitado | `useState` no `Header`/`SearchBar` | Estado de UI local ao componente de input |
| Avaliações do usuário (nota + comentário por título) | `AppDataContext`, persistido em `localStorage` | Precisa ser lido tanto em `TitleDetails` (para pré-preencher) quanto em `Profile` (para listar todas) |
| Listas personalizadas e seus títulos | `AppDataContext`, persistido em `localStorage` | Precisa ser lido/alterado em `TitleDetails` (adicionar título), `Lists` e `ListDetails` (gerenciar) |
| Estado de carregamento/erro de cada requisição | `useState` local em cada página que faz `fetch` | Cada requisição tem seu próprio ciclo de vida (idle/loading/success/error) |

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Buscar populares | Ao montar `Home` | `fetch` em `/movie/popular` e `/tv/popular` do TMDB e guarda o resultado em estado |
| Buscar por termo | Ao montar `SearchResults` ou quando o parâmetro `q` da URL muda | `fetch` em `/search/multi` do TMDB com o termo da query string |
| Buscar detalhes do título | Ao montar `TitleDetails` ou quando `:id`/`:mediaType` mudam na rota | `fetch` em `/movie/:id` ou `/tv/:id` do TMDB |
| Carregar dados salvos do usuário | Ao montar `AppDataContext` (uma vez, no topo da árvore) | Lê avaliações e listas do `localStorage` para o estado inicial do contexto |
| Persistir dados do usuário | Sempre que avaliações ou listas mudam no `AppDataContext` | Grava o estado atual de volta no `localStorage` |

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| react-router | Rotas, layouts e rotas dinâmicas (`/titulo/:mediaType/:id`, `/listas/:listId`) | Exigência técnica do CP; navegação entre as 6 páginas do produto |
| tailwindcss | Estilização utilitária dos componentes e páginas | Já configurado no projeto base; agiliza a estilização responsiva |
| lucide-react | Biblioteca de ícones (busca, estrela, adicionar à lista, etc.) | Exigência técnica do CP; ícones consistentes e leves |
| TMDB API | Fonte de dados de filmes e séries (populares, busca, detalhes) | API gratuita e completa, escolhida como fonte de dados do produto |
