import React from 'react';
import gql from 'graphql-tag';
import { Query, graphql, useQuery } from 'react-apollo';
import { flowRight as compose } from 'lodash';

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
    state = { initBulkID: '', currentCount: 100 };

    componentWillMount() {
        let bulkInitData = this.props.bulkInit().then((response) => {
            let operationID = response.data.bulkOperationRunQuery.bulkOperation.id;
            this.setState({ initBulkID: operationID });

            var intervalId = setInterval(this.timer, 1000);
            console.log('rerund timer after 30000ms ');
            // store intervalId in the state so it can be accessed later:
            this.setState({ intervalId: intervalId });
        });
    }

    componentWillUnmount() {
        console.log('component will unmount ');

        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }

    timer = () => {
        console.log('Inside Timer function ');

        // // setState method is used to update the state
        this.setState({ currentCount: this.state.currentCount - 1 });
    };

    render() {
        let { loading, error, data } = useQuery(BULK_STATUS_QUERY);
        console.log('Inside Timer function ');
        l;

        console.log('Timer Data ', data);
        console.log('Timer error ', error);
        console.log('Timer loading ', loading);

        let operation_id = this.state.initBulkID;

        if (operation_id) {
            return (
                <Query query={BULK_STATUS_QUERY}>
                    {({ data, loading, error }) => {
                        console.log('First Request for the Bulk Status Query');

                        if (loading) return <div>BULK_STATUS_QUERY Loading...</div>;
                        if (error) return <div>{error.message}</div>;
                        console.log('Printing the Data ', data);
                        if (data.currentBulkOperation.url) {
                            return (
                                <div>
                                    data.node.url true: Loaded, Current Count
                                    {this.state.currentCount}
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                    No idea yet.. please wait, Current Count
                                    {this.state.currentCount}
                                </div>
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
