begin;

with rows as (
insert into ggircs_portal.facility (
  id,
  organisation_id,
  report_id,
  swrs_report_id,
  swrs_facility_id ,
  swrs_organisation_id,
  reporting_year,
  facility_name,
  facility_type ,
  bcghgid,
  naics_code,
  naics_classification,
  latitude,
  longitude,
  facility_mailing_address,
  facility_city,
  facility_province,
  facility_postal_code,
  facility_country
)
overriding system value
values
(
  1,
  1,
  1,
  2208,
  48166,
  4114,
  '2018',
  'Forest Floor',
  'L_c',
  '12111100011',
  211110,
  'Oil and gas extraction (except oil sands)',
  '55.67748',
  '-119.63769',
  '7326, Evergreen Street Northwest',
  'Oak Grove',
  'British Columbia',
  'V1C6T8',
  'Canada'
),(
  2,
  2,
  2,
  1234,
  42,
  4321,
  '2018',
  'Hufflepuff',
  'IF_a',
  '12111100000',
  211110,
  'Oil and gas extraction (except oil sands)',
  '55.0000',
  '-119.63769',
  '5423, Scrimgeour Lane',
  'Godric''s Hollow',
  'British Columbia',
  'V0L2M0',
  'Canada'
),(
  3,
  2,
  2,
  1235,
  43,
  4321,
  '2018',
  'Slytherin',
  'IF_b',
  '12111100000',
  211110,
  'Oil and gas extraction (except oil sands)',
  '55.0000',
  '-119.63769',
  '5423, Scrimgeour Lane',
  'Godric''s Hollow',
  'British Columbia',
  'V0L2M0',
  'Canada'
)
on conflict(id) do update set
organisation_id=excluded.organisation_id,
report_id=excluded.report_id,
swrs_report_id=excluded.swrs_report_id,
swrs_facility_id=excluded.swrs_facility_id,
swrs_organisation_id=excluded.swrs_organisation_id,
reporting_year=excluded.reporting_year,
facility_name=excluded.facility_name,
facility_type=excluded.facility_type,
bcghgid=excluded.bcghgid,
naics_code=excluded.naics_code,
naics_classification=excluded.naics_classification,
latitude=excluded.latitude,
longitude=excluded.longitude,
facility_mailing_address=excluded.facility_mailing_address,
facility_city=excluded.facility_city,
facility_province=excluded.facility_province,
facility_postal_code=excluded.facility_postal_code,
facility_country=excluded.facility_country
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.facility' from rows;


select setval from
setval('ggircs_portal.facility_id_seq', (select max(id) from ggircs_portal.facility), true)
where setval = 0;


commit;