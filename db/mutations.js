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

               images(first: 2) {
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

module.exports = {
    BULK_INIT_MUTATION,
    BULK_STATUS_QUERY,
};
