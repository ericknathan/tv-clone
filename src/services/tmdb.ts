import type { MediaType, TitleDetail, TitleSummary } from "../types";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w342";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/** Formato aproximado do que o TMDB devolve, só com os campos que usamos. */
type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  vote_average?: number;
  media_type?: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  credits?: { cast?: { name: string }[] };
};

/** Monta a URL, faz a requisição e transforma os erros em mensagens em português. */
async function buscarNoTmdb(caminho: string, extras: Record<string, string> = {}) {
  if (!API_KEY) {
    throw new Error(
      "Chave da API do TMDB não configurada. Crie um arquivo .env.local com VITE_TMDB_API_KEY.",
    );
  }

  const parametros = new URLSearchParams({
    api_key: API_KEY,
    language: "pt-BR",
    ...extras,
  });

  const resposta = await fetch(`${BASE_URL}${caminho}?${parametros}`);

  if (!resposta.ok) {
    if (resposta.status === 401) {
      throw new Error("Chave da API do TMDB inválida. Confira o arquivo .env.local.");
    }
    if (resposta.status === 404) {
      throw new Error("Título não encontrado no TMDB.");
    }
    throw new Error("Não foi possível carregar os dados do TMDB. Tente novamente.");
  }

  return resposta.json();
}

/** Converte um item do TMDB para o formato usado na aplicação. */
function paraResumo(item: TmdbItem, mediaType: MediaType): TitleSummary {
  const data = item.release_date || item.first_air_date || "";

  return {
    id: item.id,
    mediaType,
    name: item.title || item.name || "Sem título",
    year: data.slice(0, 4),
    posterUrl: item.poster_path ? IMAGE_URL + item.poster_path : null,
    voteAverage: item.vote_average || 0,
  };
}

/** Filmes ou séries populares do momento (usado na Home). */
export async function getPopulares(mediaType: MediaType): Promise<TitleSummary[]> {
  const dados = await buscarNoTmdb(`/${mediaType}/popular`);
  const itens: TmdbItem[] = dados.results || [];

  return itens.map((item) => paraResumo(item, mediaType));
}

/** Busca por nome. O TMDB também devolve pessoas, que são descartadas aqui. */
export async function buscarTitulos(termo: string): Promise<TitleSummary[]> {
  const dados = await buscarNoTmdb("/search/multi", {
    query: termo,
    include_adult: "false",
  });
  const itens: TmdbItem[] = dados.results || [];

  return itens
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => paraResumo(item, item.media_type as MediaType));
}

/** Detalhes completos de um título, incluindo gêneros e elenco principal. */
export async function getDetalhes(mediaType: MediaType, id: number): Promise<TitleDetail> {
  const item: TmdbItem = await buscarNoTmdb(`/${mediaType}/${id}`, {
    append_to_response: "credits",
  });

  return {
    ...paraResumo(item, mediaType),
    overview: item.overview || "Sinopse não disponível em português.",
    genres: (item.genres || []).map((genero) => genero.name),
    cast: (item.credits?.cast || []).slice(0, 8).map((pessoa) => pessoa.name),
  };
}
