-- Deploy ggircs-portal:table_emission_category_gas to pg
-- requires: schema_ggircs_portal

begin;

create table ggircs_portal.emission_category_gas (
  id integer primary key generated always as identity,
  emission_category varchar(1000),
  gas_id integer references ggircs_portal.gas(id),
  created_at timestamp with time zone not null default now(),
  created_by varchar(1000),
  updated_at timestamp with time zone not null default now(),
  updated_by varchar(1000),
  deleted_at timestamp with time zone,
  deleted_by varchar(1000)
);

comment on column ggircs_portal.emission_category_gas.id is 'Unique ID for the emission_category_gas';
comment on column ggircs_portal.emission_category_gas.gas_id is 'Foreign key to gas';
comment on column ggircs_portal.emission_category_gas.emission_category is 'The emission category';
comment on column ggircs_portal.emission_category_gas.created_at is 'Creation date of row';
comment on column ggircs_portal.emission_category_gas.created_by is 'Creator of row';
comment on column ggircs_portal.emission_category_gas.updated_at is 'Updated date of row';
comment on column ggircs_portal.emission_category_gas.updated_by is 'Updator of row';
comment on column ggircs_portal.emission_category_gas.deleted_at is 'Date of deletion';
comment on column ggircs_portal.emission_category_gas.deleted_by is 'The user who deleted the row';

commit;
