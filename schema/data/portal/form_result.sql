 begin;

with rows as (
insert into ggircs_portal.form_result
(id, form_id, application_id, submission_date, form_result)
overriding system value
values
  (1,1,1, '2019-09-17 14:49:54.191757-07', '{"operator": {"name": "Test operator"}}'),
  (2,2,1, '2019-09-17 14:49:54.191757-07', '{"Flaring": [{"CH4": [{"GWP": " x 25 = ", "annualCO2e": 1625, "annualEmission": 65}], "CO2nonbio": [{"GWP": " x 1 = ", "annualCO2e": 37, "annualEmission": 37}]}], "Venting": [{"CH4": [{"GWP": " x 25 = ", "annualCO2e": 2050, "annualEmission": 82}], "CO2nonbio": [{"GWP": " x 1 = ", "annualCO2e": 53, "annualEmission": 53}]}], "Fugitive": [{"CH4": [{"GWP": " x 25 = ", "annualCO2e": 1800, "annualEmission": 72}], "CO2nonbio": [{"GWP": " x 1 = ", "annualCO2e": 4, "annualEmission": 4}]}]}'),
  (3,3,1, '2019-09-17 14:49:54.191757-07', '[{"fuelType": "C/D Waste - Plastic", "quantity": 4, "fuelUnits": "t", "methodology": "wci 1.0"}]'),
  (4,4,1, '2019-09-17 14:49:54.191757-07', '{"heat": {"sold": 81, "quantity": 96, "purchased": 29, "consumedOnsite": 54, "generatedOnsite": 44}, "electricity": {"sold": 57, "quantity": 28, "purchased": 22, "consumedOnsite": 87, "generatedOnsite": 66}}'),
  (5,5,1, '2019-09-17 14:49:54.191757-07', '[{"product": "Dehydration", "comments": "Saepe quis aliquid e", "quantity": 84, "productUnits": "kl", "associatedEmissions": 42}]')
on conflict(id) do update set
form_id=excluded.form_id,
application_id=excluded.application_id,
submission_date=excluded.submission_date,
form_result=excluded.form_result
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.form_result' from rows;

select setval from
setval('ggircs_portal.form_result_id_seq', (select max(id) from ggircs_portal.form_result), true)
where setval = 0;

select ggircs_portal.create_application_mutation_chain(2);

commit;
