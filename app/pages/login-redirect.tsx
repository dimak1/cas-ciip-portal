import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {graphql} from 'react-relay';
import {loginRedirectQueryResponse} from 'loginRedirectQuery.graphql';
import {CiipPageComponentProps} from 'next-env';
import DefaultLayout from '../layouts/default-layout';
import RegistrationLoginButtons from '../components/RegistrationLoginButtons';
interface Props extends CiipPageComponentProps {
  query: loginRedirectQueryResponse['query'];
}

export default class LoginRedirect extends Component<Props> {
  static query = graphql`
    query loginRedirectQuery {
      query {
        session {
          ...defaultLayout_session
        }
      }
    }
  `;

  render() {
    const {query} = this.props;
    const {session} = query || {};
    return (
      <DefaultLayout
        showSubheader={false}
        session={session}
        needsSession={false}
        needsUser={false}
      >
        <Row style={{marginTop: '60px'}}>
          <Col md={6}>
            <h3 className="blue">
              You need to be logged in to access this page.
            </h3>
            <p>
              Please log in or register in order to access this page.
              <br />
              You will be redirected to the requested page after doing so.
            </p>
          </Col>
          <RegistrationLoginButtons />
        </Row>
      </DefaultLayout>
    );
  }
}