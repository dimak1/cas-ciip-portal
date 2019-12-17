import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {graphql} from 'react-relay';
import {CiipPageComponentProps} from 'next-env';
import {viewApplicationQueryResponse} from 'viewApplicationQuery.graphql';
import {ApplicationDetailsContainer_query} from 'ApplicationDetailsContainer_query.graphql';
import ApplicationDetails from 'containers/Applications/ApplicationDetailsContainer';
import ApplicationComments from 'containers/Applications/ApplicationCommentsContainer';
import ReviseApplicationButton from 'containers/Applications/ReviseApplicationButtonContainer';
import DefaultLayout from 'layouts/default-layout';
import {PDFDownloadLink, PDFViewer, StyleSheet} from '@react-pdf/renderer';
import ApplicationDetailsPdfCardItem from 'containers/Applications/ApplicationDetailsPdfCardItem';
import {simplifyParsedResolveInfoFragmentWithType} from 'graphql-parse-resolve-info';

/*
 * ViewApplication renders a summary of the data submitted in the application.
 */

interface Props extends CiipPageComponentProps {
  query: viewApplicationQueryResponse['query'];
}

class ViewApplication extends Component<Props> {
  static query = graphql`
    query viewApplicationQuery($applicationId: ID!, $version: String!) {
      query {
        session {
          ...defaultLayout_session
          ciipUserBySub {
            firstName
            lastName
            emailAddress
            phoneNumber
            occupation
          }
        }
        ...ApplicationDetailsContainer_query

        application(id: $applicationId) {
          applicationRevisionStatus {
            applicationRevisionStatus
          }
          orderedFormResults(versionNumberInput: $version) {
            edges {
              node {
                id
                ...ApplicationCommentsContainer_formResult
              }
            }
          }
          ...ReviseApplicationButtonContainer_application

          ...ApplicationDetailsContainer_application
            @arguments(version: $version)
        }
      }
      application(id: $applicationId) {
        applicationStatus {
          applicationStatus
        }
        facilityByFacilityId {
          facilityName
          facilityMailingAddress
          facilityCity
          facilityCountry
          facilityProvince
          facilityPostalCode
        }
        formResultsByApplicationId {
          edges {
            node {
              formResult
              submissionDate
              formJsonByFormId {
                name
                slug
                formJson
              }
            }
          }
        }
      }
    }
  `;

  render() {
    const {session} = this.props.query;
    const {query} = this.props;
    const formResults = query.application.orderedFormResults.edges;

    const styles = StyleSheet.create({
      page: {
        width: '100%',
        height: 1000
      }
    });

    return (
      <DefaultLayout
        showSubheader
        session={session}
        title="Summary of your application"
      >
        <Row>
          <Col md={8}>
            <ApplicationDetails
              query={query}
              application={query.application}
              review={false}
            />
          </Col>
          <Col md={4}>
            {formResults.map(({node}) => (
              <ApplicationComments
                key={node.id}
                formResult={node}
                review={false}
              />
            ))}
          </Col>
        </Row>
        <Row>
          {query?.application?.applicationRevisionStatus
            ?.applicationRevisionStatus === 'REQUESTED_CHANGES' ? (
            <ReviseApplicationButton application={query.application} />
          ) : null}
        </Row>
      </DefaultLayout>
    );
  }
}

export default ViewApplication;