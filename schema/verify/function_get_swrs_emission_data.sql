-- Verify ggircs-portal:function_get_swrs_emission_data on pg

BEGIN;

select pg_get_functiondef('ggircs_portal.get_swrs_emission_data(integer, varchar)'::regprocedure);

ROLLBACK;
