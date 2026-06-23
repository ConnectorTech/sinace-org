# Blueprint funcional do app SINACE

## Premissa de produto

O aplicativo da **SINACE — Sistema Nacional Hospitalar de Cirurgias Especializadas** deve deixar de ser apenas uma apresentação institucional e passar a operar como uma **plataforma nacional de organização cirúrgica, formação clínica, gestão operacional e inteligência assistencial**. A proposta precisa contemplar, em uma mesma arquitetura, o uso por gestores, parceiros institucionais, equipes assistenciais, professores, estudantes e usuários administrativos, mantendo governança, escalabilidade e rastreabilidade.

## Objetivo central

O sistema deve reunir em uma única experiência digital os seguintes eixos: **educação cirúrgica**, **biblioteca por especialidade**, **trilhas de estudo**, **casos clínicos**, **enciclopédia médico-cirúrgica**, **gestão documental**, **governança institucional**, **cadastro de parceiros e unidades**, **módulos administrativos**, **ambiente do aluno** e **camada executiva de inteligência operacional**.

## Perfis de acesso

| Perfil | Finalidade principal | Capacidades iniciais |
|---|---|---|
| Administrador master | Governança completa da plataforma | Gerenciar usuários, instituições, especialidades, conteúdos, trilhas, permissões, indicadores e configurações |
| Gestor institucional | Operar unidades, contratos, equipes e indicadores | Acompanhar produção, organizar acesso local, aprovar materiais e monitorar desempenho |
| Coordenador de especialidade | Curadoria de linha cirúrgica | Organizar casos, módulos, provas, protocolos e biblioteca temática |
| Professor/mentor | Produção pedagógica | Publicar aulas, materiais, avaliações, discussões e recomendações |
| Cirurgião/profissional assistencial | Consumo técnico e participação clínica | Estudar, consultar protocolos, registrar evolução educacional e interagir com casos |
| Aluno/residente | Formação e acompanhamento | Acessar trilhas, materiais, provas, progresso, certificados e agenda |
| Parceiro institucional | Visualização compartilhada e integração | Acompanhar conteúdos, dashboards pactuados, documentos e unidades vinculadas |
| Revisor editorial/compliance | Validação técnica | Revisar conteúdos, aprovar versões e manter histórico documental |

## Macroarquitetura de navegação

A experiência deve ser dividida em **duas camadas complementares**. A primeira é uma camada pública, orientada a posicionamento institucional, proposta de valor, contatos, programas, parceiros e acesso ao login. A segunda é uma camada autenticada em formato de **workspace com sidebar**, voltada ao uso operacional contínuo.

| Camada | Páginas/módulos iniciais |
|---|---|
| Pública | Home institucional, proposta, parceiros, especialidades, aplicativo, contato, acesso/login |
| Autenticada | Dashboard, especialidades, trilhas, biblioteca, casos clínicos, enciclopédia, documentos, agenda, parceiros, instituições, alunos, professores, analytics, administração |

## Módulos estruturantes do produto

### 1. Dashboard executivo

O dashboard deverá consolidar métricas e acessos rápidos. Ele precisa oferecer visão por instituição, especialidade, conteúdo, usuários ativos, trilhas em andamento, materiais publicados, evolução educacional e alertas operacionais.

### 2. Especialidades cirúrgicas nacionais

A plataforma deverá tratar especialidades como uma taxonomia central. Cada especialidade deve possuir identidade própria, descrição, coordenação responsável, trilhas relacionadas, materiais, biblioteca, casos clínicos, protocolos e indicadores.

O recorte cirúrgico inicial considerado para modelagem inclui:

| Núcleo cirúrgico inicial do SINACE |
|---|
| Cirurgia cardiovascular |
| Cirurgia da mão |
| Cirurgia de cabeça e pescoço |
| Cirurgia do aparelho digestivo |
| Cirurgia geral |
| Cirurgia oncológica |
| Cirurgia pediátrica |
| Cirurgia plástica |
| Cirurgia torácica |
| Cirurgia vascular |
| Coloproctologia |
| Ginecologia e obstetrícia |
| Mastologia |
| Neurocirurgia |
| Oftalmologia |
| Ortopedia e traumatologia |
| Otorrinolaringologia |
| Urologia |

A modelagem deve permanecer **configurável**, de forma que novas especialidades, áreas de atuação, linhas transversais e subespecialidades possam ser adicionadas sem refatoração estrutural.

### 3. Trilhas de estudo

