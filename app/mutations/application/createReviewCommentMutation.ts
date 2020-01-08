import {graphql, DeclarativeMutationConfig} from 'react-relay';
import {RelayModernEnvironment} from 'relay-runtime/lib/store/RelayModernEnvironment';
import {
  createReviewCommentMutationVariables,
  createReviewCommentMutation as createReviewCommentMutationType
} from 'createReviewCommentMutation.graphql';
import BaseMutation from 'mutations/BaseMutation';

const mutation = graphql`
  mutation createReviewCommentMutation($input: CreateReviewCommentInput!) {
    createReviewComment(input: $input) {
      clientMutationId
      reviewCommentEdge {
        node {
          id
          description
          createdAt
          resolved
        }
      }
    }
  }
`;

const createReviewCommentMutation = async (
  environment: RelayModernEnvironment,
  variables: createReviewCommentMutationVariables,
  formResultId: string
) => {
  const configs: DeclarativeMutationConfig[] = [
    {
      type: 'RANGE_ADD',
      parentID: formResultId,
      connectionInfo: [
        {
          key: 'ApplicationCommentsContainer_applicationComments',
          rangeBehavior: 'append'
        }
      ],
      edgeName: 'reviewCommentEdge'
    }
  ];
  const m = new BaseMutation<createReviewCommentMutationType>(
    'create-review-comment-mutation',
    configs
  );
  return m.performMutation(environment, mutation, variables);
};

export default createReviewCommentMutation;
