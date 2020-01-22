set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
select plan(6);

select has_function(
  'ggircs_portal', 'ensure_window_open_submit_application_status',
  'Function ensure_window_open_submit_application_status should exist'
);

-- Set the timestamp to a time where the application window is closed
create or replace function ggircs_portal.current_timestamp() returns timestamptz as
$$
  select application_open_time - interval '1 second'
  from ggircs_portal.reporting_year
  order by reporting_year
  limit 1
  offset 2;
$$ language sql;

select throws_ok(
  $$insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status) values (1, 1, 'draft')$$,
  'You cannot start a draft when the application window is closed',
  'The trigger throws an error if starting a draft when the application window is closed'
);

select throws_ok(
  $$insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status) values (1, 1, 'submitted')$$,
  'You cannot submit an application when the application window is closed',
  'The trigger throws an error if submitting an application when the application window is closed '
);

select lives_ok(
  $$insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status) values (1, 1, 'approved')$$,
  'The trigger does not throw when setting a status of approved'
);

select lives_ok(
  $$insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status) values (1, 1, 'rejected')$$,
  'The trigger does not throw when setting a status of rejected'
);

select lives_ok(
  $$insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status) values (1, 1, 'rejected')$$,
  'The trigger does not throw when setting a status of requested changes'
);

select finish();

rollback;