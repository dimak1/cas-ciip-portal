import React from 'react';
import {Button} from 'react-bootstrap';
import {graphql, createFragmentContainer, RelayProp} from 'react-relay';
import Link from 'next/link';
import {useRouter} from 'next/router';
import createApplicationMutation from 'mutations/application/createApplicationMutation';
import {ApplyButton_applyButtonDetails} from 'ApplyButton_applyButtonDetails.graphql';
import {ApplyButton_query} from 'ApplyButton_query.graphql';
interface Props {
  relay: RelayProp;
  applyButtonDetails: ApplyButton_applyButtonDetails;
  query: ApplyButton_query;
}

const ApplyButton: React.FunctionComponent<Props> = ({
  applyButtonDetails,
  query,
  relay
}) => {
  const {
    facilityByFacilityId,
    applicationRevisionStatus,
    applicationByApplicationId
  } = applyButtonDetails;
  const {hasSwrsReport, rowId} = facilityByFacilityId;
  const applicationId = applyButtonDetails?.applicationByApplicationId?.id;

  const router = useRouter();

  if (!query.openedReportingYear.reportingYear) {
    if (!applicationId || applicationRevisionStatus === 'DRAFT') {
      return <span>The application window is closed</span>;
    }
  }

  if (!applicationId) {
    const {environment} = relay;

    const startApplication = async () => {
      const variables = {
        input: {
          facilityIdInput: rowId
        }
      };

      const response = await createApplicationMutation(environment, variables);

      router.push({
        pathname: '/reporter/ciip-application-legal-disclaimer',
        query: {
          applicationId: response.createApplicationMutationChain.application.id,
          version: 1,
          hasSwrsReport
        }
      });
    };

    return (
      <Button variant="primary" onClick={startApplication}>
        Apply for CIIP for this facility
      </Button>
    );
  }

  const {
    latestDraftRevision,
    latestSubmittedRevision
  } = applicationByApplicationId;

  const latestSubmittedVersionNumber = latestSubmittedRevision?.versionNumber;
  const latestDraftVersionNumber = latestDraftRevision?.versionNumber;
  const latestDraftlegalDisclaimerAccepted =
    latestDraftRevision?.legalDisclaimerAccepted;

  if (applicationRevisionStatus === 'DRAFT') {
    const continueApplication = () => {
      router.push({
        pathname: latestDraftlegalDisclaimerAccepted
          ? '/reporter/ciip-application'
          : '/reporter/ciip-application-legal-disclaimer',
        query: {
          applicationId,
          version: latestDraftVersionNumber
        }
      });
    };

    return (
      <Button variant="primary" onClick={continueApplication}>
        Resume CIIP application
      </Button>
    );
  }

  if (
    applicationRevisionStatus === 'SUBMITTED' ||
    applicationRevisionStatus === 'REQUESTED_CHANGES'
  ) {
    return (
      <Link
        href={{
          pathname: '/reporter/view-application',
          query: {
            applicationId,
            version: latestSubmittedVersionNumber
          }
        }}
      >
        <Button variant="primary">View Submitted Application</Button>
      </Link>
    );
  }

  return null;
};

export default createFragmentContainer(ApplyButton, {
  applyButtonDetails: graphql`
    fragment ApplyButton_applyButtonDetails on FacilitySearchResult {
      applicationByApplicationId {
        id
        latestDraftRevision {
          id
          versionNumber
          legalDisclaimerAccepted
        }
        latestSubmittedRevision {
          id
          versionNumber
        }
      }
      applicationRevisionStatus
      facilityByFacilityId {
        rowId
        hasSwrsReport(reportingYear: 2018)
      }
    }
  `,
  query: graphql`
    fragment ApplyButton_query on Query {
      openedReportingYear {
        reportingYear
      }
    }
  `
});
