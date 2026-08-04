CREATE TABLE `estudos_caso` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`resumo` text,
	`foco_clinico` varchar(180),
	`especialidade_id` int,
	`instituicao_id` int,
	`perfil_autor_id` int,
	`publicacao_id` int,
	`complexidade` enum('standard','high','advanced') NOT NULL DEFAULT 'standard',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`url_origem` varchar(2048),
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estudos_caso_id` PRIMARY KEY(`id`),
	CONSTRAINT `case_studies_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `casos_clinicos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`sinopse` text,
	`objetivos_aprendizado` text,
	`discussao` text,
	`especialidade_id` int,
	`dificuldade` enum('intro','intermediate','advanced') NOT NULL DEFAULT 'intermediate',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_por_usuario_id` int,
	`publicado_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `casos_clinicos_id` PRIMARY KEY(`id`),
	CONSTRAINT `clinical_cases_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `documentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`descricao` text,
	`tipo_documento` enum('protocol','guideline','manual','article','checklist','video','other') NOT NULL DEFAULT 'protocol',
	`especialidade_id` int,
	`trilha_id` int,
	`url_origem` varchar(2048),
	`chave_arquivo` varchar(255),
	`url_arquivo` varchar(2048),
	`nome_arquivo` varchar(255),
	`tipo_mime` varchar(160),
	`tamanho_arquivo_bytes` int,
	`rotulo_pasta` varchar(160) NOT NULL DEFAULT 'Geral',
	`nome_contribuidor` varchar(180),
	`instituicao_contribuidor` varchar(180),
	`credencial_contribuidor` varchar(120),
	`tipo_contribuidor` enum('internal','external') NOT NULL DEFAULT 'external',
	`origem_envio` enum('workspace','submission') NOT NULL DEFAULT 'submission',
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_por_usuario_id` int,
	`publicado_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `documentos_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `verbetes_enciclopedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`resumo` text,
	`corpo` text,
	`especialidade_id` int,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_por_usuario_id` int,
	`revisado_por_usuario_id` int,
	`publicado_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verbetes_enciclopedia_id` PRIMARY KEY(`id`),
	CONSTRAINT `encyclopedia_entries_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `fluxogramas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`resumo` text,
	`especialidade_id` int,
	`instituicao_id` int,
	`url_diagrama` varchar(2048),
	`chave_arquivo` varchar(255),
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fluxogramas_id` PRIMARY KEY(`id`),
	CONSTRAINT `fluxogramas_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contratos_governamentais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`parceiro_id` int,
	`instituicao_id` int,
	`especialidade_id` int,
	`tipo_contrato` enum('state_program','municipal_program','federal_program','oss_agreement','service_contract') NOT NULL DEFAULT 'service_contract',
	`escopo` text,
	`procedimentos_estimados` int NOT NULL DEFAULT 0,
	`status` enum('pipeline','active','completed','paused') NOT NULL DEFAULT 'pipeline',
	`data_inicio` timestamp,
	`data_fim` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contratos_governamentais_id` PRIMARY KEY(`id`),
	CONSTRAINT `government_contracts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `especialidades_instituicao` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instituicao_id` int NOT NULL,
	`especialidade_id` int NOT NULL,
	`modelo_servico` enum('elective','high_complexity','ambulatory','training','diagnostic') NOT NULL DEFAULT 'elective',
	`status` enum('planned','active','paused') NOT NULL DEFAULT 'planned',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `especialidades_instituicao_id` PRIMARY KEY(`id`),
	CONSTRAINT `institution_specialty_idx` UNIQUE(`instituicao_id`,`especialidade_id`)
);
--> statement-breakpoint
CREATE TABLE `instituicoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`nome` varchar(180) NOT NULL,
	`descricao` text,
	`tipo_instituicao` enum('hospital','santa_casa','clinic','surgical_center','teaching_center','other') NOT NULL DEFAULT 'hospital',
	`cidade` varchar(120),
	`estado` varchar(120),
	`perfil_capacidade` varchar(160),
	`perfil_ensino` varchar(160),
	`parceiro_id` int,
	`status` enum('planning','active','inactive') NOT NULL DEFAULT 'planning',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instituicoes_id` PRIMARY KEY(`id`),
	CONSTRAINT `instituicoes_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `modulos_aprendizado` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trilha_id` int NOT NULL,
	`slug` varchar(120) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`resumo` text,
	`posicao` int NOT NULL DEFAULT 0,
	`minutos_estimados` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modulos_aprendizado_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_track_slug_idx` UNIQUE(`trilha_id`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `recursos_biblioteca` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`descricao` text,
	`tipo_recurso` enum('document','video','image','presentation','dataset','protocol','checklist','other') NOT NULL DEFAULT 'document',
	`especialidade_id` int,
	`publicacao_id` int,
	`enviado_por_usuario_id` int,
	`url_origem` varchar(2048),
	`chave_arquivo` varchar(255),
	`url_arquivo` varchar(2048),
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`em_destaque` enum('no','yes') NOT NULL DEFAULT 'no',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recursos_biblioteca_id` PRIMARY KEY(`id`),
	CONSTRAINT `library_assets_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `itens_vitrine_midia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`descricao` text,
	`tipo_midia` enum('image','video','document','other') NOT NULL DEFAULT 'image',
	`chave_modulo` varchar(120),
	`url_origem` varchar(2048),
	`chave_arquivo` varchar(255),
	`url_arquivo` varchar(2048),
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'public',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itens_vitrine_midia_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_showcase_items_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `parceiros` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`nome` varchar(180) NOT NULL,
	`descricao` text,
	`tipo_parceiro` enum('government','oss','hospital_network','supplier','academic','other') NOT NULL DEFAULT 'other',
	`site_url` varchar(2048),
	`cidade` varchar(120),
	`estado` varchar(120),
	`status` enum('prospect','active','inactive') NOT NULL DEFAULT 'prospect',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parceiros_id` PRIMARY KEY(`id`),
	CONSTRAINT `parceiros_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `fila_pacientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo_paciente` varchar(80) NOT NULL,
	`especialidade_id` int NOT NULL,
	`instituicao_id` int,
	`contrato_id` int,
	`prioridade` enum('low','moderate','high','urgent') NOT NULL DEFAULT 'moderate',
	`caminho` enum('ambulatory','hospital','high_complexity') NOT NULL DEFAULT 'hospital',
	`status` enum('waiting','scheduled','performed','cancelled') NOT NULL DEFAULT 'waiting',
	`dias_espera` int NOT NULL DEFAULT 0,
	`cidade_origem` varchar(120),
	`estado_origem` varchar(120),
	`agendado_em` timestamp,
	`realizado_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fila_pacientes_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_queue_entries_code_idx` UNIQUE(`codigo_paciente`)
);
--> statement-breakpoint
CREATE TABLE `perfis_profissionais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuario_id` int,
	`instituicao_id` int,
	`especialidade_id` int,
	`nome_completo` varchar(180) NOT NULL,
	`titulo_cargo` varchar(120) NOT NULL,
	`tipo_profissional` enum('surgeon','anesthesiologist','nurse','coordinator','faculty','resident','student','manager') NOT NULL DEFAULT 'surgeon',
	`numero_credencial` varchar(80),
	`estado_credencial` varchar(16),
	`autoridade_credencial` varchar(120),
	`numero_rqe` varchar(80),
	`email_publico` varchar(320),
	`email_acesso_privado` varchar(320),
	`status_acesso_senha` enum('not_started','ready','recovery','managed') NOT NULL DEFAULT 'not_started',
	`canal_recuperacao_senha` varchar(160),
	`senha_atualizada_em` timestamp,
	`telefone` varchar(40),
	`cidade` varchar(120),
	`estado` varchar(120),
	`rotulo_regiao` varchar(120),
	`url_imagem_perfil` varchar(2048),
	`mini_bio` text,
	`resumo_curriculo` text,
	`destaques` text,
	`areas_atuacao` text,
	`interesse_colaboracao` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`status_verificacao` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'public',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `perfis_profissionais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conexoes_perfis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`perfil_solicitante_id` int NOT NULL,
	`perfil_alvo_id` int NOT NULL,
	`tipo_conexao` enum('interest','referral','mentorship','research','institutional') NOT NULL DEFAULT 'interest',
	`status` enum('pending','accepted','declined','blocked') NOT NULL DEFAULT 'pending',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conexoes_perfis_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_connections_pair_idx` UNIQUE(`perfil_solicitante_id`,`perfil_alvo_id`)
);
--> statement-breakpoint
CREATE TABLE `publicacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`trecho` text,
	`corpo` text,
	`tipo_publicacao` enum('ceo_update','institutional','report','article','case_highlight','news') NOT NULL DEFAULT 'institutional',
	`em_destaque` enum('no','yes') NOT NULL DEFAULT 'no',
	`visibilidade` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`especialidade_id` int,
	`perfil_autor_id` int,
	`url_imagem_capa` varchar(2048),
	`publicado_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publicacoes_id` PRIMARY KEY(`id`),
	CONSTRAINT `publicacoes_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `especialidades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`nome` varchar(160) NOT NULL,
	`rotulo_curto` varchar(80),
	`descricao` text,
	`categoria` enum('cirurgica','clinica','apoio') NOT NULL DEFAULT 'cirurgica',
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`ordem_exibicao` int NOT NULL DEFAULT 0,
	`modelo_coordenacao` varchar(160),
	`criado_por_usuario_id` int,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `especialidades_id` PRIMARY KEY(`id`),
	CONSTRAINT `especialidades_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `membros_equipe_cirurgica` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipe_cirurgica_id` int NOT NULL,
	`perfil_profissional_id` int NOT NULL,
	`papel_membro` varchar(120) NOT NULL,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `membros_equipe_cirurgica_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_professional_idx` UNIQUE(`equipe_cirurgica_id`,`perfil_profissional_id`)
);
--> statement-breakpoint
CREATE TABLE `equipes_cirurgicas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`nome` varchar(180) NOT NULL,
	`instituicao_id` int,
	`especialidade_id` int,
	`tipo_equipe` enum('fixed','mobile','regional','teaching') NOT NULL DEFAULT 'fixed',
	`perfil_operacional` varchar(180),
	`contagem_membros` int NOT NULL DEFAULT 0,
	`status` enum('planning','active','inactive') NOT NULL DEFAULT 'planning',
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipes_cirurgicas_id` PRIMARY KEY(`id`),
	CONSTRAINT `surgical_teams_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `matriculas_trilha` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuario_id` int NOT NULL,
	`trilha_id` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`percentual_progresso` int NOT NULL DEFAULT 0,
	`iniciado_em` timestamp,
	`concluido_em` timestamp,
	`ultimo_acesso_em` timestamp,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matriculas_trilha_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_enrollments_user_track_idx` UNIQUE(`usuario_id`,`trilha_id`)
);
--> statement-breakpoint
CREATE TABLE `trilhas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`resumo` text,
	`especialidade_id` int,
	`dificuldade` enum('intro','intermediate','advanced') NOT NULL DEFAULT 'intro',
	`horas_estimadas` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`criado_por_usuario_id` int,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trilhas_id` PRIMARY KEY(`id`),
	CONSTRAINT `trilhas_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`identificador_aberto` varchar(64),
	`senha_hash` varchar(255),
	`nome` text,
	`email` varchar(320),
	`metodo_login` varchar(64),
	`funcao` enum('user','admin') NOT NULL DEFAULT 'user',
	`cpf` varchar(14),
	`cep` varchar(9),
	`endereco_linha1` varchar(255),
	`cidade` varchar(120),
	`estado` varchar(2),
	`e_medico` boolean DEFAULT false,
	`crm` varchar(20),
	`crmUf` varchar(2),
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`ultimo_login` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_identificador_aberto_unique` UNIQUE(`identificador_aberto`),
	CONSTRAINT `usuarios_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `estudos_caso` ADD CONSTRAINT `estudos_caso_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estudos_caso` ADD CONSTRAINT `estudos_caso_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estudos_caso` ADD CONSTRAINT `estudos_caso_perfil_autor_id_perfis_profissionais_id_fk` FOREIGN KEY (`perfil_autor_id`) REFERENCES `perfis_profissionais`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estudos_caso` ADD CONSTRAINT `estudos_caso_publicacao_id_publicacoes_id_fk` FOREIGN KEY (`publicacao_id`) REFERENCES `publicacoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `casos_clinicos` ADD CONSTRAINT `casos_clinicos_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `casos_clinicos` ADD CONSTRAINT `casos_clinicos_criado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`criado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_trilha_id_trilhas_id_fk` FOREIGN KEY (`trilha_id`) REFERENCES `trilhas`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_criado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`criado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verbetes_enciclopedia` ADD CONSTRAINT `verbetes_enciclopedia_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verbetes_enciclopedia` ADD CONSTRAINT `verbetes_enciclopedia_criado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`criado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verbetes_enciclopedia` ADD CONSTRAINT `verbetes_enciclopedia_revisado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`revisado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fluxogramas` ADD CONSTRAINT `fluxogramas_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fluxogramas` ADD CONSTRAINT `fluxogramas_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contratos_governamentais` ADD CONSTRAINT `contratos_governamentais_parceiro_id_parceiros_id_fk` FOREIGN KEY (`parceiro_id`) REFERENCES `parceiros`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contratos_governamentais` ADD CONSTRAINT `contratos_governamentais_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contratos_governamentais` ADD CONSTRAINT `contratos_governamentais_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `especialidades_instituicao` ADD CONSTRAINT `especialidades_instituicao_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `especialidades_instituicao` ADD CONSTRAINT `especialidades_instituicao_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `instituicoes` ADD CONSTRAINT `instituicoes_parceiro_id_parceiros_id_fk` FOREIGN KEY (`parceiro_id`) REFERENCES `parceiros`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modulos_aprendizado` ADD CONSTRAINT `modulos_aprendizado_trilha_id_trilhas_id_fk` FOREIGN KEY (`trilha_id`) REFERENCES `trilhas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recursos_biblioteca` ADD CONSTRAINT `recursos_biblioteca_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recursos_biblioteca` ADD CONSTRAINT `recursos_biblioteca_publicacao_id_publicacoes_id_fk` FOREIGN KEY (`publicacao_id`) REFERENCES `publicacoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recursos_biblioteca` ADD CONSTRAINT `recursos_biblioteca_enviado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`enviado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fila_pacientes` ADD CONSTRAINT `fila_pacientes_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fila_pacientes` ADD CONSTRAINT `fila_pacientes_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fila_pacientes` ADD CONSTRAINT `fila_pacientes_contrato_id_contratos_governamentais_id_fk` FOREIGN KEY (`contrato_id`) REFERENCES `contratos_governamentais`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `perfis_profissionais` ADD CONSTRAINT `perfis_profissionais_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `perfis_profissionais` ADD CONSTRAINT `perfis_profissionais_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `perfis_profissionais` ADD CONSTRAINT `perfis_profissionais_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conexoes_perfis` ADD CONSTRAINT `conexoes_perfis_perfil_solicitante_id_perfis_profissionais_id_fk` FOREIGN KEY (`perfil_solicitante_id`) REFERENCES `perfis_profissionais`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conexoes_perfis` ADD CONSTRAINT `conexoes_perfis_perfil_alvo_id_perfis_profissionais_id_fk` FOREIGN KEY (`perfil_alvo_id`) REFERENCES `perfis_profissionais`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_perfil_autor_id_perfis_profissionais_id_fk` FOREIGN KEY (`perfil_autor_id`) REFERENCES `perfis_profissionais`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `especialidades` ADD CONSTRAINT `especialidades_criado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`criado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `membros_equipe_cirurgica` ADD CONSTRAINT `membros_equipe_cirurgica_equipe_cirurgica_id_equipes_cirurgicas_id_fk` FOREIGN KEY (`equipe_cirurgica_id`) REFERENCES `equipes_cirurgicas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `membros_equipe_cirurgica` ADD CONSTRAINT `membros_equipe_cirurgica_perfil_profissional_id_perfis_profissionais_id_fk` FOREIGN KEY (`perfil_profissional_id`) REFERENCES `perfis_profissionais`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipes_cirurgicas` ADD CONSTRAINT `equipes_cirurgicas_instituicao_id_instituicoes_id_fk` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicoes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipes_cirurgicas` ADD CONSTRAINT `equipes_cirurgicas_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matriculas_trilha` ADD CONSTRAINT `matriculas_trilha_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matriculas_trilha` ADD CONSTRAINT `matriculas_trilha_trilha_id_trilhas_id_fk` FOREIGN KEY (`trilha_id`) REFERENCES `trilhas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trilhas` ADD CONSTRAINT `trilhas_especialidade_id_especialidades_id_fk` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidades`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trilhas` ADD CONSTRAINT `trilhas_criado_por_usuario_id_usuarios_id_fk` FOREIGN KEY (`criado_por_usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;