create or replace function public.rye_admin_login(p_email text,p_password text)
returns table(session_token text,expires_at timestamptz)
language plpgsql security definer set search_path=public,extensions as $$
declare v_user public.rye_admin_users%rowtype; v_token text; v_exp timestamptz;
begin
  select * into v_user from public.rye_admin_users u where lower(u.email)=lower(trim(p_email)) and u.is_active=true limit 1;
  if v_user.id is null or v_user.password_hash<>extensions.crypt(p_password,v_user.password_hash) then perform pg_sleep(0.35); raise exception 'invalid credentials'; end if;
  delete from public.rye_admin_sessions s where s.expires_at<=now();
  v_token:=encode(extensions.gen_random_bytes(32),'hex'); v_exp:=now()+interval '12 hours';
  insert into public.rye_admin_sessions(admin_user_id,session_token,expires_at) values(v_user.id,v_token,v_exp);
  update public.rye_admin_users u set last_login_at=now() where u.id=v_user.id;
  return query select v_token,v_exp;
end $$;
grant execute on function public.rye_admin_login(text,text) to anon,authenticated;
