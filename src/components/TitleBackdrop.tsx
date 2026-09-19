type TitleBackdropProps = {
  /** Imagem larga do título; `null` quando o TMDB não tem uma. */
  imageUrl: string | null;
};

/**
 * Fundo colorido no topo da página de detalhes, no estilo do Spotify: o banner do
 * título entra bem desfocado e um degradê por cima vai fechando na cor da página.
 *
 * O elemento ocupa a largura da janela (e não a da coluna de conteúdo) com o truque
 * de centralizar em `left-1/2` e puxar metade da própria largura de volta.
 */
export function TitleBackdrop({ imageUrl }: TitleBackdropProps) {
  if (!imageUrl) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-6 left-1/2 -z-10 h-96 w-screen -translate-x-1/2 overflow-hidden opacity-25"
    >
      {/*
        A escala evita que o desfoque deixe as bordas transparentes, e a saturação
        puxa a cor dominante do banner para frente — sem ela, banners escuros somem.
      */}
      <img
        src={imageUrl}
        alt=""
        className="size-full scale-150 object-cover blur-[100px] saturate-200 brightness-150"
      />

      <div className="absolute inset-0 bg-linear-to-b from-fundo/5 via-fundo/50 to-fundo" />
    </div>
  );
}
