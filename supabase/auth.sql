-- Dengine Auth Extension
-- Run this in Supabase SQL Editor after enabling Authentication (Email/Password provider)

-- 1. Enable Row Level Security on auth schema (already enabled by Supabase)

-- 2. Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policy: users can read any profile (public), but only update their own
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 3. Add user_id column to blueprints table
alter table public.blueprints add column if not exists user_id uuid references public.profiles(id) on delete cascade;
-- Add index
create index if not exists idx_blueprints_user_id on blueprints(user_id);

-- 4. Update RLS policies for blueprints
-- Drop existing insert/update policies (they allow anyone)
drop policy if exists "Anyone can create blueprints" on blueprints;
drop policy if exists "Anyone can update blueprint claims" on blueprints;

-- New policies:
-- Public can read any blueprint (for sharing)
create policy "Blueprints are publicly readable" on blueprints for select using (true);
-- Authenticated users can insert blueprints (with their user_id)
create policy "Authenticated users can create blueprints" on blueprints for insert
  with check (auth.uid() = user_id);
-- Users can update blueprints they own
create policy "Users can update own blueprints" on blueprints for update
  using (auth.uid() = user_id);
-- Users can delete own blueprints
create policy "Users can delete own blueprints" on blueprints for delete
  using (auth.uid() = user_id);

-- 5. Create a trigger to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. (Optional) Add a function to get current user's blueprints
create or replace function public.my_blueprints()
returns setof blueprints
language sql
stable
security definer
as $$
  select * from blueprints where user_id = auth.uid();
$$;