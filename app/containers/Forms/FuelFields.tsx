import React from 'react';
import {FieldProps} from 'react-jsonschema-form';
import {createFragmentContainer, graphql} from 'react-relay';
import {Form, Col} from 'react-bootstrap';
import {FuelFields_query} from 'FuelFields_query.graphql';
import SearchDropdown from 'components/SearchDropdown';

interface Props extends FieldProps {
  query: FuelFields_query;
}

const FuelFields: React.FunctionComponent<Props> = ({
  formData,
  query,
  schema,
  onChange
}) => {
  const changeField = (event, key) => {
    onChange({
      ...formData,
      [key]: (event.nativeEvent.target as HTMLInputElement).value
    });
  };

  return (
    <>
      <Col xs={12} md={6}>
        <Form.Group controlId="id.fuelType">
          <Form.Label>Fuel Type</Form.Label>
          <SearchDropdown
            placeholder="Select fuel or type to filter..."
            defaultInputValue={formData.fuelType}
            options={query.allFuels.edges.map(({node}) => ({
              id: node.rowId,
              name: node.name
            }))}
            inputProps={{id: 'id.fuelType'}}
            onChange={(items: any[]) => {
              if (items.length > 0) {
                onChange({
                  ...formData,
                  fuelType: items[0].label,
                  fuelUnits: undefined
                });
              }
            }}
          />
        </Form.Group>
      </Col>
      <Col xs={12} md={4}>
        <Form.Group controlId="id.quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            defaultValue={formData.quantity}
            onChange={e => {
              onChange({
                ...formData,
                quantity: Number(
                  (e.nativeEvent.target as HTMLInputElement).value
                )
              });
            }}
          />
        </Form.Group>
      </Col>
      <Col xs={12} md={2}>
        <Form.Group controlId="id.fuelUnits">
          <Form.Label>Units</Form.Label>
          <Form.Control
            as="select"
            value={formData.fuelUnits}
            onChange={e => changeField(e, 'fuelUnits')}
          >
            <option value="">...</option>
            {query.allFuels.edges
              .filter(({node}) => node.name === formData.fuelType)
              .map(({node}) => (
                <option key={node.name}>{node.units}</option>
              ))}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group controlId="id.methodology">
          <Form.Label>Methodology</Form.Label>
          <Form.Control
            as="select"
            value={formData.methodology}
            onChange={e => changeField(e, 'methodology')}
          >
            <option value="">...</option>
            {(schema.properties.methodology as any).enum.map((e, i) => (
              <option key={e} value={e}>
                {(schema.properties.methodology as any).enumNames[i]}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
    </>
  );
};

export default createFragmentContainer(FuelFields, {
  query: graphql`
    fragment FuelFields_query on Query {
      allFuels {
        edges {
          node {
            name
            units
            rowId
          }
        }
      }
    }
  `
});
