# Perfis de usuário e regras de acesso do SINACE

Este documento consolida o **mapeamento funcional de perfis** do SINACE e explicita a diferença entre os perfis do domínio institucional e as regras de autorização efetivamente implementadas na versão atual do produto. O objetivo é evitar ambiguidade entre quem a plataforma atende e quais permissões já estão formalizadas no software.

## Leitura geral dos perfis

O SINACE foi concebido para atender um ecossistema heterogêneo, no qual diferentes atores interagem com a plataforma a partir de necessidades operacionais, institucionais e educacionais. No plano funcional, a solução dialoga com governo, regulação, hospitais e equipes assistenciais, ao mesmo tempo em que sustenta uma camada formativa para professores e alunos. Na implementação atual, esse desenho já está refletido na navegação, nos módulos do workspace e na linguagem institucional do produto.

## Perfis funcionais do domínio

| Perfil | Papel esperado no ecossistema SINACE | Módulos e superfícies mais relacionados |
| --- | --- | --- |
| Governo | Leitura institucional da proposta, articulação contratual e visão de expansão da capacidade cirúrgica | Landing pública, dashboard, instituições, parceiros, especialidades |
| Regulação | Organização do contexto assistencial, leitura de capacidade e navegação por especialidades e casos | Dashboard, especialidades, casos clínicos, instituições |
| Hospital | Visualização da rede, da base institucional e dos elementos de apoio à operação e formação | Dashboard, parceiros, instituições, biblioteca, especialidades |
| Equipe cirúrgica | Consulta a taxonomia, materiais de apoio e contexto clínico-formativo | Especialidades, biblioteca, casos clínicos, enciclopédia, trilhas |
| Estudante | Navegação formativa e consulta de acervo educacional | Trilhas, biblioteca, enciclopédia, alunos |
| Administrador | Gestão estrutural da plataforma e da taxonomia persistente | Administração, especialidades e módulos dependentes |

## Regras de acesso efetivamente implementadas nesta versão

A versão atual do software já diferencia, de maneira clara, a **superfície pública** da **superfície autenticada**. A landing institucional permanece aberta ao público geral, enquanto o workspace autenticado exige sessão válida para navegação interna. Essa divisão já materializa a separação entre apresentação institucional e ambiente operacional-formativo.

No plano de autorização, a implementação atual evidencia dois níveis formais de acesso: o **usuário autenticado**, que pode entrar no workspace e consumir os módulos disponíveis, e o **administrador**, que possui acesso às superfícies administrativas sinalizadas no produto e aos fluxos de gestão relacionados ao domínio persistente. Assim, embora o ecossistema do SINACE envolva vários perfis funcionais, o controle de acesso formalmente codificado nesta release está consolidado principalmente sobre a distinção entre acesso autenticado e acesso administrativo.

## Matriz resumida de acesso desta release

| Superfície | Público não autenticado | Usuário autenticado | Administrador |
| --- | --- | --- | --- |
| Landing pública | Acesso permitido | Acesso permitido | Acesso permitido |
| Dashboard do workspace | Sem acesso direto | Acesso permitido | Acesso permitido |
| Especialidades, trilhas, biblioteca, casos, enciclopédia, parceiros, instituições, professores e alunos | Sem acesso direto | Acesso permitido | Acesso permitido |
| Administração | Sem acesso direto | Restrito | Acesso permitido |

## Delimitação de autorização da versão

Para esta release, a plataforma já possui uma base coerente de autenticação e uma separação explícita para rotas administrativas. Entretanto, a granularidade de permissões por persona institucional — por exemplo, distinguir governo, regulação e hospital em regras independentes de autorização — ainda não está formalizada como matriz completa de RBAC na aplicação. Nesta etapa, esses perfis estão consolidados como **personas funcionais e de desenho do produto**, enquanto a autorização codificada permanece intencionalmente mais enxuta para preservar consistência e rastreabilidade da primeira versão funcional.
