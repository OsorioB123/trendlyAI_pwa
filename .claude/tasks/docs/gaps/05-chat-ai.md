# Chat & AI Systems

## Current State
- Schema uses `conversations` + `conversation_participants` + `messages(sender_id, message_type, attachments)`.
- Frontend expects `conversations.user_id` and `messages.role` with simple joins on `messages!inner`.
- Functions present: `find_direct_conversation`, `get_conversation_details`; no `send_user_message` function in repo schema.
- Indexes on `messages(conversation_id, created_at)` and `messages(sender_id)` exist.

## Gap Analysis
- Contract mismatch (user_id vs participants; role vs sender_id/message_type) breaks queries and inserts.
- Missing trigger to bump `conversations.updated_at` on new messages (only BEFORE UPDATE trigger exists).
- No DB-level credit enforcement on message send.
- RLS policies shown for messages/conversations in docs differ from participants-based access in schema.

## Recommendations
- Keep participants model (more scalable); provide compatibility views for legacy code.
- Add message insert function that enforces: participant check + optional credit debit + updated_at bump.
- Add RLS using EXISTS over participants to secure SELECT/INSERT.
- Provide a `messages_legacy` view exposing `role` derived from sender vs assistant/system events.

## Implementation Specifics (SQL)
1) Compatibility Views
```sql
CREATE OR REPLACE VIEW public.conversations_legacy AS
SELECT c.id,
       cp.user_id AS user_id,
       c.title,
       c.created_at,
       c.updated_at
FROM public.conversations c
JOIN public.conversation_participants cp ON cp.conversation_id = c.id;

CREATE OR REPLACE VIEW public.messages_legacy AS
SELECT m.id, m.conversation_id,
       CASE WHEN m.message_type IN ('system') THEN 'assistant'
            WHEN m.sender_id = auth.uid() THEN 'user'
            ELSE 'assistant' END AS role,
       m.content, m.created_at, m.updated_at
FROM public.messages m;
```
2) Safe Message Insert
```sql
CREATE OR REPLACE FUNCTION public.send_user_message(
  p_user uuid,
  p_conversation uuid,
  p_content text
) RETURNS uuid AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = p_conversation AND cp.user_id = p_user
  ) THEN
    RAISE EXCEPTION 'User not in conversation';
  END IF;

  -- optional: enforce credits
  PERFORM public.use_credit(p_user);

  INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
  VALUES (p_conversation, p_user, p_content, 'text')
  RETURNING id INTO new_id;

  UPDATE public.conversations SET updated_at = now() WHERE id = p_conversation;
  RETURN new_id;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```
3) Triggers & RLS
```sql
CREATE TRIGGER update_conversation_on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS examples (if missing)
CREATE POLICY "View conversations via membership" ON public.conversations
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.conversation_participants cp
  WHERE cp.conversation_id = conversations.id AND cp.user_id = auth.uid()
));

CREATE POLICY "Insert messages in own conversations" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.conversation_participants cp
  WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
));
```

## Prioridade
- Alta: compatibility layer + safe message insert + RLS.
- Média: credits integration for chat usage.
- Baixa: legacy views removal after frontend refactor.

