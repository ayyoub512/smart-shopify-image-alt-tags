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

const FetchData = () => {
    const [createBulkRequest, { data: mutateData }] = useMutation(BULK_INIT_MUTATION);

    const { data, startPolling, stopPolling } = useQuery(BULK_STATUS_QUERY);

    if (data !== undefined) {
        if (data.currentBulkOperation !== undefined) {
            if (data.currentBulkOperation.url !== undefined) {
                console.log(data);
                console.log('stopping polling');
                stopPolling();

                const url = data.currentBulkOperation.url;

                return (
                    <Page>
                        <div>
                            <p>I got the data {url}</p>
                        </div>
                    </Page>
                );
            } else {
                console.log('wait ', data);

                return (
                    <Page>
                        <div>
                            <p>Loading..</p>
                        </div>
                    </Page>
                );
            }
        } else {
            return (
                <Page>
                    <div>
                        <p>Loadin 2..</p>
                    </div>
                </Page>
            );
        }
    }
    {
        console.log('Initiating a bulk request');

        createBulkRequest();
        console.log('startPolling:', data);

        startPolling(5000);
        return (
            <Page>
                <div>
                    <p>Loading..</p>
                </div>
            </Page>
        );
    }
};

const Index = () => {
    return <FetchData />;
};

export default Index;
