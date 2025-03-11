-- Create the evaluaciones table
create table evaluaciones (
    id uuid default uuid_generate_v4() primary key,
    fecha timestamp with time zone default timezone('UTC'::text, now()),
    informacion_personal jsonb not null,
    parte1 jsonb not null,
    parte2 jsonb not null,
    created_at timestamp with time zone default timezone('UTC'::text, now())
);

-- Create a security policy to allow inserts from authenticated users
alter table evaluaciones enable row level security;

-- Allow any authenticated user to insert data
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
