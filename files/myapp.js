const dataArray = [
    {
        id: 'gid://shopify/Product/5933007012000',
        title: 'Not among us',
        vendor: 'Liam Fashions',
        productType: 'among us',
        handle: 'blue-silk-tuxedo',

        productImages: [
            {
                id: 'gid://shopify/ProductImage/20772592091296',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3.jpg?v=1610404376',
                __parentId: 'gid://shopify/Product/5933007012000',
            },
            {
                id: 'gid://shopify/ProductImage/21010964021408',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-purple.jpg?v=1610404376',
                __parentId: 'gid://shopify/Product/5933007012000',
            },
        ],
    },
    {
        id: 'gid://shopify/Product/5933007110304',
        title: 'Among us',
        vendor: 'Liam Fashions',
        productType: 'shirts',
        handle: 'chequered-red-shirt',

        productImages: [
            {
                id: 'gid://shopify/ProductImage/21048338546848',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/ezgif.com-gif-maker.jpg?v=1610461385',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
            {
                id: 'gid://shopify/ProductImage/21048338677920',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3_6c3d121b-3c24-46f9-8eba-1c38f593ec7e.jpg?v=1610461385',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
            {
                id: 'gid://shopify/ProductImage/21048338612384',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-4.jpg?v=1610461385',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
            {
                id: 'gid://shopify/ProductImage/21048406540448',
                originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/hmm2.jpg?v=1610461385',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
            {
                id: 'gid://shopify/ProductImage/21048426365088',
                originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/hmm1.jpg?v=1610461468',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
            {
                id: 'gid://shopify/ProductImage/21048427905184',
                originalSrc: 'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/hmm3.jpg?v=1610461474',
                __parentId: 'gid://shopify/Product/5933007110304',
            },
        ],
    },
    {
        id: 'gid://shopify/Product/5933007536288',
        title: 'Classic Leather Jacket',
        vendor: 'Liam Fashions',
        productType: '',
        handle: 'classic-leather-jacket',
        productImages: [
            {
                id: 'gid://shopify/ProductImage/20771196141728',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/leather-jacket-and-tea_925x_e917107c-d13e-4260-91a6-0ed33f12e7e1.jpg?v=1608301937',
                __parentId: 'gid://shopify/Product/5933007536288',
            },
            {
                id: 'gid://shopify/ProductImage/21051097809056',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/hmm1_29106cc3-b794-46a9-a86c-cbbc3661d516.jpg?v=1610472514',
                __parentId: 'gid://shopify/Product/5933007536288',
            },
            {
                id: 'gid://shopify/ProductImage/21051098693792',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3_4ebf85c3-7ce0-41ca-b7da-2c722f624ac6.jpg?v=1610472515',
                __parentId: 'gid://shopify/Product/5933007536288',
            },
            {
                id: 'gid://shopify/ProductImage/21051098562720',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-4_7c757bc2-a9fe-4fd2-ab32-ecf8c33b0646.jpg?v=1610472515',
                __parentId: 'gid://shopify/Product/5933007536288',
            },
        ],
    },
    {
        id: 'gid://shopify/Product/5933007765664',
        title: 'Classic Varsity Top',
        vendor: 'Liam Fashions',
        productType: '',
        handle: 'classic-varsity-top',

        productImages: [
            {
                id: 'gid://shopify/ProductImage/20771197059232',
                originalSrc:
                    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/casual-fashion-woman_925x_400a5af0-2457-49d9-9ef2-029a9850d738.jpg?v=1608301947',
                __parentId: 'gid://shopify/Product/5933007765664',
            },
        ],
    },
];

let templateValue = '[product_title] [product_vendor] [shop_name] `+${fii}+` ';
const shopName = 'ArabyCode';

const res = dataArray.map((product, index) => {
    let template = templateValue.replace(/\[shop_name\]/gi, shopName);
    template = template.replace(/\[product_title\]/gi, product.title);
    template = template.replace(/\[product_vendor\]/g, product.vendor);
    template = template.replace(/\[product_type\]/gi, product.productType);
    template = template.replace(/\[product_handle\]/gi, product.handle);

    template = template.substring(0, 490);

    return (
        `
        mutation${index}: productUpdate(input: {
            id: "${product.id}", 
            images: [
                ` +
        product.productImages.map((img) => {
            return `{id: "${img.id}", altText: "${template}"}`;
        }) +
        `
            ]
        }) {
            userErrors {
            field
            message
            }
        }
    `
    );

    +`

    `;
});

// console.table(query);
console.log(res.toString());
