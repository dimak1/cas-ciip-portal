-- Verify ggircs-portal:function_import_from_swrs on pg

BEGIN;

select pg_get_functiondef('ggircs_portal.get_swrs_organisation_data(integer, varchar)'::regprocedure);

ROLLBACK;
