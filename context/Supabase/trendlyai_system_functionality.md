# TrendlyAI - Funcionalidades, Triggers e Políticas do Sistema

## ⚙️ FUNÇÕES DE BANCO DE DADOS

### Funções de Negócio e Cálculos

#### auto_update_user_premium_status()
- **Tipo:** trigger
- **Segurança:** invoker
- **Descrição:** Atualiza automaticamente o status premium do usuário

#### calculate_active_tracks(user_uuid)
- **Argumentos:** user_uuid uuid
- **Retorno:** integer
- **Segurança:** definer
- **Descrição:** Calcula o número de trilhas ativas para um usuário

#### calculate_completed_modules(user_uuid)
- **Argumentos:** user_uuid uuid
- **Retorno:** integer
- **Segurança:** definer
- **Descrição:** Calcula o total de módulos completados pelo usuário

#### calculate_track_progress(user_uuid, track_uuid)
- **Argumentos:** user_uuid uuid, track_uuid uuid
- **Retorno:** integer
- **Segurança:** invoker
- **Descrição:** Calcula o progresso percentual de uma trilha específica

#### calculate_track_progress_debug(user_uuid, track_uuid)
- **Argumentos:** user_uuid uuid, track_uuid uuid
- **Retorno:** TABLE(total_modules integer, completed_modules integer, percentage integer)
- **Segurança:** invoker
- **Descrição:** Versão debug para cálculo de progresso com detalhes

### Funções de Controle de Acesso

#### can_access_content(user_uuid, content_type, content_id)
- **Argumentos:** user_uuid uuid, content_type text, content_id uuid
- **Retorno:** boolean
- **Segurança:** definer
- **Descrição:** Verifica se usuário pode acessar determinado conteúdo

#### can_access_module(user_uuid, track_uuid, module_id)
- **Argumentos:** user_uuid uuid, track_uuid uuid, module_id uuid
- **Retorno:** boolean
- **Segurança:** definer
- **Descrição:** Verifica se usuário pode acessar módulo específico

#### is_premium_user(user_uuid)
- **Argumentos:** user_uuid uuid
- **Retorno:** boolean
- **Segurança:** definer
- **Descrição:** Verifica se usuário tem assinatura premium ativa

### Funções de Sistema de Créditos

#### get_available_credits(user_uuid)
- **Argumentos:** user_uuid uuid
- **Retorno:** jsonb
- **Segurança:** definer
- **Descrição:** Obtém informações detalhadas dos créditos disponíveis

#### reset_monthly_credits()
- **Retorno:** void
- **Segurança:** invoker
- **Descrição:** Reseta créditos mensais para todos os usuários

#### use_credit(user_uuid)
- **Argumentos:** user_uuid uuid
- **Retorno:** boolean
- **Segurança:** definer
- **Descrição:** Debita um crédito do usuário se disponível

### Funções de Chat e Conversas

#### find_direct_conversation(user1_uuid, user2_uuid)
- **Argumentos:** user1_uuid uuid, user2_uuid uuid
- **Retorno:** uuid
- **Segurança:** definer
- **Descrição:** Encontra conversa direta entre dois usuários

#### get_conversation_details(conv_uuid)
- **Argumentos:** conv_uuid uuid
- **Retorno:** TABLE(user_id uuid, title text, site text, created_by uuid, created_at timestamptz with time zone, participants jsonb, message_count bigint, last_message jsonb)
- **Segurança:** definer
- **Descrição:** Obtém detalhes completos de uma conversa

#### send_user_message(user_uuid, conversation_uuid, message)
- **Argumentos:** user_uuid uuid, conversation_uuid uuid, message jsonb
- **Retorno:** jsonb
- **Segurança:** definer
- **Descrição:** Envia mensagem do usuário para uma conversa

### Funções de Módulos e Progresso

#### complete_module(user_uuid, track_uuid, module_id)
- **Argumentos:** user_uuid uuid, track_uuid uuid, module_id uuid
- **Retorno:** boolean
- **Segurança:** definer
- **Descrição:** Marca módulo como completado para o usuário

#### validate_track_content(track_uuid)
- **Argumentos:** track_uuid uuid
- **Retorno:** text
- **Segurança:** invoker
- **Descrição:** Valida conteúdo de uma trilha

### Funções de Sistema

#### handle_new_user()
- **Retorno:** trigger
- **Segurança:** definer
- **Descrição:** Trigger para criação automática de perfil para novos usuários

#### update_profile_stats()
- **Retorno:** trigger
- **Segurança:** invoker
- **Descrição:** Atualiza estatísticas do perfil do usuário

#### update_updated_at_column()
- **Retorno:** trigger
- **Segurança:** invoker
- **Descrição:** Atualiza automaticamente campo updated_at

#### update_user_referrals_updated_at()
- **Retorno:** trigger
- **Segurança:** invoker
- **Descrição:** Atualiza campo updated_at em user_referrals

---

## 🔄 TRIGGERS DO SISTEMA

### Triggers de Atualização de Status

#### trigger_auto_premium_status
- **Tabela:** subscriptions
- **Função:** auto_update_user_premium_status
- **Eventos:** AFTER UPDATE, AFTER INSERT
- **Orientação:** ROW
- **Status:** ✅ Enabled

### Triggers de Estatísticas de Perfil

#### trigger_update_profile_stats
- **Tabela:** user_tracks
- **Função:** update_profile_stats
- **Eventos:** AFTER UPDATE, AFTER DELETE, AFTER INSERT
- **Orientação:** ROW
- **Status:** ✅ Enabled

