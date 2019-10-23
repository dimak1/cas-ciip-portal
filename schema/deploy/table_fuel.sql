-- Deploy ggircs-portal:table_fuel to pg
-- requires: schema_ggircs_portal

begin;

create table ggircs_portal.fuel (
  id serial not null,
  name varchar(1000) not null,
  description varchar(10000),
  units varchar(1000),
  state varchar(1000),
  parent integer ARRAY,
  created_at timestamp with time zone not null default now(),
  created_by varchar(1000),
  updated_at timestamp with time zone not null default now(),
  updated_by varchar(1000),
  deleted_at timestamp with time zone,
  deleted_by varchar(1000)
);

create unique index fuel_id_uindex
  on ggircs_portal.fuel (id);

alter table ggircs_portal.fuel
  add constraint fuel_pk
    primary key (id);

comment on column ggircs_portal.fuel.id is 'Unique ID for the fuel';
comment on column ggircs_portal.fuel.name is 'The name of the fuel';
comment on column ggircs_portal.fuel.description is 'The description of the fuel';
comment on column ggircs_portal.fuel.description is 'The unit of measure for the fuel';
comment on column ggircs_portal.fuel.state is 'The current state of the fuel within the lifecycle (created, split, merged, redefined, archived, unarchived)';
comment on column ggircs_portal.fuel.parent is 'The parent ID(s) (previous state) of the fuel';
comment on column ggircs_portal.fuel.created_at is 'Creation date of row';
comment on column ggircs_portal.fuel.created_by is 'Creator of row';
comment on column ggircs_portal.fuel.updated_at is 'Updated date of row';
comment on column ggircs_portal.fuel.updated_by is 'Updator of row';
comment on column ggircs_portal.fuel.deleted_at is 'Date of deletion';
comment on column ggircs_portal.fuel.deleted_by is 'The user who deleted the row';

commit;
