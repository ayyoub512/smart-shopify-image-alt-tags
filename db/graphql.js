/**
 * Containes Graphql Queries and mutations
 */

/** Used to create a bulk reqeust */
const BULK_INIT_MUTATION = `
mutation {
  bulkOperationRunQuery(
    query: """
    {
      products {
        edges {
          node {
            id
            title
            vendor
            productType
            handle

            images {
              edges {
                node {
                  id
                  originalSrc
                }
              }
            }

          }
        }
      }

      shop {
        name
        email
        contactEmail
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

/** Query to  check the status of the current ruuning bulk operation */
const BULK_STATUS_QUERY = `
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

/** Query to get the last added 15 products */
const GET_IMGS_QUERY = `
        query getIMGS{
            products(first: 15, reverse: true) {
                edges {
                    node {
                        id
                        title
                        vendor
                        productType
                        handle
                        featuredImage {
                            originalSrc
                            altText
                        }
                    }
                }
            }

            shop{
                name
                email
                contactEmail
            }

        }
`;

module.exports = {
    BULK_INIT_MUTATION,
    BULK_STATUS_QUERY,
    GET_IMGS_QUERY,
};
