
-- Create profiles table that extends the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  created_at timestamp with time zone default now() not null
);

-- Create health_analyses table to store user's health analysis history
create table public.health_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  symptoms text not null,
  input_type text not null,
  analysis text not null,
  recommendation text,
  created_at timestamp with time zone default now() not null
);

-- Set up RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.health_analyses enable row level security;

-- Create access policies for profiles
create policy "Users can view their own profile" 
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Create access policies for health_analyses
create policy "Users can view their own health analyses" 
  on public.health_analyses for select using (auth.uid() = user_id);

create policy "Users can create health analyses" 
  on public.health_analyses for insert with check (auth.uid() = user_id);

-- Create a trigger to create a profile when a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
