Título: TrendlyAI Supabase — Plano de Reconstrução do Banco

Descrição Geral
- Objetivo: dropar com segurança todos os objetos atuais (tabelas, relações, funções, triggers, policies/RLS, buckets) e recriar uma estrutura coesa e consistente com o app TrendlyAI PWA atual.
- Escopo: Base Postgres do Supabase, incluindo Storage (buckets) e políticas.
- Foco: Alinhar o schema aos acessos reais do frontend/backend, garantindo RLS, performance e futuras evoluções.

Estrutura Atual / Estado Atual
- Código do app utiliza as tabelas e RPCs:
  - Autenticação/Perfil: profiles
  - Chat: conversations, messages, user_credits (RPC: consume_user_credits, get_credits_used_today)
  - Conteúdo/Trilhas: tracks, track_modules, user_tracks, user_module_progress, track_reviews
  - Ferramentas: tools, user_tools
  - Referrals: user_referrals
  - Assinaturas/Cobrança: subscription_plans, subscriptions, payment_methods, billing_history
  - Help Center: faq_categories, faq_items, support_tickets, support_messages
  - Buckets: avatars (ativo), attachments, content (planejados)
- Arquivo database_schema.sql do repositório contém schema base, porém com diferenças em Chat e Trilhas e sem algumas tabelas usadas pelo código (ex.: track_modules, user_module_progress, user_credits).

Itens a Remover
- Tabelas e objetos possivelmente existentes e divergentes do uso atual:
  - conversation_participants (modelo de chat por participantes não usado atualmente)
  - products, prices, payment_history (modelo Stripe alternativo não utilizado pelo código)
  - Quaisquer funções/triggers/policies antigas em conflito com o modelo abaixo
  - Buckets antigos (avatars, attachments, content) e suas policies (serão recriados)

Itens a Criar / Adicionar
- Tabelas essenciais (com tipos principais):
  - profiles (uuid PK → auth.users, full_name, username, avatar_url, bio, is_premium bool, preferences jsonb, created_at, updated_at)
  - conversations (uuid, user_id → profiles, title, created_at, updated_at)
  - messages (uuid, conversation_id → conversations, role enum textual ('user'|'assistant'), content text, tokens_used int, created_at, updated_at)
  - tools (uuid, title, description, category, icon, content, is_active bool, tags text[], created_at, updated_at)
  - user_tools (uuid, user_id, tool_id, is_favorite bool, last_used, usage_count int, created_at)
  - tracks (uuid, title, subtitle, description, category, difficulty_level, estimated_duration, thumbnail_url, is_premium bool, total_modules int, is_published bool, created_at, updated_at)
  - track_modules (uuid, track_id → tracks, title, content jsonb, order_index int, video_url, tools jsonb, created_at, updated_at)
  - user_tracks (uuid, user_id, track_id, progress_percentage int, current_module_id uuid, started_at, completed_at, is_favorite bool, last_accessed)
  - user_module_progress (uuid, user_id, track_id, module_id, is_completed bool, completed_at, created_at)
  - track_reviews (uuid, user_id, track_id, rating 1..5, comment, created_at, updated_at)
  - user_referrals (uuid, user_id, referral_code, totais/flags, created_at, updated_at)
  - user_credits (uuid, user_id, current_credits, total_credits, renewal_date)
  - user_credits_log (uuid, user_id, amount, created_at) — suporte a métricas de consumo
  - subscription_plans, subscriptions, payment_methods, billing_history (modelo usado pelo SubscriptionService)
  - faq_categories, faq_items, support_tickets, support_messages (Help Center)
- Funções e triggers:
  - update_updated_at_column (atualiza updated_at)
  - handle_new_user (cria profile ao criar usuário em auth.users)
  - auto_update_user_premium_status (sincroniza profiles.is_premium com subscriptions)
  - ensure_single_default_payment_method (garante 1 default por usuário)
  - increment_faq_view_count (estatística de visualização)
  - consume_user_credits, get_credits_used_today (sistema de créditos)
  - Triggers update_*_updated_at nas tabelas com updated_at
- RLS/Policies:
  - Own-row policies para dados do usuário (profiles, conversations, messages, user_* etc.)
  - Leitura pública/autenticada conforme necessidade (ex.: tracks publicadas, tools ativas, FAQ)
- Buckets:
  - avatars, attachments, content com leitura pública e escrita autenticada

Relações / Dependências
- profiles.id (uuid) referencia auth.users(id)
- conversations.user_id → profiles.id
- messages.conversation_id → conversations.id
- user_tools.user_id → profiles.id; user_tools.tool_id → tools.id
- track_modules.track_id → tracks.id
- user_tracks.user_id → profiles.id; user_tracks.track_id → tracks.id
- user_module_progress.(user_id, track_id, module_id) → (profiles, tracks, track_modules)
- track_reviews.user_id → profiles.id; track_reviews.track_id → tracks.id
- subscriptions.user_id → profiles.id; subscription_plans.plan_id; referências cruzadas em billing_history/payment_methods
- support_tickets.user_id → profiles.id; support_messages.ticket_id → support_tickets.id

Observações / Impactos esperados
- Chat: simplificação para owner único por conversa (conversations.user_id) — alinha-se ao código atual e simplifica RLS (sem participants por ora).
- Trilhas: inclusão de track_modules e user_module_progress e campos esperados pelo app (progress_percentage, current_module_id, total_modules, thumbnail_url, etc.).
- Créditos: adiciona user_credits e RPCs compatíveis; inclui log para métricas diárias.
- Assinaturas: permanece no modelo subscription_plans/subscriptions/payment_methods/billing_history já usado.
- Help Center: leitura pública possível; manter consistência de segurança conforme a rota (/help) pública.
- Buckets: políticas padronizadas e simples (pública leitura; escrita autenticada).

