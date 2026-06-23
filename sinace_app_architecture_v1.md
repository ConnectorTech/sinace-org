# Arquitetura inicial do aplicativo SINACE v1

## Diretriz geral

A evolução do projeto SINACE deve preservar o site institucional já publicado e, ao mesmo tempo, expandir o workspace autenticado para uma **plataforma-app unificada**, capaz de operar como ambiente institucional, biblioteca cirúrgica, diretório profissional e núcleo de relacionamento entre especialistas. A estrutura já existente oferece três bases valiosas para esta fase: **autenticação**, **navegação autenticada em dashboard** e **modelagem relacional inicial** para especialidades, instituições, parceiros e perfis profissionais.

A decisão arquitetural para a primeira versão é manter uma única aplicação web responsiva, com navegação pública em `/` e ecossistema autenticado sob `/app`. Isso permite que a experiência funcione como **PWA/web app multiplataforma**, viabilizando uso em desktop, tablet e mobile sem ruptura entre marca institucional e produto operacional. Em ciclos seguintes, essa mesma arquitetura pode ser encapsulada em distribuição móvel, caso a estratégia inclua publicação dedicada em lojas.

## Modelo de experiência

| Camada | Papel na experiência | Endereço lógico |
| --- | --- | --- |
| Camada pública | Apresentação institucional da SINACE, proposta de valor, posicionamento, mídia e entrada para o app | `/` |
| Camada autenticada | Workspace com módulos profissionais, acervo, especialidades, parceiros e governança | `/app/*` |
| Camada administrativa | Gestão de taxonomias, conteúdos, cadastros e permissões | `/app/admin` |

## Macrodomínios funcionais

A plataforma deve ser organizada em macrodomínios que reflitam o que o usuário solicitou, mas sem fragmentar a navegação em excesso. A leitura recomendada para a v1 é a seguinte.

| Macrodomínio | Módulos incluídos | Resultado esperado |
| --- | --- | --- |
| Institucional | Dashboard executivo, publicações do CEO, parceiros, mídia, espelho do site | Fortalecer autoridade da marca e comunicação estratégica |
| Especialidades e estudo | Especialidades, biblioteca, estudos de caso, enciclopédia, trilhas | Concentrar o conhecimento cirúrgico por nicho |
| Rede médica | Cadastro médico, diretório profissional, conexão por região e especialidade | Formar comunidade profissional qualificada |
| Operação assistencial | Fluxogramas hospitalares, instituições, contratos, filas e indicadores | Tornar a plataforma útil para governança e leitura operacional |
| Governança da plataforma | Administração, permissões, taxonomias, curadoria de conteúdo | Sustentar crescimento sem perda de consistência |

## Arquitetura de navegação recomendada

A navegação autenticada já existente pode ser reaproveitada, mas precisa ser reinterpretada para refletir com mais precisão o produto solicitado. Em vez de manter uma leitura predominantemente acadêmica, o menu deve equilibrar visão institucional, operação assistencial e comunidade médica.

| Grupo de navegação | Entradas da v1 | Observação de produto |
| --- | --- | --- |
| Visão executiva | Dashboard, Publicações institucionais, Indicadores | Área de entrada principal após login |
| Rede cirúrgica | Especialidades, Fluxogramas, Instituições, Parceiros | Reúne estrutura nacional de atuação |
| Conhecimento | Biblioteca, Estudos de caso, Enciclopédia, Trilhas | Núcleo técnico-científico do app |
| Comunidade médica | Perfis médicos, Busca por especialistas, Network | Nova frente central da plataforma |
| Governança | Administração | Mantida como área restrita |

## Entidades de dados da v1

A modelagem atual já cobre parte do domínio. Para a primeira versão robusta do aplicativo, a expansão deve priorizar entidades editoriais e de relacionamento profissional, sem descartar o que já existe.

