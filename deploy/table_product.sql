-- Deploy ggircs-portal:product to pg
-- requires: schema_ggircs_portal


BEGIN;

create table ggircs_portal.product (
  id serial not null,
  product_benchmark_id int not null references ggircs_portal.product_benchmark,
  name varchar(1000) not null,
  description varchar(10000),
  archived boolean
);

create unique index product_id_uindex
	on ggircs_portal.product (id);

alter table ggircs_portal.product
	add constraint product_pk
		primary key (id);

comment on column ggircs_portal.product.id is 'Unique ID for the product';
comment on column ggircs_portal.product.id is 'Foreign key to the product_benchmark through table';
comment on column ggircs_portal.product.name is 'The name of the product';
comment on column ggircs_portal.product.archived is 'Archived status';

COMMIT;
