import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Page } from '@shopify/polaris';
import LoadingComponent from '../components/LoadingComponent';
import { Redirect } from '@shopify/app-bridge/actions';
import { useRouter } from 'next/router';

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
    const router = useRouter();

    const [createBulkRequest, { data: mutateData }] = useMutation(BULK_INIT_MUTATION);

    const { data, startPolling, stopPolling } = useQuery(BULK_STATUS_QUERY);

    const status = data && data.status;

    React.useEffect(() => {
        console.log('inside effect, data is ', data);
        if (status !== 'COMPLETED') {
            createBulkRequest();
            startPolling(5000);
        }
        return () => stopPolling();
    }, [status]);

    if (data !== undefined) {
        if (data.currentBulkOperation !== undefined) {
            if (data.currentBulkOperation.url !== undefined) {
                stopPolling();

                const url = data.currentBulkOperation.url;

                return <p>Redirecting to /processing </p>;
            } else {
                return (
                    <Page>
                        else data.currentBulkOperation.url !== undefined
                        <LoadingComponent />
                    </Page>
                );
            }
        } else {
            return (
                <Page>
                    ELSE data.currentBulkOperation !== undefined
                    <LoadingComponent />
                </Page>
            );
        }
    }
    {
        return (
            <Page>
                default !== data
                <LoadingComponent />
            </Page>
        );
    }
};

const Index = () => {
    return <FetchData />;
};

export default Index;
