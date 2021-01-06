import { gql } from '@apollo/client';

export const BULK_INIT_MUTATION = `
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

export const BULK_STATUS_QUERY = `
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
