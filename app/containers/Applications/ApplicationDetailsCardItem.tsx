import React, {useState} from 'react';
import {Button, Card, Collapse, Col, Row} from 'react-bootstrap';
import {createFragmentContainer, graphql} from 'react-relay';
import JsonSchemaForm from 'react-jsonschema-form';
import {FormJson} from 'next-env';
import SummaryFormArrayFieldTemplate from '../Forms/SummaryFormArrayFieldTemplate';
import SummaryFormFieldTemplate from '../Forms/SummaryFormFieldTemplate';
import SummaryEmissionGasFields from '../Forms/SummaryEmissionGasFields';
import SummaryEmissionSourceFields from '../Forms/SummaryEmissionSourceFields';
import FormObjectFieldTemplate from '../Forms/FormObjectFieldTemplate';

interface Props {
  formResult;
}

/*
 * The ApplicationDetails renders a summary of the data submitted in the application
 */
export const ApplicationDetailsCardItemComponent: React.FunctionComponent<Props> = ({
  formResult
}) => {
  const {formJsonByFormId} = formResult;
  const query = formResult.formResult;
  const {formJson} = formJsonByFormId;
  const {schema, uiSchema, customFormats} = formJson as FormJson;

  const [isOpen, setIsOpen] = useState(false);

  const CUSTOM_FIELDS = {
    TitleField: props => <h3>{props.title}</h3>,
    StringField: props => (
      <> {props.formData ? props.formData : <i>[No Data Entered]</i>}</>
    ),
    BooleanField: props => <> {props.formData ? 'Yes' : 'No'}</>,
    emissionSource: props => <SummaryEmissionSourceFields {...props} />,
    emissionGas: props => <SummaryEmissionGasFields {...props} />
  };
  const classTag = formJsonByFormId.slug;
  return (
    <Card
      style={{width: '100%', marginBottom: '10px'}}
      className={`${classTag} summary-card`}
    >
      <Card.Header onClick={() => setIsOpen(!isOpen)}>
        <Row>
          <Col md={9}>
            <h2>{formJsonByFormId.name}</h2>
          </Col>
          <Col md={3} style={{textAlign: 'right'}}>
            <Button>{isOpen ? 'Expand' : 'Collapse'}</Button>
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={!isOpen}>
        <Card.Body>
          <JsonSchemaForm
            omitExtraData
            liveOmit
            ArrayFieldTemplate={SummaryFormArrayFieldTemplate}
            FieldTemplate={SummaryFormFieldTemplate}
            showErrorList={false}
            fields={CUSTOM_FIELDS}
            customFormats={customFormats}
            schema={schema}
            uiSchema={uiSchema}
            ObjectFieldTemplate={FormObjectFieldTemplate}
            formData={query}
          >
            {/* Over-ride submit button for each form with an empty fragment */}
            <></>
          </JsonSchemaForm>
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default createFragmentContainer(ApplicationDetailsCardItemComponent, {
  formResult: graphql`
    fragment ApplicationDetailsCardItem_formResult on FormResult {
      formResult
      formJsonByFormId {
        name
        slug
        formJson
      }
    }
  `
});