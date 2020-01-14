-- Deploy ggircs-portal:function_current_time to pg
-- requires: schema_ggircs_portal

begin;

create function ggircs_portal.current_timestamp() returns timestamptz as
$$
  select current_timestamp;
$$ language sql;

commit;

comment on function ggircs_portal.current_timestamp is 'Returns the current date and time with time zone.
This should be used instead of the native current_timestamp function to allow for mocking in test and development settings';
