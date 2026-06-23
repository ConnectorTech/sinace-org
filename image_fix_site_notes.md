# Notas de validação da arte institucional no site

## Mapeamento atual

A página inicial do site usa a constante `institutionalImage` em `client/src/pages/Home.tsx`, apontando para a URL pública `0FC61F1A-D6EB-4E6E-AA34-BC9F3BE65F20_f085c238.png`.

## Evidências visuais

A arte atualmente associada ao site é a imagem `0FC61F1A-D6EB-4E6E-AA34-BC9F3BE65F20.png`, que mostra os termos principais em destaque e serve como peça institucional da home.

A versão corrigida final validada localmente é `IMG_5204_corrigida_v4.png`. Nela, a marcação textual principal foi revista e a palavra final aparece como **CIRURGIAS**, preservando também as correções de **GESTÃO** e **INSTITUIÇÃO**.

## Próxima ação

Substituir no site a referência atual da arte institucional pela nova versão corrigida publicada como asset web oficial e validar a renderização no preview.

## Validação do preview

O preview do projeto permaneceu saudável após a troca da URL da imagem, com servidor em execução e sem erros de TypeScript reportados pelo ambiente.

Na verificação do navegador, a home pública do SINACE carregou normalmente e a seção de identificação institucional continua presente na página, confirmando que o bloco público associado à arte institucional segue renderizado no site.

A suíte de testes do projeto também passou integralmente após a alteração, incluindo o teste da home atualizado para garantir que a referência da arte institucional corrigida permaneça no markup.

## Confirmação conclusiva no DOM renderizado

Uma inspeção direta no DOM do preview da home localizou a imagem da seção institucional pelo texto alternativo e retornou o `src` efetivo `https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/IMG_5204_corrigida_v4_434fe37c.png`, com dimensões naturais `1536x2752`. Isso confirma que a página renderizada está exibindo a arte institucional corrigida publicada no CDN do projeto.
