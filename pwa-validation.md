# Validação PWA do SINACE

A preparação do SINACE para uso como aplicativo instalável foi validada com foco em instalação, abertura pela tela inicial e integridade técnica do projeto. O manifesto web foi configurado para iniciar em `/app`, o service worker foi registrado no bootstrap do cliente e a interface passou a considerar áreas seguras e modo standalone para dispositivos móveis.

A orientação de instalação foi incorporada ao shell global por meio de um banner persistente, com instruções específicas para iPhone no Safari e fluxo nativo de instalação nos navegadores que expõem o evento `beforeinstallprompt`. A lógica de detecção de iOS, modo standalone e elegibilidade do banner foi extraída para funções reutilizáveis e coberta com testes automatizados.

A validação técnica foi concluída com build de produção bem-sucedido via `pnpm build`, suíte Vitest aprovada para assets e lógica PWA, e verificação do preview em execução sem erros de TypeScript ou LSP. Com isso, o workspace atual está pronto para ser aberto como aplicativo pela tela inicial, inclusive com fallback offline básico.