| Entidade | Situação | Papel no produto |
| --- | --- | --- |
| `users` | Já existe | Identidade base, autenticação e papel do usuário |
| `specialties` | Já existe | Catálogo de especialidades cirúrgicas e áreas relacionadas |
| `partners` | Já existe | Parceiros institucionais e articulações por esfera |
| `institutions` | Já existe | Hospitais, Santas Casas e demais estruturas |
| `professionalProfiles` | Já existe, mas precisa evoluir | Perfil médico/profissional com currículo, CRM, foto, região e biografia |
| `governmentContracts` | Já existe | Leitura institucional dos contratos e programas |
| `patientQueueEntries` | Já existe | Base para leitura da fila e indicadores operacionais |
| `publications` | Nova prioridade | Conteúdos do CEO, artigos institucionais, resultados e notas oficiais |
| `libraryAssets` | Nova prioridade | Arquivos, documentos, vídeos, imagens e materiais por especialidade |
| `caseStudies` | Nova prioridade | Casos clínicos, status editorial e associação a especialidades |
| `flowcharts` | Nova prioridade | Fluxogramas hospitalares e processos cirúrgicos |
| `profileConnections` | Nova prioridade | Relacionamento entre médicos para network |
| `mediaShowcaseItems` | Nova prioridade | Curadoria de fotos e vídeos institucionais já enviados |

## Expansão recomendada de perfis profissionais

O ponto mais importante da nova fase é transformar `professionalProfiles` em uma entidade mais rica, adequada ao que o usuário pediu. O perfil não deve se limitar a nome e função. Ele precisa operar como **cartão profissional confiável** e como entrada para networking e curadoria.

| Campo | Finalidade |
| --- | --- |
| Nome completo | Identificação pública do especialista |
| CRM/RQE ou credencial equivalente | Confiança e validação profissional |
| Especialidade principal e áreas correlatas | Filtro e descoberta no diretório |
| UF, cidade e região de atuação | Busca territorial |
| Mini bio e currículo resumido | Posicionamento profissional |
| Foto de perfil | Identidade visual no network |
| Vínculo institucional | Relação com hospitais e parceiros |
| Disponibilidade de colaboração | Base para conexões futuras |
| Status de verificação | Diferenciar perfis confirmados |

## Estratégia para conteúdo e mídia

Os arquivos visuais já enviados pelo usuário devem alimentar duas frentes. A primeira é a identidade visual do app, reforçando continuidade entre site e plataforma. A segunda é a criação de uma área de **mídia institucional**, onde fotos, vídeos e peças publicitárias apoiem a narrativa da SINACE como organização de alto nível com vocação nacional e internacional.

A recomendação técnica é tratar esses ativos como itens editoriais armazenados em S3, com metadados próprios, categorização por tipo de mídia e relação opcional com módulos, publicações ou destaques do dashboard. Assim, o material enviado não fica apenas “espalhado no front-end”, mas passa a integrar o conteúdo vivo da plataforma.

## Estratégia de permissões

A v1 deve operar com um modelo simples, mas extensível. Em vez de introduzir muitas permissões já no início, a plataforma pode funcionar com quatro camadas práticas.

| Papel | Permissão-base |
| --- | --- |
| Visitante | Acesso apenas à camada pública |
| Usuário autenticado | Acesso ao workspace, leitura de conteúdos restritos e atualização do próprio perfil |
| Curador/editor | Publicação e organização de conteúdos técnicos e institucionais |
| Admin | Controle total de módulos, taxonomias, parceiros, perfis e governança |

## Sequência técnica recomendada

A implementação da primeira versão deve acontecer em quatro movimentos encadeados. Primeiro, consolidar a navegação e o shell do app para refletir o produto final desejado. Segundo, enriquecer o schema com entidades editoriais e perfis profissionais robustos. Terceiro, construir os módulos mais visíveis ao usuário — perfis médicos, publicações, biblioteca e parceiros. Quarto, conectar a experiência a dados reais com testes e checkpoint estável.

## Critério de pronto da primeira onda

A primeira onda do aplicativo SINACE estará bem posicionada quando o projeto entregar um workspace autenticado já coerente com a ambição do produto, com módulos navegáveis, modelo de dados suficiente para conteúdo institucional e perfis médicos, base pronta para mídia e uma trilha clara para avançar depois para analytics operacionais, matching entre especialistas e internacionalização.
