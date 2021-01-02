export const GET_IMGS_QUERY = `
        query getIMGS{
            products(first: 1, reverse: true) {
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
            }

        }
`;
