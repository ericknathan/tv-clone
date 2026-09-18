# TV Clone

Plataforma web responsiva para descobrir, avaliar e organizar filmes e séries, uma alternativa para o falecido TV Time em julho de 2026.

Projeto do **CP1 2º trimestre de WebDev (FIAP)**.

## Integrantes

- Erick Nathan Capito Pereira - RM573635
- Murilo Vasconcelos Gomes - RM570941

## Problema selecionado

Dos problemas propostos no enunciado, o TV Clone ataca três:

1. **Descobrir o que assistir:** a pessoa não sabe o que ver e não tem um lugar único para explorar o que está em alta.
2. **Registrar opiniões e avaliações:** sem o TV Time, não há onde guardar a nota e o que se achou de cada título.
3. **Criar listas personalizadas:** falta um lugar para separar o que se quer assistir depois.

## Solução proposta

Uma aplicação web onde o usuário:

- vê os filmes e séries populares do momento e busca por qualquer título;
- abre a página de um título e registra sua nota (0,5 a 5 estrelas) e um comentário;
- organiza títulos em listas que ele mesmo cria, e revê tudo isso no perfil.

Como o projeto não tem backend, as avaliações e listas ficam salvas no `localStorage` do próprio navegador.

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| React 19 + TypeScript | Componentização e tipagem da aplicação |
| Vite | Servidor de desenvolvimento e build |
| React Router | Rotas, layouts e rotas dinâmicas |
| Tailwind CSS v4 | Estilização e responsividade |
| lucide-react | Biblioteca de ícones |
| sonner | Avisos de sucesso e erro em toast |
| localStorage | Persistência das avaliações e listas |

## API utilizada

[TMDB: The Movie Database](https://www.themoviedb.org/). Endpoints consumidos:

- `GET /movie/popular` e `GET /tv/popular`: destaques da Home
- `GET /search/multi`: busca de filmes e séries
- `GET /movie/{id}` e `GET /tv/{id}` com `append_to_response=credits`: detalhes, gêneros e elenco

Todas as chamadas usam `language=pt-BR` e são feitas com `fetch` dentro de `useEffect`.

## Funcionalidades implementadas

- **F01 - Descoberta:** Home com "Filmes em alta" e "Séries em alta"; busca por nome com a URL compartilhável (`/buscar?q=matrix`); estados de carregando, vazio e erro (com botão de tentar novamente).
- **F02 - Avaliação:** nota de 0,5 a 5 estrelas (com meia estrela e prévia no hover) e comentário por título, salvos no navegador; o formulário volta preenchido ao reabrir o título e o botão passa a ser "Atualizar avaliação"; histórico completo no perfil.
- **F03 - Listas:** criação de listas com nome livre; adicionar/remover títulos pelo seletor na página de detalhes; botão "+" nos cards para jogar direto na lista "Quero assistir"; página de cada lista com a contagem e a remoção de itens.

Detalhamento e critérios de aceitação em [`docs/requirements.md`](docs/requirements.md); páginas, componentes, estados e efeitos em [`docs/architecture.md`](docs/architecture.md); referências de interface em [`docs/references/references.md`](docs/references/references.md).

## Como executar

```bash
# 1. instalar as dependências
npm install

# 2. configurar a chave da API
cp .env.example .env.local
# abra o .env.local e preencha VITE_TMDB_API_KEY com a sua chave do TMDB
# (crie a sua em https://www.themoviedb.org/settings/api)

# 3. rodar em desenvolvimento
npm run dev
```

Outros comandos:

```bash
npm run lint      # oxlint
npm run build     # checagem de tipos + build de produção
npm run preview   # serve o build de produção
```

## Deploy

O projeto está preparado para a Vercel:

- `vercel.json` já contém o *rewrite* de SPA, para que endereços como `/titulo/tv/1399` funcionem ao serem abertos direto.
- A variável `VITE_TMDB_API_KEY` precisa ser cadastrada em **Settings → Environment Variables** do projeto na Vercel.

Observação: variáveis `VITE_*` são embutidas no código enviado ao navegador, ou seja, a chave fica visível no bundle. Para uma chave v3 do TMDB em um projeto acadêmico isso é aceitável; em produção o ideal seria um backend intermediando as chamadas.

## Uso de IA

A IA (Claude Code) foi usada como apoio em todas as etapas: levantamento da documentação de especificação e arquitetura, escrita do código das páginas e componentes, e verificação do resultado no navegador. As decisões de produto (quais problemas atacar, quais funcionalidades entram no MVP), as decisões estéticas (tema escuro com destaque amarelo, inspirado nas telas reais do TV Time) e as decisões técnicas (Context API para os dados do usuário, `localStorage` no lugar de backend, TMDB como fonte de dados) foram tomadas e revisadas por nós, assim como o código entregue.
