-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- before starting the backend against Supabase.

create table if not exists tasks (
  id text primary key,
  text text,
  priority text,
  status text,
  date text,
  checked boolean default false,
  "isOverdue" boolean default false
);

create table if not exists notes (
  id text primary key,
  text text
);

create table if not exists checklist (
  id text primary key,
  text text,
  checked boolean default false
);

create table if not exists reflection (
  id text primary key,
  "wentWell" text,
  win text,
  improvement text,
  "tomorrowTask" text
);

create table if not exists "user" (
  id text primary key,
  name text,
  quote text,
  "streakDaily" integer default 0,
  "streakFocus" integer default 0,
  "streakReflection" integer default 0
);

create table if not exists goals (
  id text primary key,
  title text,
  target integer default 0,
  current integer default 0
);

create table if not exists focus_tasks (
  id text primary key,
  title text,
  priority text
);

create table if not exists agenda (
  id text primary key,
  time text,
  task text,
  date text
);

create table if not exists meetings (
  id text primary key,
  title text,
  time text,
  platform text,
  date text
);

create table if not exists templates (
  id text primary key,
  title text,
  description text
);

create table if not exists google_tokens (
  id text primary key,
  access_token text,
  refresh_token text,
  scope text,
  token_type text,
  expiry_date bigint
);

-- Seed singleton rows (idempotent), mirrors the old server.js boot-time seed logic.
insert into "user" (id, name, quote, "streakDaily", "streakFocus", "streakReflection")
values ('u1', 'User', '', 0, 0, 0)
on conflict (id) do nothing;

insert into goals (id, title, target, current)
values ('g1', 'Set a weekly goal...', 100, 0)
on conflict (id) do nothing;

insert into focus_tasks (id, title, priority)
values ('f1', 'Set your focus for today...', 'Medium')
on conflict (id) do nothing;