#### trigger_update_profile_stat...
- **Tabela:** user_module_progress
- **Função:** update_profile_stats
- **Eventos:** AFTER UPDATE, AFTER DELETE, AFTER INSERT
- **Orientação:** ROW
- **Status:** ✅ Enabled

### Triggers de Timestamp Automático

#### update_conversations_updated_at
- **Tabela:** conversations
- **Função:** update_updated_at_column
- **Eventos:** BEFORE UPDATE
- **Orientação:** ROW
- **Status:** ✅ Enabled

#### update_profiles_updated_at
- **Tabela:** profiles
- **Função:** update_updated_at_column
- **Eventos:** BEFORE UPDATE
- **Orientação:** ROW
- **Status:** ✅ Enabled

#### update_tools_updated_at
- **Tabela:** tools
- **Função:** update_updated_at_column
- **Eventos:** BEFORE UPDATE
- **Orientação:** ROW
- **Status:** ✅ Enabled

#### update_tracks_updated_at
- **Tabela:** tracks
- **Função:** update_updated_at_column
- **Eventos:** BEFORE UPDATE
- **Orientação:** ROW
- **Status:** ✅ Enabled

#### update_user_referrals_upda...
- **Tabela:** user_referrals
- **Função:** update_user_referrals_updated_at
- **Eventos:** BEFORE UPDATE
- **Orientação:** ROW
- **Status:** ✅ Enabled

---

## 🔒 POLÍTICAS RLS (ROW LEVEL SECURITY)

### Tabela: conversations
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can create their own conversations**
    - Comando: INSERT
    - Aplicada a: authenticated
  - **Users can update their own conversations**
    - Comando: UPDATE
    - Aplicada a: authenticated
  - **Users can view their own conversations**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: messages
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can insert messages in their conversations**
    - Comando: INSERT
    - Aplicada a: authenticated
  - **Users can view messages from their conversations**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: payment_history
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can view their own payment history**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: prices
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view active prices**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: products
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view active products**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: profiles
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can insert their own profile**
    - Comando: INSERT
    - Aplicada a: authenticated
  - **Users can update their own profile**
    - Comando: UPDATE
    - Aplicada a: authenticated
  - **Users can view their own profile**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: subscriptions
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can view their own subscriptions**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: tools
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view active tools**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: track_modules
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view track modules**
    - Comando: SELECT
    - Aplicada a: public

### Tabela: track_reviews
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view reviews**
    - Comando: SELECT
    - Aplicada a: authenticated
  - **Users can manage their own reviews**
    - Comando: ALL
    - Aplicada a: authenticated

### Tabela: tracks
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Anyone can view published tracks**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: user_module_progress
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can manage their own module progress**
    - Comando: ALL
    - Aplicada a: authenticated

### Tabela: user_referrals
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can insert own referral data**
    - Comando: INSERT
    - Aplicada a: public
  - **Users can update own referral data**
    - Comando: UPDATE
    - Aplicada a: public
  - **Users can view own referral data**
    - Comando: SELECT
    - Aplicada a: public

### Tabela: user_tools
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can manage their own tool preferences**
    - Comando: ALL
    - Aplicada a: authenticated
  - **Users can view their own tool preferences**
    - Comando: SELECT
    - Aplicada a: authenticated

### Tabela: user_tracks
- **RLS:** ✅ Enabled
- **Políticas:**
  - **Users can manage their own track progress**
    - Comando: ALL
    - Aplicada a: authenticated
  - **Users can view their own track progress**
    - Comando: SELECT
    - Aplicada a: authenticated

---

## 💾 STORAGE BUCKETS

### avatars
- **Visibilidade:** Public
- **Descrição:** Armazenamento de avatares dos usuários
- **Acesso:** Público para leitura, autenticado para escrita

### attachments  
- **Visibilidade:** Public
- **Descrição:** Anexos de conversas e chat
- **Acesso:** Público para leitura, autenticado para escrita

### content
- **Visibilidade:** Public  
- **Descrição:** Conteúdo das trilhas (vídeos, imagens, documentos)
- **Acesso:** Público para leitura, administrativo para escrita

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### Sistema de Autenticação
- ✅ Criação automática de perfil via trigger `handle_new_user`
- ✅ Políticas RLS configuradas para isolamento de dados
- ✅ Controle de acesso baseado em autenticação Supabase

### Sistema de Créditos
- ✅ Função `get_available_credits` para consulta de saldo
- ✅ Função `use_credit` para debitar créditos
- ✅ Função `reset_monthly_credits` para ciclos mensais
- ✅ Integração com sistema premium

### Sistema de Trilhas e Progresso
- ✅ Função `calculate_track_progress` para cálculo de avanço
- ✅ Função `complete_module` para marcar conclusões
- ✅ Função `can_access_module` para controle de acesso
- ✅ Triggers automáticos para atualizar estatísticas de perfil

### Sistema de Assinaturas
- ✅ Integração completa com Stripe
- ✅ Trigger `trigger_auto_premium_status` para status automático
- ✅ Função `is_premium_user` para verificação de acesso
- ✅ Sincronização de produtos e preços

### Sistema de Chat
- ✅ Função `find_direct_conversation` para localizar conversas
- ✅ Função `send_user_message` para envio de mensagens
- ✅ Função `get_conversation_details` para detalhes completos
- ✅ Controle de créditos integrado ao chat

### Sistema de Referrals
- ✅ Tabela `user_referrals` com códigos únicos
- ✅ Políticas públicas para inscrição via referral
- ✅ Triggers para atualização automática de estatísticas

### Auditoria e Timestamps
- ✅ Triggers automáticos para `updated_at` em todas as tabelas principais
- ✅ Função `update_updated_at_column` para padronização
- ✅ Rastreamento completo de mudanças