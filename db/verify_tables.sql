-- Verify evaluaciones table
select 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
from information_schema.columns 
where table_name = 'evaluaciones'
order by ordinal_position;

-- Verify email_confirmations table
select 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
from information_schema.columns 
where table_name = 'email_confirmations'
order by ordinal_position;
