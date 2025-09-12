Título: TrendlyAI — Dados de Teste (per‑table)

Pré‑requisitos
- Crie dois usuários no Supabase Auth antes de rodar os scripts:
  1) falci@trendlycorp.com (perfil free)
  2) osorio@trendlycorp.com (perfil premium)
- A trigger handle_new_user já cria o registro básico em profiles. Estes scripts apenas complementam dados e criam relacionamentos.

Ordem sugerida de execução
1) profiles_data.sql (atualiza dados de perfil como full_name/username)
2) subscriptions_data.sql (torna o usuário osorio@trendlycorp.com premium)
3) tools_data.sql
4) tracks_data.sql
5) track_modules_data.sql
6) faq_categories_data.sql
7) faq_items_data.sql
8) conversations_data.sql
9) messages_data.sql
10) user_tools_data.sql
11) user_tracks_data.sql
12) user_module_progress_data.sql

Notas importantes
- Os scripts usam buscas por email/título para resolver IDs (SELECT ...). Execute na ordem indicada.
- Caso uma linha já exista, a maioria dos scripts usa ON CONFLICT DO NOTHING para evitar erro.
- Para testar RLS corretamente, faça login no PWA com cada usuário e navegue pelas telas (tracks, tools, chat, help, etc.).

