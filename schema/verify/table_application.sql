-- Verify ggircs-portal:table_application on pg

begin;

select pg_catalog.has_table_privilege('ggircs_portal.application', 'select');

rollback;
