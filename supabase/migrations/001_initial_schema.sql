-- CAET Advanced Tracking Tool — Database Schema
-- Supabase (PostgreSQL)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('technician', 'evaluator', 'committee', 'admin');
create type task_status as enum ('not_started', 'in_progress', 'submitted', 'needs_work', 'signed_off');
create type oral_result as enum ('qualified', 'qualified_with_reservations', 'not_qualified');
create type candidate_status as enum ('enrolled', 'pqs_in_progress', 'portfolio_submitted', 'oral_scheduled', 'oral_complete', 'certified', 'not_qualified');

-- ============================================================
-- USERS & PROFILES
-- ============================================================

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text not null,
  role user_role not null default 'technician',
  company text,
  state_code char(2),
  phone text,
  trainer_certified boolean default false,  -- evaluators: completed train-the-trainer
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SHOPS (for grouping evaluators and candidates)
-- ============================================================

create table shops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text,
  state_code char(2),
  created_at timestamptz default now()
);

-- ============================================================
-- CANDIDATES (technicians pursuing CAET Advanced)
-- ============================================================

create table candidates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  shop_id uuid references shops(id),
  evaluator_id uuid references profiles(id),  -- assigned shop supervisor/evaluator
  status candidate_status default 'enrolled',
  written_exam_passed boolean default false,
  written_exam_date date,
  written_exam_certificate text,  -- certificate number or upload ref
  enrolled_at timestamptz default now(),
  certified_at timestamptz,
  certification_expires_at timestamptz,  -- for recertification tracking
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PQS SECTIONS (13 sections)
-- ============================================================

create table pqs_sections (
  id serial primary key,
  section_number integer not null unique,
  title text not null,
  objective text not null,
  sort_order integer not null
);

-- ============================================================
-- PQS FUNDAMENTALS (knowledge requirements per section)
-- ============================================================

create table pqs_fundamentals (
  id serial primary key,
  section_id integer references pqs_sections(id),
  item_number text not null,  -- e.g. "1.2.1"
  description text not null,
  sort_order integer not null
);

-- ============================================================
-- PQS RISK MANAGEMENT (per section)
-- ============================================================

create table pqs_risks (
  id serial primary key,
  section_id integer references pqs_sections(id),
  description text not null,
  sort_order integer not null
);

-- ============================================================
-- PQS TASKS (75 practical tasks)
-- ============================================================

create table pqs_tasks (
  id serial primary key,
  section_id integer references pqs_sections(id),
  task_id text not null unique,  -- e.g. "1.4.1"
  description text not null,
  performance_standard text not null,
  sort_order integer not null
);

-- ============================================================
-- TASK SIGN-OFFS (evaluator signs off candidate tasks)
-- ============================================================

create table task_signoffs (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade,
  task_id integer references pqs_tasks(id),
  status task_status not null default 'not_started',
  evaluator_id uuid references profiles(id),
  evaluator_name text,
  evaluator_company text,
  signed_off_at timestamptz,
  notes text,
  needs_work_feedback text,  -- if status = needs_work
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(candidate_id, task_id)
);

-- ============================================================
-- EVIDENCE UPLOADS (photos, videos, logbook entries per task)
-- ============================================================

create table evidence (
  id uuid primary key default uuid_generate_v4(),
  signoff_id uuid references task_signoffs(id) on delete cascade,
  candidate_id uuid references candidates(id) on delete cascade,
  file_path text not null,  -- Supabase Storage path
  file_type text not null,  -- 'photo', 'video', 'logbook', 'document'
  description text,
  uploaded_at timestamptz default now()
);

-- ============================================================
-- PORTFOLIO ITEMS (7 required documents)
-- ============================================================

create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade,
  item_type text not null,  -- 'qual_record', 'written_cert', 'logbook_transponder', 'logbook_pitot', 'form_337', 'transponder_form', 'deviation_card'
  file_path text,  -- Supabase Storage path
  submitted boolean default false,
  submitted_at timestamptz,
  reviewed boolean default false,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  notes text,
  unique(candidate_id, item_type)
);

-- ============================================================
-- ORAL BOARDS (scheduled and completed)
-- ============================================================

