/** Larguras diferentes deixam os espaços reservados parecidos com os nomes reais. */
const CHIPS = ["w-36", "w-44", "w-40"];

/** Espelha o layout do WhereToWatch enquanto o TMDB não responde. */
export function WhereToWatchSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="flex animate-pulse flex-col gap-4 rounded-xl border border-borda bg-superficie p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="h-5 w-52 rounded bg-borda" />
        <div className="h-4 w-32 rounded bg-borda" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 rounded bg-borda" />

        <div className="flex flex-wrap gap-2">
          {CHIPS.map((largura) => (
            <div key={largura} className={`h-10 rounded-lg bg-borda ${largura}`} />
          ))}
        </div>
      </div>

      <div className="h-3 w-64 rounded bg-borda" />
    </section>
  );
}
