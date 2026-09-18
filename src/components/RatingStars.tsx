import { Star } from "lucide-react";
import { useState } from "react";

type RatingStarsProps = {
  /** Nota atual, de 0 (sem nota) a 5, podendo ser quebrada (3,5 por exemplo). */
  value: number;
  onChange?: (nota: number) => void;
  readOnly?: boolean;
};

const ESTRELAS = [1, 2, 3, 4, 5];

/** Mostra 4 como "4" e 3.5 como "3,5". */
function formatarNota(nota: number) {
  return nota.toLocaleString("pt-BR");
}

/** Nota do usuário, de 0,5 a 5 estrelas. Não tem relação com a nota do TMDB (0 a 10). */
export function RatingStars({ value, onChange, readOnly = false }: RatingStarsProps) {
  // Nota que o mouse está apontando no momento; 0 quando não há hover.
  const [notaEmFoco, setNotaEmFoco] = useState(0);

  // Durante o hover mostramos a nota apontada, para o usuário ver o que vai selecionar.
  const notaExibida = notaEmFoco || value;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setNotaEmFoco(0)}
      >
        {ESTRELAS.map((estrela) => {
          // Quanto desta estrela fica pintado: 0 (vazia), 0.5 (metade) ou 1 (cheia).
          const preenchimento = Math.min(1, Math.max(0, notaExibida - (estrela - 1)));

          return (
            <div key={estrela} className="relative size-6">
              <Star className="size-6 text-texto-suave" />

              {/* A estrela colorida fica por cima, cortada na largura do preenchimento. */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${preenchimento * 100}%` }}
              >
                <Star className="size-6 fill-destaque text-destaque" />
              </div>

              {!readOnly && (
                <>
                  {/* Metade esquerda da estrela seleciona a nota quebrada (2,5), a direita a inteira (3). */}
                  <button
                    type="button"
                    onClick={() => onChange?.(estrela - 0.5)}
                    onMouseEnter={() => setNotaEmFoco(estrela - 0.5)}
                    aria-label={`Dar nota ${formatarNota(estrela - 0.5)}`}
                    className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => onChange?.(estrela)}
                    onMouseEnter={() => setNotaEmFoco(estrela)}
                    aria-label={`Dar nota ${formatarNota(estrela)}`}
                    className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <span className="text-sm text-texto-suave">
        {notaExibida > 0 ? `${formatarNota(notaExibida)} de 5` : "Sem nota"}
      </span>
    </div>
  );
}
