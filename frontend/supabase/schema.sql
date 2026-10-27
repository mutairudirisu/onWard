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

-- =========================================================================
-- PROPOSED SCHEMA EXTENSION: Personal Achievements & Work Logs
-- (Reviewed & documented for deployment in Supabase SQL editor)
-- =========================================================================

-- 1. Personal Achievements Table
create table if not exists public.achievements (
  id text primary key,
  title text not null check (char_length(title) between 1 and 200),
  date date not null default current_date,
  category text not null default 'Technical',
  impact text not null,
  skills text[] not null default '{}',
  details text,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid()
);

alter table public.achievements enable row level security;
revoke all on table public.achievements from anon;
grant select, insert, update, delete on table public.achievements to authenticated;

create policy "Users can view their own achievements" on public.achievements for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their own achievements" on public.achievements for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own achievements" on public.achievements for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own achievements" on public.achievements for delete to authenticated using ((select auth.uid()) = user_id);

-- 2. Personal Work Logs Table
create table if not exists public.work_logs (
  id text primary key,
  title text not null check (char_length(title) between 1 and 200),
  date date not null default current_date,
  category text not null default 'Engineering',
  outcomes text not null,
  lessons_learned text not null,
  hours numeric(4, 1),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid()
);

alter table public.work_logs enable row level security;
revoke all on table public.work_logs from anon;
grant select, insert, update, delete on table public.work_logs to authenticated;

create policy "Users can view their own work logs" on public.work_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their own work logs" on public.work_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own work logs" on public.work_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own work logs" on public.work_logs for delete to authenticated using ((select auth.uid()) = user_id);

-- =========================================================================
-- PROPOSED SCHEMA EXTENSION: Workspaces, Projects, Reports & Documents
-- (Enforcing authorization, isolation & sharing at the database level)
-- =========================================================================