create table oral_boards (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade,
  scheduled_at timestamptz,
  completed_at timestamptz,
  evaluator_1_id uuid references profiles(id),
  evaluator_2_id uuid references profiles(id),
  -- Phase scores (1-5 each, per evaluator)
  e1_portfolio_score integer check (e1_portfolio_score between 1 and 5),
  e1_portfolio_comments text,
  e1_technical_score integer check (e1_technical_score between 1 and 5),
  e1_technical_comments text,
  e1_scenario_score integer check (e1_scenario_score between 1 and 5),
  e1_scenario_comments text,
  e2_portfolio_score integer check (e2_portfolio_score between 1 and 5),
  e2_portfolio_comments text,
  e2_technical_score integer check (e2_technical_score between 1 and 5),
  e2_technical_comments text,
  e2_scenario_score integer check (e2_scenario_score between 1 and 5),
  e2_scenario_comments text,
  -- Final decision
  result oral_result,
  remediation_notes text,  -- if qualified_with_reservations
  gap_notes text,  -- if not_qualified
  created_at timestamptz default now()
);

-- ============================================================
-- ENDORSEMENTS (future: specialized add-ons)
-- ============================================================

create table endorsements (
  id serial primary key,
  name text not null,
  description text,
  active boolean default false
);

create table candidate_endorsements (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade,
  endorsement_id integer references endorsements(id),
  status text default 'not_started',
  completed_at timestamptz
);

-- ============================================================
-- APPRENTICESHIP OJT TRACKING (gap competencies)
-- ============================================================

create table ojt_competencies (
  id serial primary key,
  category text not null,  -- 'structures', 'ground_ops', 'leadership_qa', 'engine_integration'
  title text not null,
  description text,
  required_hours numeric not null,
  sort_order integer not null
);

create table ojt_progress (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidates(id) on delete cascade,
  competency_id integer references ojt_competencies(id),
  hours_logged numeric default 0,
  supervisor_signed boolean default false,
  supervisor_id uuid references profiles(id),
  signed_at timestamptz,
  notes text,
  unique(candidate_id, competency_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table candidates enable row level security;
alter table task_signoffs enable row level security;
alter table evidence enable row level security;
alter table portfolio_items enable row level security;
alter table oral_boards enable row level security;

-- Technicians see their own data
create policy "technicians_own_data" on candidates
  for select using (user_id = auth.uid());

-- Evaluators see candidates at their shop
create policy "evaluators_shop_candidates" on candidates
  for select using (
    shop_id in (
      select c.shop_id from candidates c
      join profiles p on p.id = c.evaluator_id
      where p.id = auth.uid()
    )
  );

-- Admins see everything
create policy "admin_all_access" on candidates
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- PQS reference data is public read
alter table pqs_sections enable row level security;
create policy "pqs_public_read" on pqs_sections for select using (true);
alter table pqs_tasks enable row level security;
create policy "tasks_public_read" on pqs_tasks for select using (true);
alter table pqs_fundamentals enable row level security;
create policy "fundamentals_public_read" on pqs_fundamentals for select using (true);
alter table pqs_risks enable row level security;
create policy "risks_public_read" on pqs_risks for select using (true);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_candidates_status on candidates(status);
create index idx_candidates_shop on candidates(shop_id);
create index idx_signoffs_candidate on task_signoffs(candidate_id);
create index idx_signoffs_status on task_signoffs(status);
create index idx_evidence_signoff on evidence(signoff_id);
create index idx_portfolio_candidate on portfolio_items(candidate_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger candidates_updated_at before update on candidates
  for each row execute function update_updated_at();
create trigger signoffs_updated_at before update on task_signoffs
  for each row execute function update_updated_at();

-- Calculate candidate progress
create or replace function get_candidate_progress(cand_id uuid)
returns json as $$
declare
  total_tasks integer;
  signed_off integer;
  portfolio_submitted integer;
  portfolio_total integer := 7;
begin
  select count(*) into total_tasks from pqs_tasks;
  select count(*) into signed_off from task_signoffs
    where candidate_id = cand_id and status = 'signed_off';
  select count(*) into portfolio_submitted from portfolio_items
    where candidate_id = cand_id and submitted = true;
  
  return json_build_object(
    'total_tasks', total_tasks,
    'signed_off', signed_off,
    'progress_pct', round((signed_off::numeric / total_tasks) * 100),
    'portfolio_submitted', portfolio_submitted,
    'portfolio_total', portfolio_total,
    'ready_for_oral', signed_off = total_tasks and portfolio_submitted = portfolio_total
  );
end;
$$ language plpgsql;
