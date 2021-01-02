import { gql } from '@apollo/client';

export const BULK_INIT_MUTATION = gql`
    mutation {
        bulkOperationRunQuery(
            query: """
            {
              products {
                edges {
                  node {
                    id
                    title
                    images{
                      edges{
                        node{
                          id
                          originalSrc
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
            """
        ) {
            bulkOperation {
                id
                status
            }
            userErrors {
                field
                message
            }
        }
    }
`;

export const BULK_STATUS_QUERY = gql`
    query {
        currentBulkOperation {
            id
            status
            errorCode
            createdAt
            completedAt
            objectCount
            fileSize
            url
            partialDataUrl
        }
    }
`;
