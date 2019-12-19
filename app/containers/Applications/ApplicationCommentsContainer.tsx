import React, {useState} from 'react';
import {Collapse, Table, Button} from 'react-bootstrap';
import {createFragmentContainer, graphql, RelayProp} from 'react-relay';
import {ApplicationCommentsContainer_formResult} from 'ApplicationCommentsContainer_formResult.graphql';
import createReviewCommentMutation from 'mutations/application/createReviewCommentMutation';
import ApplicationCommentsBox from './ApplicationCommentsByForm';

/*
 * The ApplicationComments renders all the comments on the various sections of the application
 */

interface Props {
  formResult: ApplicationCommentsContainer_formResult;
  relay: RelayProp;
}

export const ApplicationCommentsComponent: React.FunctionComponent<Props> = props => {
  const {formResult} = props;
  const [isOpen, setIsOpen] = useState(false);

  const addComment = async () => {
    const {environment} = props.relay;
    const variables = {
      input: {
        reviewComment: {
          applicationId: formResult.applicationByApplicationId.rowId,
          formId: formResult.formJsonByFormId.rowId,
          description: 'boo',
          resolved: false
        }
      }
    };
    const formResultId = formResult.id;

    const response = await createReviewCommentMutation(
      environment,
      variables,
      formResultId
    );
    console.log(response);
  };

  return (
    <>
      <div key={formResult.id} className="form-result-box">
        <div onClick={() => setIsOpen(!isOpen)}>
          <h5> {formResult.formJsonByFormId.name} </h5>
        </div>
        <Collapse in={!isOpen}>
          <div>
            <Table striped bordered hover>
              <thead style={{textAlign: 'center'}}>
                <tr>
                  <th>Comment</th>
                  <th>Resolve</th>
                </tr>
              </thead>
              <tbody>
                {formResult.applicationComments.edges.map(({node}) => {
                  return (
                    <ApplicationCommentsBox
                      key={node.id}
                      reviewComment={node}
                    />
                  );
                })}
              </tbody>
            </Table>
            <Button onClick={addComment}>+ Add Comment</Button>
          </div>
        </Collapse>
      </div>
      );
      <style jsx>{`
        .form-result-box {
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #ff713a;
          border-radius: 5px;
          background-color: #fff4dcab;
          font-size: 14px;
        }

        .form-result-box h5 {
          border-bottom: 1px solid #888;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};

export default createFragmentContainer(ApplicationCommentsComponent, {
  formResult: graphql`
    fragment ApplicationCommentsContainer_formResult on FormResult {
      id
      applicationByApplicationId {
        id
        rowId
      }
      formJsonByFormId {
        rowId
        name
      }
      applicationComments(first: 2147483647)
        @connection(key: "ApplicationCommentsContainer_applicationComments") {
        edges {
          node {
            id
            ...ApplicationCommentsByForm_reviewComment
          }
        }
      }
    }
  `
});
