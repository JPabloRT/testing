-- Drop the existing table
drop table if exists evaluaciones;

-- Recreate the evaluaciones table with the correct structure
create table evaluaciones (
    id uuid default uuid_generate_v4() primary key,
    session_id uuid not null,
    informacion_personal jsonb not null,
    parte1 jsonb not null,
    parte2 jsonb not null,
    created_at timestamp with time zone default timezone('UTC'::text, now())
);

-- Create a security policy to allow inserts from anonymous users
alter table evaluaciones enable row level security;

create policy "Allow anonymous inserts"
    on evaluaciones
    for insert
    to anon
    with check (true);

-- Allow the owner to read all records
create policy "Allow owner to read"
    on evaluaciones
    for select
    to authenticated
    using (true);
