import { ExternalLink, Tv } from "lucide-react";

import type { TitleProviders } from "../types";

type WhereToWatchProps = {
  /** `null` quando o TMDB não tem informação de streaming para o Brasil. */
  providers: TitleProviders | null;
};

export function WhereToWatch({ providers }: WhereToWatchProps) {
  const grupos = [
    { titulo: "Na assinatura", provedores: providers?.streaming || [] },
    { titulo: "Alugar", provedores: providers?.aluguel || [] },
    { titulo: "Comprar", provedores: providers?.compra || [] },
  ].filter((grupo) => grupo.provedores.length > 0);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-borda bg-superficie p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold">
          <Tv className="size-5 text-destaque" />
          Onde assistir no Brasil
        </h2>

        {providers?.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm text-texto-suave transition-colors hover:text-destaque"
          >
            Ver todas as opções
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>

      {grupos.length === 0 ? (
        <p className="text-sm text-texto-suave">
          O TMDB não tem informação de streaming deste título para o Brasil.
        </p>
      ) : (
        grupos.map((grupo) => (
          <div key={grupo.titulo} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-texto-suave uppercase">
              {grupo.titulo}
            </h3>

            <ul className="flex flex-wrap gap-2">
              {grupo.provedores.map((provedor) => (
                <li
                  key={provedor.id}
                  className="flex items-center gap-2 rounded-lg border border-borda bg-fundo py-1 pr-3 pl-1 text-sm"
                >
                  {provedor.logoUrl ? (
                    <img
                      src={provedor.logoUrl}
                      alt=""
                      className="size-8 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-md bg-superficie">
                      <Tv className="size-4 text-texto-suave" />
                    </span>
                  )}

                  {provedor.name.replace("with Ads", "com anúncios")}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <p className="text-xs text-texto-suave">Disponibilidade fornecida pelo JustWatch, via TMDB.</p>
    </section>
  );
}
