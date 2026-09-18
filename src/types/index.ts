// Tipos usados em toda a aplicação.
// Os dados do TMDB são convertidos para estes formatos dentro de services/tmdb.ts,
// então nenhuma página precisa lidar com os nomes de campo originais da API.

export type MediaType = "movie" | "tv";

/** Versão resumida de um filme ou série, usada nos cards e nas listagens. */
export type TitleSummary = {
  id: number;
  mediaType: MediaType;
  name: string;
  year: string;
  posterUrl: string | null;
  /** Nota média do TMDB, de 0 a 10. */
  voteAverage: number;
};

/** Dados completos exibidos na página de detalhes. */
export type TitleDetail = TitleSummary & {
  overview: string;
  genres: string[];
  cast: string[];
};

/** Avaliação feita pelo usuário e guardada no navegador. */
export type Review = {
  mediaType: MediaType;
  titleId: number;
  /** Nota do usuário, de 0,5 a 5 estrelas (aceita meia estrela). */
  rating: number;
  comment: string;
  /** Cópia dos dados do título, para o perfil renderizar sem consultar a API. */
  title: TitleSummary;
  createdAt: string;
};

/** Lista personalizada criada pelo usuário. */
export type UserList = {
  id: string;
  name: string;
  items: TitleSummary[];
  createdAt: string;
};
