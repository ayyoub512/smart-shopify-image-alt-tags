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
    // const [seconds, setSeconds] = useState(0);

    // const [createBulkRequest, { data }] = useMutation(BULK_INIT_MUTATION);
    // createBulkRequest();
    // const { loading, error, data: myData } = useQuery(BULK_STATUS_QUERY);

    // useEffect(() => {
    //     console.log(myData);

    //     // const timer = setInterval(() => {
    //     //     setSeconds(seconds + 1);
    //     // }, 2000);
    //     // clearing interval
    //     // return () => clearInterval(timer);
    // }, [loading]);

    // if (loading) return <div>BULK_STATUS_QUERY Loading...</div>;
    // if (error) return <div>{error.message}</div>;
    // console.log('Printing the Data ', myData);
    return <p>I geuss I got the data</p>;
};

export default Dash;
