-- Verify ggircs-portal:function_update_timestamps on pg

begin;

select pg_get_functiondef('ggircs_portal.update_timestamps()'::regprocedure);

rollback;
