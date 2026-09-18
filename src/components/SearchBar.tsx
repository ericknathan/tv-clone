import { Search } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

type SearchBarProps = {
  onSearch: (termo: string) => void;
  initialTerm?: string;
};

export function SearchBar({ onSearch, initialTerm = "" }: SearchBarProps) {
  const [termo, setTermo] = useState(initialTerm);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onSearch(termo.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-borda bg-superficie px-3 py-2 transition-colors focus-within:border-destaque focus-within:ring-2 focus-within:ring-destaque/30">
        <Search className="size-4 text-texto-suave" />
        <input
          type="search"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          placeholder="Buscar filmes e séries"
          className="w-full bg-transparent text-sm outline-none placeholder:text-texto-suave"
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90"
      >
        Buscar
      </button>
    </form>
  );
}
