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
  /** Imagem larga do título, usada como fundo colorido na página de detalhes. */
  backdropUrl: string | null;
  /** Nota média do TMDB, de 0 a 10. */
  voteAverage: number;
};

/** Um serviço onde dá para assistir ao título (Netflix, HBO Max, etc.). */
export type WatchProvider = {
  id: number;
  name: string;
  logoUrl: string | null;
};

/** Onde assistir ao título no Brasil, separado por forma de acesso. */
export type TitleProviders = {
  /** Página do TMDB/JustWatch com todas as opções da região. */
  link: string | null;
  /** Incluído na assinatura, de graça ou com anúncios. */
  streaming: WatchProvider[];
  aluguel: WatchProvider[];
  compra: WatchProvider[];
};

/** Uma temporada de uma série, como aparece na lista de episódios. */
export type Season = {
  id: number;
  /** Número da temporada (1, 2, 3...). */
  number: number;
  name: string;
  episodeCount: number;
  year: string;
};

/** Um episódio dentro de uma temporada. */
export type Episode = {
  id: number;
  number: number;
  name: string;
  /** Data de exibição já formatada (dd/mm/aaaa) ou "" quando não há. */
  airDate: string;
  stillUrl: string | null;
  voteAverage: number;
};

/** Dados completos exibidos na página de detalhes. */
export type TitleDetail = TitleSummary & {
  overview: string;
  genres: string[];
  cast: string[];
  /** Temporadas da série; vazio para filmes. */
  seasons: Season[];
  /** `null` quando o TMDB não tem informação de streaming para o Brasil. */
  providers: TitleProviders | null;
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

/** Episódio que o usuário marcou como assistido. */
export type WatchedEpisode = {
  seriesId: number;
  seasonNumber: number;
  episodeId: number;
  watchedAt: string;
};

/** Lista personalizada criada pelo usuário. */
export type UserList = {
  id: string;
  name: string;
  items: TitleSummary[];
  createdAt: string;
};
