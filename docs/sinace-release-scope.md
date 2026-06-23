# Escopo funcional da versão atual do SINACE

Este documento consolida o **escopo funcional fechado** da versão atual do SINACE, com foco na convergência entre a presença institucional pública e o workspace autenticado do produto. O objetivo é registrar, de forma rastreável, o que já está efetivamente estruturado no projeto e quais superfícies compõem esta release.

A versão atual do produto está organizada em dois eixos complementares. O primeiro eixo é a **landing pública institucional**, voltada para posicionamento, proposta de valor, cobertura assistencial e captação institucional. O segundo eixo é o **workspace autenticado**, estruturado como ambiente operacional e educacional, com módulos navegáveis para especialidades, trilhas, biblioteca, casos clínicos, enciclopédia, parceiros, instituições, professores, alunos e administração.

## Superfícies contempladas nesta versão

| Superfície | Objetivo principal | Situação na versão |
| --- | --- | --- |
| Landing pública (`/`) | Apresentar a proposta institucional da SINACE, a narrativa de cobertura e a lista nominal das especialidades | Implementada |
| Workspace autenticado (`/app`) | Centralizar navegação e contexto institucional da plataforma | Implementado |
| Dashboard autenticado | Exibir visão geral do ecossistema SINACE dentro do workspace | Implementado |
| Catálogo de especialidades | Expor a taxonomia cirúrgica persistente no aplicativo | Implementado |
| Trilhas | Organizar trilhas de estudo e navegação formativa | Implementado |
| Biblioteca | Reunir documentos e materiais de consulta | Implementado |
| Casos clínicos | Relacionar observações operacionais e insumos de apoio | Implementado |
| Enciclopédia | Estruturar verbetes e navegação por especialidades com base persistente | Implementado |
| Parceiros | Apresentar a rede parceira e vínculos institucionais | Implementado |
| Instituições | Exibir a malha institucional relacionada ao ecossistema SINACE | Implementado |
| Professores | Organizar a dimensão docente associada à oferta educacional | Implementado |
| Alunos | Organizar a dimensão discente e de oferta formativa | Implementado |
| Administração | Manter a gestão da taxonomia e de elementos centrais do domínio | Implementado |

## Estrutura funcional da release

A release atual foi concebida como um **produto unificado de operação e educação**. Na prática, isso significa que a plataforma não separa artificialmente o discurso institucional da operação autenticada. Em vez disso, a landing pública conduz para um ambiente interno que preserva a mesma taxonomia, o mesmo posicionamento institucional e a mesma base persistente de dados.

No eixo operacional, a versão atual contempla principalmente a organização de informações por especialidade, a leitura de conteúdos relacionados, a apresentação da rede institucional e a exposição de dados centrais do domínio SINACE dentro do workspace. No eixo educacional, a versão atual contempla trilhas, biblioteca, enciclopédia, professores e alunos como componentes de uma malha formativa integrada ao contexto assistencial.

## Rotas e módulos efetivamente presentes

| Rota | Módulo associado | Natureza |
| --- | --- | --- |
| `/` | Landing pública SINACE | Pública |
| `/app` | Dashboard autenticado | Autenticada |
| `/app/especialidades` | Especialidades | Autenticada |
| `/app/trilhas` | Trilhas | Autenticada |
| `/app/biblioteca` | Biblioteca | Autenticada |
| `/app/casos` | Casos clínicos | Autenticada |
| `/app/enciclopedia` | Enciclopédia | Autenticada |
| `/app/parceiros` | Parceiros | Autenticada |
| `/app/instituicoes` | Instituições | Autenticada |
| `/app/professores` | Professores | Autenticada |
| `/app/alunos` | Alunos | Autenticada |
| `/app/admin` | Administração | Autenticada |

## Delimitação desta versão

Embora o SINACE já esteja estruturado como plataforma com base de dados, autenticação e módulos múltiplos, esta versão deve ser entendida como uma **primeira release funcional consolidada**. Ela prioriza consistência institucional, navegação autenticada, taxonomia persistente, estados explícitos de carregamento, vazio e erro, além de cobertura automatizada dos principais contratos já implementados.

Isso significa que a release atual fecha um escopo claro: **presença institucional pública + workspace autenticado robusto + taxonomia persistente + módulos operacionais e educacionais navegáveis**. A evolução futura poderá aprofundar fluxos transacionais e operacionais adicionais, mas sem alterar o escopo funcional já estabelecido neste marco.
