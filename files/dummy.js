data = [
    { id: 'gid://shopify/Product/5933006946464', title: 'Red Sports Tee' },
    {
        id: 'gid://shopify/ProductImage/20771193389216',
        originalSrc:
            'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/womens-red-t-shirt_925x_bcf81605-4475-46c0-a85c-2f8b2fca729a.jpg?v=1608301912',
        altText: 'woman wearing red sports tee',
        __parentId: 'gid://shopify/Product/5933006946464',
    },
    { id: 'gid://shopify/Product/5933007012000', title: 'Among us' },
    {
        id: 'gid://shopify/ProductImage/20771193585824',
        originalSrc:
            'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/man-adjusts-blue-tuxedo-bowtie_925x_656f2a36-34a8-4db2-9701-c01e49e9e5c0.jpg?v=1608315484',
        altText: 'Man wearing blue silk tuxedo',
        __parentId: 'gid://shopify/Product/5933007012000',
    },
    {
        id: 'gid://shopify/ProductImage/20772592091296',
        originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3.jpg?v=1608315484',
        altText: null,
        __parentId: 'gid://shopify/Product/5933007012000',
    },
    { id: 'gid://shopify/Product/5933007044768', title: 'White Cotton Shirt' },
    {
        id: 'gid://shopify/ProductImage/20771193880736',
        originalSrc:
            'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/smiling-woman-poses_925x_14ecaa8e-2b1e-4b49-bbaf-470b9b3a8407.jpg?v=1608301917',
        altText: 'woman wearing white button up shirt',
        __parentId: 'gid://shopify/Product/5933007044768',
    },

    {
        id: 'ds',
        originalSrc:
            'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/man-adjusts-blue-tuxedo-bowtie_925x_656f2a36-34a8-4db2-9701-c01e49e9e5c0.jpg?v=1608315484',
        altText: 'Man wearing blue silk tuxedo',
        __parentId: 'gid://shopify/Product/2',
    },
];

res = {};

data.forEach((line) => {
    console.log(JSON.parse(line));
});
