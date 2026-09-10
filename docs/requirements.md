# Requirements — TV Clone

## 1. Visão do Produto

### Nome
TV Clone

### Problema
O TV Time encerrou suas atividades em julho de 2026, deixando seus usuários sem uma plataforma para descobrir o que assistir, avaliar filmes e séries e organizar o que já viram ou pretendem ver. Concorrentes como o SofaTime tentam preencher esse vácuo, mas o mercado ainda carece de uma opção web simples e responsiva com esse conjunto de funcionalidades.

### Público
Pessoas que assistem regularmente filmes e séries e querem lembrar o que já viram, decidir o que assistir a seguir e registrar sua opinião sobre os títulos — sem depender de um aplicativo de celular.

### Proposta de solução
Uma plataforma web responsiva que consome a API do TMDB para exibir filmes e séries em cartaz e populares, permite ao usuário avaliar títulos com nota e comentário, e organizar títulos em listas personalizadas (ex: "Quero assistir", "Favoritos"), tudo salvo localmente no navegador.

## 2. Objetivo do MVP

Ao final do projeto, o usuário deve conseguir:
- Descobrir filmes e séries em destaque e buscar por título consumindo a API do TMDB.
- Ver detalhes de um filme ou série (sinopse, elenco, avaliação média do TMDB).
- Avaliar um filme ou série com nota (1 a 5) e comentário opcional, e ver suas avaliações depois.
- Criar listas personalizadas e adicionar/remover filmes e séries nelas.

## 3. Funcionalidades

### F01 — Descoberta de conteúdo

**Descrição:** Na página inicial, o usuário vê seções de filmes e séries em alta (populares) trazidas da API do TMDB, e pode buscar por título usando uma barra de busca. Os resultados levam à página de detalhes do título.

**Critérios de aceitação:**
- [ ] A home exibe ao menos uma seção de filmes populares e uma de séries populares, carregadas via `useEffect` a partir da API do TMDB.
- [ ] Existe um campo de busca que filtra filmes e séries pelo nome digitado.
- [ ] Cada card de filme/série exibido é clicável e leva à página de detalhes (`/titulo/:mediaType/:id`).
- [ ] Enquanto os dados da API não retornam, é exibido um estado de carregamento.
- [ ] Se a busca não encontrar nenhum resultado, é exibida uma mensagem de "nenhum resultado encontrado".

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio
- [x] Erro

### F02 — Avaliação de conteúdo

**Descrição:** Na página de detalhes de um filme ou série, o usuário pode dar uma nota de 1 a 5 estrelas e escrever um comentário opcional. As avaliações feitas pelo usuário ficam salvas no navegador e podem ser revisitadas na página de perfil.

**Critérios de aceitação:**
- [ ] A página de detalhes exibe um seletor de nota (1 a 5) e um campo de comentário.
- [ ] Ao salvar, a avaliação é persistida (localStorage) e associada ao título avaliado.
- [ ] Se o título já foi avaliado antes, a nota e o comentário salvos aparecem preenchidos ao reabrir a página.
- [ ] A página de perfil lista todas as avaliações já feitas pelo usuário, com nota, comentário e link para o título.
- [ ] Se o usuário ainda não avaliou nenhum título, a página de perfil exibe um estado vazio com uma chamada para ação.

**Estados:**
- [x] Inicial
- [ ] Carregando
- [x] Sucesso
- [x] Vazio
- [x] Erro

### F03 — Listas personalizadas

**Descrição:** O usuário pode criar listas próprias (ex: "Quero assistir", "Maratona de fim de semana"), adicionar filmes e séries a essas listas a partir da página de detalhes, e visualizar/gerenciar suas listas em uma página dedicada.

**Critérios de aceitação:**
- [ ] O usuário pode criar uma nova lista informando um nome.
- [ ] A partir da página de detalhes de um título, o usuário pode adicionar/remover esse título de uma ou mais listas existentes.
- [ ] A página "Minhas Listas" exibe todas as listas criadas e a quantidade de títulos em cada uma.
- [ ] Ao abrir uma lista, são exibidos todos os títulos adicionados a ela, com opção de remover.
- [ ] Se o usuário ainda não criou nenhuma lista, é exibido um estado vazio com uma chamada para ação para criar a primeira lista.

**Estados:**
- [x] Inicial
- [ ] Carregando
- [x] Sucesso
- [x] Vazio
- [ ] Erro

## 4. Fora do Escopo

- Autenticação/login de usuários e contas na nuvem (dados ficam apenas no navegador do usuário, via localStorage).
- Comunidade e discussão entre usuários (fórum, comentários públicos, seguir outros perfis).
- Onde assistir (integração com provedores de streaming por região).
- Notificações de novos episódios/lançamentos.
- Estatísticas avançadas de consumo (tempo total assistido, gráficos, etc.).
