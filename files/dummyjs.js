[
    {
        id: 'gid://shopify/Product/5933007012000',
        title: 'Among us',
        vendor: 'Liam Fashions',
        productType: 'among us',
        handle: 'blue-silk-tuxedo',
        productFeaturedImages: {
            id: 'gid://shopify/ProductImage/20772592091296',
            originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3.jpg?v=1610283035',
            altText: 'hi there',
        },
        productOptions: [{ values: ['xl', 'xxl'] }],
    },
    {
        id: 'gid://shopify/ProductImage/21010964021408',
        originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-purple.jpg?v=1610196936',
        __parentId: 'gid://shopify/Product/5933007012000',
    },
    {
        id: 'gid://shopify/ProductVariant/37496425414816',
        image: {
            id: 'gid://shopify/ProductImage/20772592091296',
            originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3.jpg?v=1610283035',
            altText: 'hi there',
        },
        title: 'xl',
        product: { id: 'gid://shopify/Product/5933007012000', title: 'Among us' },
        __parentId: 'gid://shopify/Product/5933007012000',
    },
];

const i = `
{
   products {
      edges {
         node {
            id
            title
            vendor
            productType
            handle
            productFeaturedImages: featuredImage {
               id
               originalSrc
               altText
            }
            productOptions: options(first:2){
               values
            }

            myImages: images(first: 2) {
               edges {
                  node {
                     id
                     originalSrc
                  }
               }
            }
            productVariant: variants(first: 2) {
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
            

 `;