-- 1. Workspaces
create table if not exists public.workspaces (
  id text primary key,
  name text not null check (char_length(name) between 1 and 100),
  slug text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Workspace Members & Roles (Owner, Editor, Viewer)
create table if not exists public.workspace_members (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null check (role in ('Owner', 'Editor', 'Viewer')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (workspace_id, email)
);

-- 3. Workspace Folders
create table if not exists public.workspace_folders (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text default '#d3f36b',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Workspace Projects
create table if not exists public.workspace_projects (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  folder_id text references public.workspace_folders(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status text not null default 'Planning' check (status in ('Planning', 'In Progress', 'In Review', 'Completed')),
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Workspace Documents (Private by default, shared explicitly)
create table if not exists public.workspace_documents (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  folder_id text references public.workspace_folders(id) on delete set null,
  project_id text references public.workspace_projects(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  content text not null default '',
  is_private boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Document Shares (Viewer and Editor permissions)
create table if not exists public.document_shares (
  id text primary key,
  document_id text not null references public.workspace_documents(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('Viewer', 'Editor')),
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (document_id, email)
);

-- 7. Workspace Reports (Weekly, updates, meetings, activity, general)
create table if not exists public.workspace_reports (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  report_type text not null check (report_type in ('Weekly Work Report', 'Project Update', 'Meeting Report', 'Activity Report', 'General Professional Report')),
  reporting_period text not null,
  status text not null default 'Draft' check (status in ('Draft', 'Final')),
  sections jsonb not null default '[]'::jsonb,
  created_by uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS across all workspace tables
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_folders enable row level security;
alter table public.workspace_projects enable row level security;
alter table public.workspace_documents enable row level security;
alter table public.document_shares enable row level security;
alter table public.workspace_reports enable row level security;

-- Revoke anon access
revoke all on public.workspaces from anon;
revoke all on public.workspace_members from anon;
revoke all on public.workspace_folders from anon;
revoke all on public.workspace_projects from anon;
revoke all on public.workspace_documents from anon;
revoke all on public.document_shares from anon;
revoke all on public.workspace_reports from anon;

-- Grant authenticated operations
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.workspace_folders to authenticated;
grant select, insert, update, delete on public.workspace_projects to authenticated;
grant select, insert, update, delete on public.workspace_documents to authenticated;
grant select, insert, update, delete on public.document_shares to authenticated;
grant select, insert, update, delete on public.workspace_reports to authenticated;

-- Helper security predicate for workspace membership
create or replace function public.is_workspace_member(ws_id text)
returns boolean security definer set search_path = public as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'))
  );
$$ language sql stable;

-- Helper security predicate for workspace admin/owner/editor
create or replace function public.is_workspace_editor_or_owner(ws_id text)
returns boolean security definer set search_path = public as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'))
      and role in ('Owner', 'Editor')
  );
$$ language sql stable;

-- Helper security predicate for workspace owner
create or replace function public.is_workspace_owner(ws_id text)
returns boolean security definer set search_path = public as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'))
      and role = 'Owner'
  );
$$ language sql stable;

-- Workspace Policies: Members can read their workspaces; Creator/Owner can update/delete
create policy "Members can view workspaces" on public.workspaces
  for select to authenticated using (public.is_workspace_member(id) or created_by = auth.uid());

create policy "Users can create workspaces" on public.workspaces
  for insert to authenticated with check (created_by = auth.uid());

create policy "Owners can update workspaces" on public.workspaces
  for update to authenticated using (public.is_workspace_owner(id) or created_by = auth.uid());

create policy "Owners can delete workspaces" on public.workspaces
  for delete to authenticated using (public.is_workspace_owner(id) or created_by = auth.uid());

-- Workspace Member Policies
create policy "Members can view other members" on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));

create policy "Owners can add members" on public.workspace_members
  for insert to authenticated with check (public.is_workspace_owner(workspace_id));

create policy "Owners can update members" on public.workspace_members
  for update to authenticated using (public.is_workspace_owner(workspace_id));

create policy "Owners can remove members" on public.workspace_members
  for delete to authenticated using (public.is_workspace_owner(workspace_id) or user_id = auth.uid());

-- Folders & Projects Policies
create policy "Members can view folders" on public.workspace_folders
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "Editors can insert folders" on public.workspace_folders
  for insert to authenticated with check (public.is_workspace_editor_or_owner(workspace_id));
create policy "Editors can update folders" on public.workspace_folders
  for update to authenticated using (public.is_workspace_editor_or_owner(workspace_id));
create policy "Editors can delete folders" on public.workspace_folders
  for delete to authenticated using (public.is_workspace_editor_or_owner(workspace_id));

create policy "Members can view projects" on public.workspace_projects
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "Editors can insert projects" on public.workspace_projects
  for insert to authenticated with check (public.is_workspace_editor_or_owner(workspace_id));
create policy "Editors can update projects" on public.workspace_projects
  for update to authenticated using (public.is_workspace_editor_or_owner(workspace_id));
create policy "Editors can delete projects" on public.workspace_projects
  for delete to authenticated using (public.is_workspace_editor_or_owner(workspace_id));

-- Documents Policies (Private documents accessible by creator or explicitly shared collaborators)
create policy "Users can view authorized documents" on public.workspace_documents
  for select to authenticated using (
    created_by = auth.uid()
    or (
      public.is_workspace_member(workspace_id)
      and (
        is_private = false
        or exists (
          select 1 from public.document_shares
          where document_id = public.workspace_documents.id
            and (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'))
        )
      )
    )
  );

create policy "Members can create documents" on public.workspace_documents
  for insert to authenticated with check (
    created_by = auth.uid() and public.is_workspace_editor_or_owner(workspace_id)
  );

create policy "Editors and document owners can update documents" on public.workspace_documents
  for update to authenticated using (
    created_by = auth.uid()
    or exists (
      select 1 from public.document_shares
      where document_id = public.workspace_documents.id
        and (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'))
        and role = 'Editor'
    )
  );

create policy "Document owners can delete documents" on public.workspace_documents
  for delete to authenticated using (created_by = auth.uid());

-- Document Share Policies (Managed by document owner)
create policy "Document collaborators can view shares" on public.document_shares
  for select to authenticated using (
    exists (
      select 1 from public.workspace_documents
      where id = public.document_shares.document_id
        and (created_by = auth.uid() or public.is_workspace_member(workspace_id))
    )
  );

create policy "Document owners can grant shares" on public.document_shares
  for insert to authenticated with check (
    exists (
      select 1 from public.workspace_documents
      where id = public.document_shares.document_id
        and created_by = auth.uid()
    )
  );

create policy "Document owners can revoke shares" on public.document_shares
  for delete to authenticated using (
    exists (
      select 1 from public.workspace_documents
      where id = public.document_shares.document_id
        and created_by = auth.uid()
    )
  );

-- Workspace Reports Policies
create policy "Members can view reports" on public.workspace_reports
  for select to authenticated using (public.is_workspace_member(workspace_id));

create policy "Editors can create reports" on public.workspace_reports
  for insert to authenticated with check (
    created_by = auth.uid() and public.is_workspace_editor_or_owner(workspace_id)
  );

create policy "Editors and report owners can update reports" on public.workspace_reports
  for update to authenticated using (
    created_by = auth.uid() or public.is_workspace_editor_or_owner(workspace_id)
  );

create policy "Report owners can delete reports" on public.workspace_reports
  for delete to authenticated using (
    created_by = auth.uid() or public.is_workspace_owner(workspace_id)
  );

