Título: RLS/Policies e Buckets — TrendlyAI Supabase

Descrição Geral
- Este documento especifica as políticas de Row Level Security e as configurações de Storage (buckets) necessárias para o funcionamento seguro do TrendlyAI PWA.

Estrutura Atual / Estado Atual
- RLS já utilizada amplamente no schema do repositório.
- Necessidade de alinhar policies ao modelo efetivamente usado pelo app (conversations com user_id; messages atreladas à conversa do usuário; leitura pública de conteúdos publicados/ativos quando aplicável; acesso público ao Help Center).
- Buckets planejados: avatars, attachments, content com leitura pública e escrita autenticada.

Itens a Remover
- Policies de conversas baseadas em participantes (conversation_participants).
- Policies antigas de products/prices/payment_history (não usados pelo app atual) — se existirem.
- Policies antigas de buckets com regras incompatíveis ao novo modelo.

Itens a Criar / Adicionar
- RLS por tabela (principais):
  - profiles: SELECT/UPDATE/INSERT apenas do próprio usuário (auth.uid() = id)
  - conversations: SELECT/UPDATE/DELETE apenas onde user_id = auth.uid(); INSERT com check user_id = auth.uid()
  - messages: SELECT/ALL apenas quando a conversa pertence ao auth.uid() (EXISTS baseado em conversations)
  - tools: SELECT onde is_active = true (autenticado). Admin pode gerenciar via service key.
  - user_tools: ALL onde user_id = auth.uid()
  - tracks: SELECT onde is_published = true (autenticado ou público; ver nota abaixo)
  - track_modules: SELECT quando track.is_published = true (EXISTS baseado em tracks)
  - user_tracks, user_module_progress: ALL onde user_id = auth.uid()
  - track_reviews: SELECT para todos; ALL apenas do próprio usuário
  - subscription_plans: SELECT onde is_active = true
  - subscriptions, payment_methods, billing_history: SELECT/ALL apenas do próprio usuário
  - faq_categories, faq_items: SELECT público (rota /help não exige login)
  - support_tickets, support_messages: ALL apenas do próprio usuário; mensagens internas não visíveis para usuário final
- Buckets (storage):
  - Buckets: avatars, attachments, content
  - Policies de objetos:
    - SELECT público por bucket (leitura pública)
    - INSERT/UPDATE/DELETE por autenticados, restritas ao bucket

Relações / Dependências
- Policies de messages dependem de conversations.user_id
- Policies de track_modules dependem de tracks.is_published
- Storage policies atuam sobre storage.objects, filtrando bucket_id

Observações / Impactos esperados
- Help Center acessível publicamente: políticas “TO public” em FAQ.
- Caso o projeto exija Help apenas autenticado, ajustar policies para “TO authenticated”.
- Buckets com leitura pública facilitam exibição de imagens/arquivos no app.

