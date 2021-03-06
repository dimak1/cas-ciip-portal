-- Deploy ggircs-portal:function_get_carbon_tax_by_organisation to pg

begin;

create or replace function ggircs_portal.get_carbon_tax_by_bcghgid(bcghgid_input numeric, reporting_year text)
  returns setof ggircs_portal.estimated_carbon_tax_paid
  as $function$

    select * from ggircs_portal.estimated_carbon_tax_paid
      where bcghgid::numeric = bcghgid_input
      and reporting_period_duration = reporting_year

  $function$
  language sql stable;

commit;
