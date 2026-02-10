-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Extends auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  phone text,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  loyalty_points int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Users
alter table public.users enable row level security;
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
-- Admin policy (admins can view all)
create policy "Admins can view all users" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 2. RATES TABLE (Live Pricing)
create table public.rates (
  id uuid default uuid_generate_v4() primary key,
  item_type text unique not null, -- 'broiler', 'country'
  price_per_kg decimal(10,2) not null,
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.rates enable row level security;
create policy "Anyone can view rates" on public.rates for select using (true);
create policy "Admins can update rates" on public.rates for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 3. STOCK TABLE (Inventory)
create table public.stock (
  id uuid default uuid_generate_v4() primary key,
  item_type text unique not null references public.rates(item_type),
  quantity_kg decimal(10,2) default 0,
  daily_limit_kg decimal(10,2) default 100,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.stock enable row level security;
create policy "Anyone can view stock" on public.stock for select using (true);
create policy "Admins can update stock" on public.stock for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 4. ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id), -- Nullable for guest
  guest_phone text,
  guest_name text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'ready', 'completed', 'cancelled')),
  total_amount decimal(10,2) not null,
  payment_method text check (payment_method in ('cash', 'upi', 'online')),
  payment_status text default 'pending',
  pickup_date date not null,
  pickup_time_slot text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Anyone can insert orders" on public.orders for insert with check (true); -- Simplified for Guests
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 5. ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  item_type text not null,
  cut_type text not null, -- 'full', 'curry', 'biryani', 'boneless'
  quantity decimal(10,2) not null,
  unit text default 'kg',
  price_at_time decimal(10,2) not null
);
alter table public.order_items enable row level security;
create policy "Public view order items" on public.order_items for select using (true);

-- 6. SETTINGS (Global Config)
create table public.settings (
  key text primary key,
  value text,
  description text
);
alter table public.settings enable row level security;
create policy "Anyone can view settings" on public.settings for select using (true);
create policy "Admins can update settings" on public.settings for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Initial Data
insert into public.rates (item_type, price_per_kg) values 
('broiler', 240.00),
('country', 650.00)
on conflict do nothing;

insert into public.stock (item_type, quantity_kg) values 
('broiler', 50.0),
('country', 20.0)
on conflict do nothing;

insert into public.settings (key, value) values 
('shop_open', 'true'),
('holiday_mode', 'false')
on conflict do nothing;

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, phone, full_name, role)
  values (new.id, new.phone, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
