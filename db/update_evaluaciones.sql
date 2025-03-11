-- Add session_id column to evaluaciones table
alter table evaluaciones 
add column session_id uuid;
