-- Revert ggircs-portal:function_create_application_review_mutation_chain from pg

begin;

drop function ggircs_portal.create_application_review_mutation_chain;

commit;
