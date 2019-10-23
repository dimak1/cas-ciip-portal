import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Card, Accordion, Button} from 'react-bootstrap';
import Facility from './Facility';

export const OrganisationComponent = ({organisation}) => {
  if (
    !organisation ||
    !organisation.facilitiesByOrganisationId ||
    !organisation.facilitiesByOrganisationId.edges
  ) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Button} variant="link" eventKey={organisation.id}>
          {organisation.operatorName}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={organisation.id}>
        <Card.Body style={{borderBottom: '1px solid #d3d3d3'}}>
          {organisation.facilitiesByOrganisationId.edges.map(({node}) => {
            return <Facility key={node.id} facility={node} />;
          })}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default createFragmentContainer(OrganisationComponent, {
  organisation: graphql`
    fragment Organisation_organisation on Organisation {
      id
      operatorName
      facilitiesByOrganisationId {
        edges {
          node {
            id
            ...Facility_facility
          }
        }
      }
    }
  `
});