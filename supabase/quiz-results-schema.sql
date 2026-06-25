create table if not exists public.quiz_results (
  id uuid primary key,
  created_at timestamptz not null default now(),
  source text not null default 'vercel',
  schema_version text not null,
  quiz_id text not null,
  quiz_version text not null,
  measurement_version text not null,
  locale text not null,
  profile_code text not null,
  anti_abuse jsonb not null default '{}'::jsonb,
  payload jsonb not null
);

create index if not exists quiz_results_created_at_idx
  on public.quiz_results (created_at);

create index if not exists quiz_results_locale_idx
  on public.quiz_results (locale);

create index if not exists quiz_results_profile_code_idx
  on public.quiz_results (profile_code);

alter table public.quiz_results enable row level security;

comment on table public.quiz_results is
  'AI Persona quiz result records written by the Vercel submit-result API. No browser client writes directly to this table.';

comment on column public.quiz_results.payload is
  'Sanitized quiz payload. Direct identity, IP, free-text, and referrer fields are stripped before insert.';
