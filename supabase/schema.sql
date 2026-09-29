-- Keep existing todo data when renaming the old table.
do $$
begin
  if to_regclass('public.todos') is null and to_regclass('public.tasks') is not null then
    alter table public.tasks rename to todos;
  end if;
end
$$;

create table if not exists public.todos (
  id text primary key,
  title text not null check (char_length(title) <= 140),
  category text not null default 'Personal',
  due_date date not null default current_date,
  completed boolean not null default false,
  position integer not null default 0
);

alter table public.todos enable row level security;

-- Demo policy: anyone with the project URL can read and change these todos.
-- For a private app, add Supabase Auth and replace this with user-scoped policies.
drop policy if exists "Demo tasks are readable" on public.todos;
drop policy if exists "Demo tasks can be added" on public.todos;
drop policy if exists "Demo tasks can be changed" on public.todos;
drop policy if exists "Demo tasks can be removed" on public.todos;
drop policy if exists "Demo todos are readable" on public.todos;
drop policy if exists "Demo todos can be added" on public.todos;
drop policy if exists "Demo todos can be changed" on public.todos;
drop policy if exists "Demo todos can be removed" on public.todos;
create policy "Demo todos are readable" on public.todos for select to anon using (true);
create policy "Demo todos can be added" on public.todos for insert to anon with check (true);
create policy "Demo todos can be changed" on public.todos for update to anon using (true) with check (true);
create policy "Demo todos can be removed" on public.todos for delete to anon using (true);

grant select, insert, update, delete on public.todos to anon;