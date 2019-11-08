import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {ciipApplicationQueryResponse} from 'ciipApplicationQuery.graphql';
import DefaultLayout from '../layouts/default-layout';
import ApplicationWizard from '../containers/Applications/ApplicationWizard';

interface Props {
  query: ciipApplicationQueryResponse['query'];
}
class CiipApplication extends Component<Props> {
  static query = graphql`
    query ciipApplicationQuery($formResultId: ID!, $applicationId: ID!) {
      query {
        session {
          ...Header_session
        }
        ...ApplicationWizard_query
          @arguments(formResultId: $formResultId, applicationId: $applicationId)
      }
    }
  `;

  static getInitialProps = () => ({
    variables: {
      formResultId: '',
      applicationId: ''
    }
  });

  render() {
    const {query} = this.props;
    const {session} = query || {};
    return (
      <DefaultLayout session={session}>
        <ApplicationWizard query={query} />
      </DefaultLayout>
    );
  }
}

export default CiipApplication;