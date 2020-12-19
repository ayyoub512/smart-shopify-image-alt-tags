import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

console.log('Hello from the resource list.js inside components');

const GET_PRODUCTS_BY_ID = gql`
    query getProducts($ids: [ID!]!) {
        nodes(ids: $ids) {
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

class ResourceListWithProducts extends React.Component {
    static contextType = Context;

    render() {
        console.log('Hi Resource list funk');

        const app = this.context;

        const redirectToProduct = () => {
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, '/edit-products');
        };

        const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();

        return (
            <Mutation mutation={BULK_INIT_QUERY}>
                {(initBulkOperation, { data }) => (
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                initBulkOperation({ variables: {} });
                                console.log(data);
                            }}
                        >
                            <button type='submit'>REQUEST DATA</button>
                        </form>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default ResourceListWithProducts;
