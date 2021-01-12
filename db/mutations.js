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
                vendor
                productType
                handle



                 featuredImage {
                  id
                  originalSrc
                  altText
                }



               images(first: 2) {
                  edges {
                    node {
                      id
                      originalSrc
                    }
                  }
                }


                 options(first:2){
                  values
                }



                 variants(first: 2) {
                  edges {
                    node {
                      id
                      image {
                        id
                        originalSrc
                        altText
                      }
                      title
                      product {
                        id
                        title
                      }
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
