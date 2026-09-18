# References — TV Clone

## 1. Objetivo

As referências abaixo são prints reais do próprio TV Time (o produto original que estamos recriando), coletados antes do encerramento do app. Servem para justificar quais padrões de interface serão reaproveitados no MVP (descoberta, avaliação e listas) e quais foram conscientemente deixados de fora do escopo, conforme já registrado em `docs/requirements.md`.

## 2. Referência 01 — Busca de conteúdo

### Fonte
TV Time (app original, tela de busca)

### Imagem

![Referência 01](./imagens/referencia-01.webp)

### O que observamos?
A busca ("got") retorna uma lista única com filmes e séries misturados, cada card mostrando pôster, título, ano, tipo (TV Show/Movie), parte do elenco e a nota média em estrela. À direita de cada card há um botão de ação rápida: "+" para adicionar à lista, ou um check amarelo quando o título já foi adicionado.

### O que vamos aproveitar?
Resultado de busca único (filmes e séries juntos) com card compacto: pôster + título + ano + tipo + nota, e um botão de ação rápida de "adicionar" diretamente no card, sem precisar abrir os detalhes.

### Como será adaptado? (F01 — Descoberta)
O `TitleCard` reaproveita esse layout na Home e em `SearchResults` (pôster, título, ano, tipo e nota do TMDB) e tem o mesmo botão de ação rápida: um "+" que adiciona o título à lista "Quero assistir" e vira um check quando ele já está lá, exatamente como na referência. O botão também desfaz a ação: clicando de novo o título sai da lista, e o ícone vira um "X" ao passar o mouse para deixar isso claro.

Duas diferenças conscientes em relação ao print: o elenco **não** aparece no card, porque os endpoints de busca e de populares do TMDB não retornam elenco — buscá-lo exigiria uma requisição extra por card, então o elenco ficou só na página de detalhes (onde já vem junto com o resto). E o "+" adiciona direto na lista padrão em vez de abrir um seletor; escolher entre várias listas acontece no `ListPicker`, dentro dos detalhes.

## 3. Referência 02 — Perfil do usuário

### Fonte
TV Time (app original, tela de perfil)

### Imagem

![Referência 02](./imagens/referencia-02.webp)

### O que observamos?
O perfil abre com identidade (avatar, nome, @usuário, seguidores/seguindo), depois um bloco de estatísticas em destaque (tempo total assistido) e, abaixo, carrosséis "Recently Watched Series" e "Recently Watched Movies".

### O que vamos aproveitar?
A estrutura geral da página — um cabeçalho de identidade seguido de listas de atividade do usuário — para organizar a página `Profile`.

### Como será adaptado? (F02 — Avaliação)
Como estatísticas de tempo assistido e seguidores/seguindo estão fora do escopo do MVP (ver `requirements.md`, seção "Fora do Escopo"), a página `Profile` do TV Clone vai manter só a identidade simples do usuário local e, no lugar dos carrosséis de "assistido recentemente", vai listar as avaliações feitas (nota + comentário + link para o título), que é a informação que de fato guardamos.

## 4. Referência 03 — Listas (Watch List / In Progress / Completed)

### Fonte
TV Time (app original, tela principal de acompanhamento)

### Imagem

![Referência 03](./imagens/referencia-03.webp)

### O que observamos?
A tela principal separa o conteúdo em abas (Shows/Movies/Upcoming) e, dentro dela, sub-abas de lista (Watch List, In Progress, Completed). Cada item mostra progresso ("Caught up · S01-E04 in 3 days"), uma barra de progresso, episódios restantes e a nota do título.

### O que vamos aproveitar?
O conceito central de várias listas nomeadas (não só uma "watchlist" genérica) navegáveis por abas, cada uma mostrando quantos itens contém.

### Como será adaptado? (F03 — Listas personalizadas)
A página `Lists` vai adaptar essa ideia de abas para listas *criadas pelo próprio usuário* (em vez de fixas como "In Progress"/"Completed"), já que não fazemos acompanhamento de episódio a episódio. Cada lista mostra seus títulos com o mesmo card compacto da Referência 01, sem a barra de progresso de episódios (que depende de dado que não coletamos no MVP).

## 5. Padrão presente nas três referências — navegação inferior

As telas de busca, perfil e acompanhamento (Referências 01, 02 e 03) têm em comum uma barra de navegação fixa no rodapé, com poucos itens representados por ícone + rótulo e o item atual destacado em amarelo.

**Como foi adaptado:** no celular, os links de navegação saem do topo e viram o componente `BottomNav`, fixo na parte de baixo da tela, com Início, Listas e Perfil — a mesma lógica de ícone + rótulo e destaque do item ativo. Como o TV Clone é uma plataforma web (e não um app), a partir de telas maiores essa barra desaparece e a navegação volta para o `Header`, que é o padrão esperado no desktop. O campo de busca fica no `Header` nos dois tamanhos, em vez de ocupar um item da barra inferior como no app original.

## 6. Referências observadas e deixadas fora do escopo

As três telas abaixo também foram analisadas, mas mostram funcionalidades que já decidimos não incluir no MVP — estão aqui para documentar que a decisão foi consciente, não por desconhecimento do produto original.

### Referência 04 — Lista de episódios por temporada

![Referência 04](./imagens/referencia-04.webp)

Mostra o controle de episódios assistidos, agrupado por temporada, com check individual por episódio. Não será replicado porque o MVP trata avaliação e listas no nível de título (filme/série), não de episódio — acompanhar episódio a episódio está listado em "Fora do Escopo".

### Referência 05 — Seguir atores

![Referência 05](./imagens/referencia-05.webp)

Mostra uma lista de atores seguidos pelo usuário. Não será replicado porque comunidade/seguir pessoas ou atores está listado em "Fora do Escopo" do MVP.

### Referência 06 — Lançamentos futuros (Upcoming)

![Referência 06](./imagens/referencia-06.webp)

Mostra um calendário de próximos episódios/lançamentos agrupado por data, com informações de elenco. Não será replicado porque notificações de lançamento e calendário estão listados em "Fora do Escopo" do MVP.
