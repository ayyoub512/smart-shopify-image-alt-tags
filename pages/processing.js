import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Page } from '@shopify/polaris';

const BULK_INIT_MUTATION = gql`
    mutation {
        bulkOperationRunQuery(
            query: """
            {
              products {
                edges {
                  node {
                    id
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

const BULK_STATUS_QUERY = gql`
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

const Dash = () => {
    return <p>I geuss I got the data</p>;
};

export default Dash;