O módulo de trilhas deve permitir organizar a formação por jornada. Cada trilha poderá ser composta por módulos, aulas, leituras, vídeos, arquivos, casos, avaliações e marcos de conclusão. O progresso do aluno deve ser rastreado e visualizado por ele e por gestores autorizados.

### 4. Casos clínicos

O módulo de casos clínicos deverá suportar publicação estruturada de casos por especialidade, grau de complexidade, tema, tipo de procedimento, objetivo de aprendizagem e desfecho. O produto deve permitir discussão, destaque editorial, classificação e histórico de revisão.

### 5. Enciclopédia médico-cirúrgica

A enciclopédia será uma base de consulta contínua. Cada entrada deve conter conceito, indicações, contraindicações, preparo, técnica, complicações, pós-operatório, referências, anexos e especialidade relacionada.

### 6. Biblioteca e gestão documental

A biblioteca precisa armazenar protocolos, PDFs, apresentações, artigos, guias, manuais, checklists e materiais institucionais. O sistema deve prever versionamento, categorização, permissões e associação com trilhas, especialidades e instituições.

### 7. Alunos e percurso formativo

O módulo do aluno deve oferecer visão clara de progresso, conteúdos recomendados, avaliações, certificados, pendências e próximos passos. O objetivo é que a plataforma funcione também como ambiente de permanência e evolução acadêmica.

### 8. Professores, coordenações e produção de conteúdo

O sistema deve permitir que professores e coordenadores tenham áreas dedicadas para publicar conteúdos, gerenciar cronogramas, acompanhar turmas, editar módulos e avaliar engajamento.

### 9. Parceiros, hospitais e instituições

A plataforma deve cadastrar e organizar parceiros institucionais, OSS, hospitais, Santas Casas, secretarias e unidades vinculadas. Cada parceiro pode estar ligado a especialidades ativas, equipes, documentos, dashboards e conteúdos específicos.

### 10. Administração e governança

O backoffice precisa controlar usuários, permissões, taxonomias, especialidades, estados de publicação, parceiros, unidades, documentos e auditoria básica. Essa camada será decisiva para a escalabilidade nacional do sistema.

## Modelo conceitual inicial de dados

| Entidade | Função no sistema |
|---|---|
| users | Identidade, autenticação e papel do usuário |
| institutions | Hospitais, OSS, secretarias, faculdades e parceiros |
| specialties | Especialidades e linhas cirúrgicas configuráveis |
| specialty_coordinators | Vínculo entre especialidades e responsáveis |
| learning_tracks | Trilhas de estudo |
| learning_modules | Módulos dentro das trilhas |
| lessons | Aulas e unidades de conteúdo |
| clinical_cases | Casos clínicos estruturados |
| encyclopedia_entries | Verbetes da enciclopédia |
| documents | Arquivos, protocolos e materiais |
| student_enrollments | Matrículas/adesões às trilhas |
| progress_records | Progresso granular por conteúdo |
| assessments | Provas, quizzes e avaliações |
| assessment_attempts | Tentativas e resultados |
| partners | Cadastro de parceiros institucionais |
| units | Unidades vinculadas a parceiros/instituições |
| announcements | Comunicados e destaques |
| activity_logs | Auditoria e rastreabilidade |

## Priorização recomendada por etapas

| Etapa | Entrega |
|---|---|
| Etapa 1 | Autenticação, dashboard base, layout autenticado, especialidades, trilhas e biblioteca mínima |
| Etapa 2 | Casos clínicos, enciclopédia, documentos e gestão de parceiros/instituições |
| Etapa 3 | Ambiente do aluno, progresso, avaliações e painéis gerenciais |
| Etapa 4 | Curadoria avançada, analytics institucional, permissões finas e workflows editoriais |

## Direção de UX

A camada autenticada deve abandonar a lógica de landing page longa e adotar uma experiência de **plataforma operacional**, com navegação persistente, busca global, filtros, páginas de detalhe, estados vazios bem resolvidos e hierarquia visual clara. O tom visual deve preservar a identidade SINACE já construída, mas traduzida para um produto digital mais utilitário, com aparência institucional, clínica e tecnológica.

## Decisão de implementação imediata

A próxima implementação deve focar em criar a espinha dorsal do sistema: **DashboardLayout customizado para SINACE**, rotas autenticadas, menu estruturado, placeholders funcionais dos módulos centrais, modelos de dados iniciais e primeiros procedimentos tRPC para especialidades, trilhas, biblioteca e parceiros.
