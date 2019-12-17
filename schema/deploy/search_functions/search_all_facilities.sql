-- Deploy ggircs-portal:function_search_all_facilities to pg
-- requires: type_facility_search_result
-- requires: view_ciip_application

begin;

create or replace function ggircs_portal.search_all_facilities(search_field text, search_value text, order_by_field text, direction text)

  returns setof ggircs_portal.facility_search_result as
    $function$
      declare
        user_sub uuid;
        user_id int;
      begin
        user_sub := (select sub from ggircs_portal.session());
        user_id := (select id from ggircs_portal.ciip_user as cu where cu.uuid = user_sub);
        if search_field is null or search_value is null
          then return query execute 'with applicationStatus as (
            select t.application_revision_status as application_revision_status, t.version_number, t.created_at, t.application_id
            from ggircs_portal.application_revision_status t
            join (select application_id, max(version_number) as latest_version, max(created_at) as last_created
            from ggircs_portal.application_revision_status
            group by application_id) a
            on a.application_id = t.application_id
            and a.latest_version = t.version_number
            and a.last_created = t.created_at),

            applicationDetails as (
                select s.application_revision_status, a.id, a.facility_id
                from ggircs_portal.application a join applicationStatus s on a.id = s.application_id
            ),

            tempTable as (select f.*, ad.application_revision_status, ad.id as application_id
            from ggircs_portal.facility f
            left join applicationDetails ad on f.id = ad.facility_id),

            organisationInfo as (
                select row_number() over()::int as id,
                t.application_id::int,
                t.id::int as facility_id,
                t.facility_name,
                t.facility_mailing_address,
                t.facility_city,
                t.facility_postal_code,
                t.reporting_year,
                t.application_revision_status,
                o.operator_name as organisation_name
                from tempTable t
                join ggircs_portal.organisation o
                on t.organisation_id = o.id::int
                join ggircs_portal.ciip_user_organisation uo
                on uo.organisation_id = o.id
                and uo.user_id = ' || user_id || ')

            select * from organisationInfo order by ' || order_by_field || ' ' || direction;

        else
          return query execute 'with applicationStatus as (
            select t.application_revision_status as application_revision_status, t.version_number, t.application_id
            from ggircs_portal.application_revision_status t
            join (select application_id, max(version_number) as latest_version, max(created_at) as last_created
            from ggircs_portal.application_revision_status
            group by application_id) a
            on a.application_id = t.application_id
            and a.latest_version = t.version_number
            and a.last_created = t.created_at),

            applicationDetails as (
                select s.application_revision_status, a.id, a.facility_id
                from ggircs_portal.application a join applicationStatus s on a.id = s.application_id
            ),

            tempTable as (select f.*, ad.application_revision_status, ad.id as application_id
            from ggircs_portal.facility f
            left join applicationDetails ad on f.id = ad.facility_id),

            organisationInfo as (
                select row_number() over()::int as id,
                t.application_id::int,
                t.id::int as facility_id,
                t.facility_name,
                t.facility_mailing_address,
                t.facility_city,
                t.facility_postal_code,
                t.reporting_year,
                t.application_revision_status,
                o.operator_name as organisation_name
                from tempTable t
                join ggircs_portal.organisation o
                on t.organisation_id = o.id::int
                join ggircs_portal.ciip_user_organisation uo
                on uo.organisation_id = o.id
                and uo.user_id = ' || user_id || ')
            select * from organisationInfo
            where '|| search_field || '::text ilike ''%' || search_value || '%'' order by '|| order_by_field || ' ' || direction;
        end if;
      end
    $function$ language plpgsql stable;

commit;