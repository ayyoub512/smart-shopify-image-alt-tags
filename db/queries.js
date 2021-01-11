/** Query to get the last added 10 products */
export const GET_IMGS_QUERY = `
        query getIMGS{
            products(first: 10, reverse: true) {
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
