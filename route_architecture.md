# Arquitetura de navegação e fluxos principais — SINACE

## Estratégia geral

A aplicação deve operar em duas superfícies complementares. A primeira continua sendo a **camada pública institucional**, voltada à apresentação da proposta SINACE, geração de confiança e captação de parceiros. A segunda é a **camada autenticada de workspace**, que concentra a operação diária da plataforma, a aprendizagem, a curadoria clínica e a administração.

## Mapa de rotas recomendado

| Rota | Camada | Objetivo | Acesso |
|---|---|---|---|
| `/` | Pública | Landing page institucional da SINACE | Público |
| `/login` | Pública/apoio | Entrada conceitual para autenticação, com redirecionamento | Público |
| `/app` | Autenticada | Dashboard executivo inicial | Usuário autenticado |
| `/app/especialidades` | Autenticada | Catálogo nacional de especialidades cirúrgicas e relacionadas | Usuário autenticado |
| `/app/especialidades/:slug` | Autenticada | Visão detalhada por especialidade | Usuário autenticado |
| `/app/trilhas` | Autenticada | Catálogo de trilhas de estudo e formação | Usuário autenticado |
| `/app/trilhas/:id` | Autenticada | Página de trilha com módulos, materiais e progresso | Usuário autenticado |
| `/app/biblioteca` | Autenticada | Acervo documental, arquivos e protocolos | Usuário autenticado |
| `/app/casos` | Autenticada | Repositório de casos clínicos | Usuário autenticado |
| `/app/casos/:id` | Autenticada | Visualização estruturada de caso clínico | Usuário autenticado |
| `/app/enciclopedia` | Autenticada | Enciclopédia médico-cirúrgica | Usuário autenticado |
| `/app/parceiros` | Autenticada | Cadastro e visão dos parceiros institucionais | Usuário autenticado |
| `/app/instituicoes` | Autenticada | Hospitais, unidades, OSS e vínculos | Usuário autenticado |
| `/app/professores` | Autenticada | Área de coordenação e autores | Usuário autenticado |
| `/app/alunos` | Autenticada | Gestão de alunos, progresso e vínculos | Usuário autenticado |
| `/app/admin` | Autenticada | Configurações, taxonomias, permissões e governança | Administrador |

## Grupos de navegação na sidebar

A sidebar do workspace deve ser organizada em blocos semânticos, reduzindo ruído visual e ajudando o usuário a compreender a natureza híbrida da plataforma.

| Grupo | Itens |
|---|---|
| Visão geral | Dashboard |
| Formação e conteúdo | Especialidades, Trilhas, Biblioteca, Casos Clínicos, Enciclopédia |
| Rede institucional | Parceiros, Instituições |
| Comunidade acadêmica | Professores, Alunos |
| Governança | Administração |

## Fluxos principais do usuário

### Fluxo 1 — acesso institucional

O visitante chega pela landing page, compreende a proposta da SINACE, identifica áreas de atuação e acessa o ambiente autenticado quando necessário. Esse fluxo preserva o posicionamento institucional já construído e o conecta a um produto mais robusto.

### Fluxo 2 — descoberta por especialidade

O usuário autenticado entra no workspace, navega até **Especialidades**, escolhe uma linha cirúrgica e, a partir dela, descobre trilhas, documentos, casos clínicos e verbetes relacionados. Esse fluxo faz da especialidade a principal porta de entrada temática do produto.

### Fluxo 3 — aprendizagem orientada

O aluno ou profissional acessa **Trilhas**, entra em uma jornada específica e percorre módulos, materiais e casos vinculados. O sistema registra progresso e evidencia próximos passos, mantendo continuidade pedagógica.

### Fluxo 4 — consulta rápida

O profissional pode entrar diretamente na **Biblioteca**, em **Casos Clínicos** ou na **Enciclopédia** para resolver uma dúvida objetiva, sem obrigatoriedade de seguir uma trilha completa.

### Fluxo 5 — governança institucional

Gestores e administradores utilizam **Parceiros**, **Instituições** e **Administração** para controlar presença territorial, ativação por especialidade, vínculos de usuários e consistência da operação.

## Regras de experiência

O workspace deve usar layout persistente com sidebar, cabeçalho enxuto e área principal responsiva. A landing pública não deve adotar o visual de dashboard. Já a área autenticada precisa privilegiar legibilidade, filtro, busca, cards utilitários, listas e páginas de detalhe, com uma estética institucional-clínica coerente com a identidade da SINACE.

## Decisão para a implementação seguinte

A implementação imediata deve criar a casca do workspace em `/app`, estabelecer a sidebar estruturada e montar páginas-base navegáveis para os módulos principais, ainda que algumas telas iniciem com estados vazios e dados seed, desde que a arquitetura já esteja correta e escalável.
