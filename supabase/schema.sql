-- =========================================================
-- Rodante · Base de datos del catálogo (paso 3)
-- Pegar TODO en Supabase → SQL Editor → New query → Run
-- =========================================================

-- 1) Tabla de autos
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  brand text not null,
  model text not null,
  version text,
  year int not null,
  km int not null default 0,
  price int not null,                       -- en US$
  body_type text not null default 'SUV',    -- SUV | Sedán | Hatchback | Pickup
  transmission text not null default 'Automática',
  fuel text not null default 'Gasolina',
  color text,
  description text,
  photos text[] not null default '{}',      -- URLs públicas, la primera es la portada
  video_url text,                           -- link de YouTube (puede ser "no listado")
  badge text,                               -- ej. "Nuevo ingreso", "Precio rebajado"
  status text not null default 'disponible' check (status in ('disponible', 'reservado', 'vendido')),
  published boolean not null default true
);

-- 2) Administradores (solo estos correos pueden editar)
create table if not exists public.admins (email text primary key);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

-- 3) Seguridad: cualquiera puede VER autos publicados; solo admins editan
alter table public.cars enable row level security;
alter table public.admins enable row level security;

drop policy if exists "cars_public_read" on public.cars;
create policy "cars_public_read" on public.cars for select using (published = true or public.is_admin());
drop policy if exists "cars_admin_insert" on public.cars;
create policy "cars_admin_insert" on public.cars for insert with check (public.is_admin());
drop policy if exists "cars_admin_update" on public.cars;
create policy "cars_admin_update" on public.cars for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "cars_admin_delete" on public.cars;
create policy "cars_admin_delete" on public.cars for delete using (public.is_admin());

-- 4) Carpeta de fotos
insert into storage.buckets (id, name, public) values ('autos', 'autos', true) on conflict (id) do nothing;

drop policy if exists "autos_public_read" on storage.objects;
create policy "autos_public_read" on storage.objects for select using (bucket_id = 'autos');
drop policy if exists "autos_admin_insert" on storage.objects;
create policy "autos_admin_insert" on storage.objects for insert with check (bucket_id = 'autos' and public.is_admin());
drop policy if exists "autos_admin_update" on storage.objects;
create policy "autos_admin_update" on storage.objects for update using (bucket_id = 'autos' and public.is_admin());
drop policy if exists "autos_admin_delete" on storage.objects;
create policy "autos_admin_delete" on storage.objects for delete using (bucket_id = 'autos' and public.is_admin());

-- 5) TU CORREO de administrador (cámbialo antes de correr)
insert into public.admins (email) values ('TU_CORREO@gmail.com') on conflict do nothing;

-- 6) Autos de prueba (opcional; bórralos luego desde el panel)
insert into public.cars (brand, model, version, year, km, price, body_type, transmission, fuel, badge, description) values
  ('Toyota', 'RAV4', 'XLE', 2021, 42000, 27900, 'SUV', 'Automática', 'Gasolina', 'Nuevo ingreso', 'Auto de prueba.'),
  ('Hyundai', 'Tucson', 'GLS', 2020, 58000, 21500, 'SUV', 'Automática', 'Gasolina', null, 'Auto de prueba.'),
  ('Kia', 'Rio', 'EX', 2022, 31000, 13800, 'Hatchback', 'Mecánica', 'Gasolina', 'Precio rebajado', 'Auto de prueba.'),
  ('Toyota', 'Corolla', 'XEI', 2019, 76000, 16900, 'Sedán', 'Automática', 'Gasolina', null, 'Auto de prueba.'),
  ('Nissan', 'Frontier', 'LE 4x4', 2021, 64000, 31500, 'Pickup', 'Mecánica', 'Diésel', 'Nuevo ingreso', 'Auto de prueba.');
