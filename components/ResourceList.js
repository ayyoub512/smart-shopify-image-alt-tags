import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, useQuery, graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const GET_PRODUCTS_BY_ID = gql`
    query getProducts {
        nodes(ids: ["gid://shopify/Product/5933007536288"]) {
            ... on Product {
                title
                handle
                descriptionHtml
                id
                images(first: 1) {
                    edges {
                        node {
                            originalSrc
                            altText
                        }
                    }
                }
                variants(first: 1) {
                    edges {
                        node {
                            price
                            id
                        }
                    }
                }
            }
        }
    }
`;

const BULK_INIT_QUERY = gql`
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
    query getStatus($id: ID!) {
        node(id: $id) {
            ... on BulkOperation {
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
    }
`;

class ResourceListWithProducts extends React.Component {
    state = { initBulkID: '' };

    componentWillMount() {
        let bulkInitData = this.props.bulkInit().then((response) => {
            let operationID = response.data.bulkOperationRunQuery.bulkOperation.id;
            this.setState({ initBulkID: operationID });
        });
    }

    render() {
        let operation_id = this.state.initBulkID;

        if (operation_id) {
            return (
                <Query query={BULK_STATUS_QUERY} variables={{ id: operation_id }}>
                    {({ data, loading, error }) => {
                        if (loading) return <div>Loading...</div>;
                        if (error) return <div>{error.message}</div>;
                        console.log(data.node.url);
                        if (data.node.url) {
                            return <div>Loaded</div>;
                        } else {
                            return (
                                <Query query={BULK_STATUS_QUERY} variables={{ id: operation_id }}>
                                    {({ data, loading, error }) => {
                                        console.log('BULK_STATUS_QUERY', data);
                                        if (loading) return <div>Loading Bulk Status Query</div>;
                                        if (error) return <div>{error.message}</div>;
                                        return <div>Bulk Status Query Loading: {loading} </div>;
                                    }}
                                </Query>
                            );
                        }
                    }}
                </Query>
            );
        } else {
            return <p>No Operation ID yet, Loading...</p>;
        }
    }
}

export default compose(graphql(BULK_INIT_QUERY, { name: 'bulkInit' }))(ResourceListWithProducts);
