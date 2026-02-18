-- 1. Create Profiles Table (Public Profile Data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar text default '🦸',
  level integer default 1,
  xp integer default 0,
  streak integer default 0,
  total_completed integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS (Row Level Security)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 3. Create Habits Table
create table habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  emoji text,
  category text,
  duration text,
  is_custom boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Habits
alter table habits enable row level security;

create policy "Users can view own habits."
  on habits for select
  using ( auth.uid() = user_id );

create policy "Users can insert own habits."
  on habits for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own habits."
  on habits for update
  using ( auth.uid() = user_id );

-- 4. Create Habit Completions Table (History)
create table habit_completions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references habits, -- Optional if we track generic completions
  xp_earned integer default 10,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Completions
alter table habit_completions enable row level security;

create policy "Users can view own completions."
  on habit_completions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own completions."
  on habit_completions for insert
  with check ( auth.uid() = user_id );

-- 5. Auto-create Profile on Signup (Trigger)
-- This function runs every time a new user signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar)
  values (new.id, new.raw_user_meta_data->>'username', '🦸');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
