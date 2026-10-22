-- onWard private todos. Run in Supabase SQL Editor before enabling sign-ups.
-- Existing demo rows are intentionally not assigned to an arbitrary account and
-- become inaccessible once the owner policies below are enabled.
do $$
begin
  if to_regclass('public.todos') is null and to_regclass('public.tasks') is not null then
    alter table public.tasks rename to todos;
  end if;
end $$;

create table if not exists public.todos (
  id text primary key,
  title text not null check (char_length(title) between 1 and 140),
  plan_type text not null default 'task' check (plan_type in ('task', 'note', 'project', 'community')),
  details text,
  category text not null default 'Personal',
  due_date date not null default current_date,
  completed boolean not null default false,
  archived boolean not null default false,
  favorite boolean not null default false,
  position integer not null default 0,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid()
);

-- Upgrade projects created with the earlier public demo schema. New inserts
-- receive the signed-in user's id through the default and the insert policy.
alter table public.todos add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.todos alter column user_id set default auth.uid();
alter table public.todos add column if not exists plan_type text not null default 'task';
alter table public.todos add column if not exists details text;
alter table public.todos add column if not exists archived boolean not null default false;
alter table public.todos add column if not exists favorite boolean not null default false;
alter table public.todos drop constraint if exists todos_plan_type_check;
alter table public.todos add constraint todos_plan_type_check check (plan_type in ('task', 'note', 'project', 'community'));
create index if not exists todos_user_position_idx on public.todos (user_id, position);
create index if not exists todos_user_plan_type_position_idx on public.todos (user_id, plan_type, position);
create index if not exists todos_user_archived_position_idx on public.todos (user_id, archived, position);
alter table public.todos enable row level security;

drop policy if exists "Demo tasks are readable" on public.todos;
drop policy if exists "Demo tasks can be added" on public.todos;
drop policy if exists "Demo tasks can be changed" on public.todos;
drop policy if exists "Demo tasks can be removed" on public.todos;
drop policy if exists "Demo todos are readable" on public.todos;
drop policy if exists "Demo todos can be added" on public.todos;
drop policy if exists "Demo todos can be changed" on public.todos;
drop policy if exists "Demo todos can be removed" on public.todos;
drop policy if exists "Users can view their own todos" on public.todos;
drop policy if exists "Users can create their own todos" on public.todos;
drop policy if exists "Users can update their own todos" on public.todos;
drop policy if exists "Users can delete their own todos" on public.todos;

revoke all on table public.todos from anon;
grant select, insert, update, delete on table public.todos to authenticated;
create policy "Users can view their own todos" on public.todos for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their own todos" on public.todos for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own todos" on public.todos for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own todos" on public.todos for delete to authenticated using ((select auth.uid()) = user_id);
