# Cobertura modular e limitações da release SINACE

Este documento registra a **cobertura modular efetivamente consolidada** na versão atual do SINACE e, ao mesmo tempo, explicita as limitações conhecidas desta release. O propósito é alinhar expectativa funcional, rastreabilidade de entrega e leitura honesta do estágio atual do produto.

## Cobertura modular consolidada

A versão atual do SINACE já apresenta um núcleo consistente de módulos institucionais, operacionais e educacionais apoiados por navegação autenticada, base persistente de dados e taxonomia central de especialidades. Essa cobertura é suficiente para caracterizar a plataforma como uma primeira versão funcional robusta, especialmente pela integração entre landing pública, workspace autenticado e camada administrativa.

| Domínio funcional | Cobertura na versão | Observação |
| --- | --- | --- |
| Presença institucional pública | Consolidada | Landing pública alinhada ao posicionamento e à narrativa oficial da SINACE |
| Dashboard autenticado | Consolidada | Entrada principal do workspace autenticado |
| Especialidades | Consolidada | Base persistente e taxonomia administrativa disponíveis |
| Trilhas | Consolidada | Módulo autenticado com estados explícitos e integração ao contexto educacional |
| Biblioteca | Consolidada | Módulo autenticado com estados explícitos e consumo de dados relacionados |
| Casos clínicos | Consolidada | Módulo autenticado com estados explícitos, vazio, erro e retry |
| Enciclopédia | Consolidada | Módulo autenticado integrado ao domínio de especialidades |
| Parceiros | Consolidada | Cobertura institucional autenticada |
| Instituições | Consolidada | Cobertura institucional autenticada |
| Professores | Consolidada | Cobertura educacional autenticada |
| Alunos | Consolidada | Cobertura educacional autenticada |
| Administração | Consolidada | Gestão estrutural do domínio e da taxonomia persistente |

## Limitações explicitamente registradas para esta versão

Apesar da amplitude do workspace já consolidado, alguns elementos citados no escopo conceitual mais amplo do SINACE ainda **não aparecem nesta release como módulos plenamente materializados e validados como fluxos independentes de produto**. Isso se aplica, especialmente, a agenda cirúrgica, credenciamento e analytics como frentes autônomas e detalhadas.

Em outras palavras, a versão atual do produto já oferece base técnica, navegação, autenticação, persistência e modelagem de domínio suficientes para suportar a expansão futura dessas frentes, mas não deve ser descrita como se esses três módulos estivessem integralmente fechados como entregas próprias de release. Nesta etapa, eles permanecem como **eixos de evolução** do produto, e não como entregas finalizadas no mesmo grau de maturidade dos módulos já consolidados.

## Registro formal de limitação por frente

| Frente | Situação nesta release | Registro formal |
| --- | --- | --- |
| Agenda cirúrgica | Não consolidada como módulo autônomo validado | Permanece como evolução futura do eixo operacional |
| Credenciamento | Não consolidado como módulo autônomo validado | Permanece como evolução futura do eixo institucional-operacional |
| Analytics | Não consolidado como módulo autônomo validado | Permanece como evolução futura do eixo de inteligência e governança |

## Síntese de release

A leitura correta desta entrega é a de uma **primeira versão funcional consolidada da plataforma SINACE**, com presença pública institucional, workspace autenticado robusto, base persistente, taxonomia administrável e módulos navegáveis de operação e educação já integrados. Ao mesmo tempo, a release preserva transparência ao registrar que agenda cirúrgica, credenciamento e analytics ainda não devem ser comunicados como módulos fechados no mesmo patamar de maturidade dos demais.
