const util = require("util");
const status = require("../db/status");

function productUpdated(payload, isUpdated = true) {
    console.log("Iam herre");

    let res = [];
    const shop = payload.domain;

    // console.log(util.inspect(payload, { showHidden: false, depth: null }));
}

module.exports = {
    productUpdated,
};

const a = {
    topic: "PRODUCTS_UPDATE",
    domain: "arabycode.myshopify.com",
    payload: {
        id: 5933007110304,
        title: "Among us",
        body_html:
            "<p>Classic mens plaid flannel shirt with long sleeves, in chequered style, with two chest pockets.</p>",
        vendor: "Liam Fashions",
        product_type: "shirts",
        created_at: "2020-12-18T09:31:59-05:00",
        handle: "chequered-red-shirt",
        updated_at: "2021-01-17T16:33:41-05:00",
        published_at: "2020-12-18T09:31:58-05:00",
        template_suffix: "",
        status: "active",
        published_scope: "web",
        tags: "men",
        admin_graphql_api_id: "gid://shopify/Product/5933007110304",

        images: [
            {
                id: 21121933901984,
                product_id: 5933007110304,
                position: 1,
                created_at: "2021-01-17T16:20:44-05:00",
                updated_at: "2021-01-17T16:27:55-05:00",
                alt: null,
                width: 1140,
                height: 1140,
                src:
                    "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/3_bbf5e634-0bbb-4063-879b-bfd0b0677525.jpg?v=1610918875",
                variant_ids: [37496426004640],
                admin_graphql_api_id: "gid://shopify/ProductImage/21121933901984",
            },
            {
                id: 21121933967520,
                product_id: 5933007110304,
                position: 2,
                created_at: "2021-01-17T16:20:45-05:00",
                updated_at: "2021-01-17T16:27:55-05:00",
                alt: null,
                width: 1140,
                height: 1140,
                src:
                    "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/4_8e76f9ea-a75f-4823-aa3c-aa2e2f7a8c34.jpg?v=1610918875",
                variant_ids: [],
                admin_graphql_api_id: "gid://shopify/ProductImage/21121933967520",
            },
            {
                id: 21121933934752,
                product_id: 5933007110304,
                position: 3,
                created_at: "2021-01-17T16:20:45-05:00",
                updated_at: "2021-01-17T16:27:55-05:00",
                alt: null,
                width: 1140,
                height: 1140,
                src:
                    "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/5_6a85b754-f4c1-49bf-80d7-0b1487c32fc3.jpg?v=1610918875",
                variant_ids: [],
                admin_graphql_api_id: "gid://shopify/ProductImage/21121933934752",
            },
        ],
    },
};
