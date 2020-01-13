import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {Card, Alert} from 'react-bootstrap';
import {ciipApplicationLegalDisclaimerQueryResponse} from 'ciipApplicationLegalDisclaimerQuery.graphql';
import {CiipPageComponentProps} from 'next-env';
import {NextRouter} from 'next/router';
import DefaultLayout from 'layouts/default-layout';
import LegalDisclaimerChecklistContainer from 'containers/Applications/LegalDisclaimerChecklistContainer';

interface Props extends CiipPageComponentProps {
  query: ciipApplicationLegalDisclaimerQueryResponse['query'];
  router: NextRouter;
}
class CiipApplicationLegalDisclaimer extends Component<Props> {
  static query = graphql`
    query ciipApplicationLegalDisclaimerQuery($applicationId: ID!) {
      query {
        session {
          ...defaultLayout_session
        }
        application(id: $applicationId) {
          ...LegalDisclaimerChecklistContainer_application
        }
      }
    }
  `;

  render() {
    const {query, router} = this.props;
    const {session, application} = query || {};
    const {query: queryparams} = router;

    const {hasSwrsReport} = queryparams;
    const hasImportedReport = hasSwrsReport === 'true';

    let ImportMessage = null;

    if (hasImportedReport) {
      ImportMessage = (
        <Alert variant="danger">
          We found an emissions report for this facility, and imported the
          relevant information:
          <br />
          The administrative, fuel and emission forms will be prepopulated to
          match the data entered in your emission report. Please review it and
          complete the forms with the additional information required for your
          CIIP application.
        </Alert>
      );
    }

    return (
      <DefaultLayout session={session}>
        <Card className="mb-2">
          <Card.Body>
            <Card.Title className="blue">Legal Disclaimer</Card.Title>
            <Card.Text style={{padding: '10px 0 10px 0'}}>
              Note: The application must be submitted by the operator of the
              reporting operation or, if there is more than one operator, the
              designated operator. By submitting the application the applicant
              agrees that the information contained on this application, or
              information contained in emission reports under the Greenhouse Gas
              Industrial Reporting and Control Act, may be shared with other
              British Columbia government agencies for the purpose of
              administering the CleanBC Program for Industry.
            </Card.Text>
          </Card.Body>
        </Card>

        {ImportMessage}

        <LegalDisclaimerChecklistContainer application={application} />
      </DefaultLayout>
    );
  }
}

export default CiipApplicationLegalDisclaimer;
