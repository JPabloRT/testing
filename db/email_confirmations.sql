-- Create the email_confirmations table
create table email_confirmations (
    id uuid default uuid_generate_v4() primary key,
    email text not null,
    nombre text not null,
    timestamp timestamp with time zone default timezone('UTC'::text, now()),
    enviado boolean default false,
    created_at timestamp with time zone default timezone('UTC'::text, now())
);

-- Create a security policy to allow inserts
alter table email_confirmations enable row level security;

create policy "Allow anonymous inserts"
    on email_confirmations
    for insert
    to anon
    with check (true);

-- Create a policy to allow the service role to update the status
create policy "Allow service role to update"
    on email_confirmations
    for update
    to service_role
    using (true)
    with check (true);
