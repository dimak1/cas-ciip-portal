-- Verify ggircs-portal:function_get_products_by_bcghgid on pg

begin;

select pg_get_functiondef('ggircs_portal.get_products_by_bcghgid(numeric)'::regprocedure);

rollback;
