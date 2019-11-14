import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {applicationsQueryResponse} from 'applicationsQuery.graphql';
import DefaultLayout from '../layouts/default-layout';
import ApplicationListContainer from '../containers/Applications/ApplicationListContainer';
import SearchTable from '../components/SearchTable';

interface Props {
  query: applicationsQueryResponse['query'];
}

class Applications extends Component<Props> {
  // In downstream component
  // onClick={(event) => handleApplicationsAction({action: Applications.SORT_ACTION})})
  // I didn't fully understand how to make this work, so I moved on with the way I did.
  static query = graphql`
    query applicationsQuery(
      $orderByField: String
      $direction: String
      $searchField: String
      $searchValue: String
    ) {
      query {
        session {
          ...Header_session
        }
        ...ApplicationListContainer_query
          @arguments(
            orderByField: $orderByField
            direction: $direction
            searchField: $searchField
            searchValue: $searchValue
          )
      }
    }
  `;

  static async getInitialProps() {
    return {
      variables: {
        orderByField: 'operator_name',
        direction: 'ASC'
      }
    };
  }

  render() {
    const {query} = this.props;
    return (
      <>
        <DefaultLayout title="Applications" session={query.session}>
          {/*
             //@ts-ignore  */}
          <SearchTable
            query={query}
            defaultOrderByField="operator_name"
            defaultOrderByDisplay="Operator Name"
          >
            <ApplicationListContainer />
          </SearchTable>
        </DefaultLayout>
      </>
    );
  }
}

export default Applications;
