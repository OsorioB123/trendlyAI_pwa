# Auth & Profile System

## Current State
- Profiles table exists with core columns: identity, counters (`streak_days`, `total_tracks`, `completed_modules`), `credits/max_credits`, `metadata/preferences`, timestamps.
- Trigger `handle_new_user()` creates profiles on `auth.users` insert (Security Definer).
- RLS enforces self-access for SELECT/UPDATE/INSERT.
- Missing (per docs/needs): credit cycle tracking, active flag, subscription mirror fields; email uniqueness not enforced.

## Gap Analysis
- Credits lifecycle: functions `get_available_credits`, `use_credit`, `reset_monthly_credits` not found in schema file.
- Columns referenced in docs not present: `credits_cycle_start`, `credits_used_this_cycle`, `is_active`.
- Onboarding stats trigger `update_profile_stats` referenced in docs but absent in schema.
- Frontend type `UserProfile` includes `user_id` field not present in table (redundant).

## Recommendations
- Add credit cycle columns and implement credit functions with safe checks and idempotency.
- Add `is_active boolean DEFAULT true` and index email for faster lookups.
- Implement `update_profile_stats` to recompute `completed_modules`, `total_tracks` from progress tables.
- Keep RLS strict (self-only). Consider column-level limited public view via a view if needed.

## Implementation Specifics (SQL)
1) Columns
```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS credits_cycle_start timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS credits_used_this_cycle int DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
```
2) Stats Trigger
```sql
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles p SET 
    completed_modules = (
      SELECT COUNT(1) FROM public.user_module_progress ump
      WHERE ump.user_id = p.id AND ump.completed = true
    ),
    total_tracks = (
      SELECT COUNT(1) FROM public.user_tracks ut
      WHERE ut.user_id = p.id
    ),
    updated_at = now()
  WHERE p.id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_profile_stats ON public.user_tracks;
CREATE TRIGGER trigger_update_profile_stats
AFTER INSERT OR UPDATE OR DELETE ON public.user_tracks
FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();

DROP TRIGGER IF EXISTS trigger_update_profile_stats_modules ON public.user_module_progress;
CREATE TRIGGER trigger_update_profile_stats_modules
AFTER INSERT OR UPDATE OR DELETE ON public.user_module_progress
FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();
```
3) Credits API
```sql
CREATE OR REPLACE FUNCTION public.get_available_credits(user_uuid uuid)
RETURNS jsonb AS $$
DECLARE rec record; result jsonb;
BEGIN
  SELECT credits, max_credits, credits_cycle_start, credits_used_this_cycle
  INTO rec FROM public.profiles WHERE id = user_uuid;
  IF NOT FOUND THEN RETURN jsonb_build_object('current',0,'total',0,'percentage',0,'renewal_date',null); END IF;
  result := jsonb_build_object(
    'current', rec.credits,
    'total', rec.max_credits,
    'percentage', CASE WHEN rec.max_credits>0 THEN ROUND((rec.credits::numeric/rec.max_credits)*100) ELSE 0 END,
    'renewal_date', rec.credits_cycle_start + interval '30 days'
  );
  RETURN result;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.use_credit(user_uuid uuid)
RETURNS boolean AS $$
DECLARE cur int; BEGIN
  SELECT credits INTO cur FROM public.profiles WHERE id=user_uuid FOR UPDATE;
  IF NOT FOUND OR cur <= 0 THEN RETURN false; END IF;
  UPDATE public.profiles
  SET credits = credits - 1,
      credits_used_this_cycle = credits_used_this_cycle + 1,
      updated_at = now()
  WHERE id = user_uuid;
  RETURN true;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET credits = max_credits,
      credits_used_this_cycle = 0,
      credits_cycle_start = now(),
      updated_at = now();
END; $$ LANGUAGE plpgsql;
```

## Prioridade
- Alta: credit functions + columns, stats triggers.
- Média: email index, frontend type alignment.
- Baixa: optional public views for partial profile exposure.

