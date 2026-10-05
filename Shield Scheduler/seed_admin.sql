insert into
public.profiles (
    id,
    employee_id,
    full_name,
    position,
    account_type
)

select
    id,
    'ADMIN-001',
    'SHIELD Administrator',
    'Administrator',
    'admin'

from auth.users

where lower(email) =
    'shieldadmin@nucas.com'

on conflict (id)
do update set

    employee_id =
        excluded.employee_id,

    full_name =
        excluded.full_name,

    position =
        excluded.position,

    account_type =
        excluded.account_type;


insert into
public.admin_secrets (
    user_id,
    admin_code_hash
)

select
    id,

    extensions.crypt(
        'SHIELD-2026',
        extensions.gen_salt(
            'bf'
        )
    )

from auth.users

where lower(email) =
    'shieldadmin@nucas.com'

on conflict (
    user_id
)
do update set

    admin_code_hash =
        excluded.admin_code_hash;