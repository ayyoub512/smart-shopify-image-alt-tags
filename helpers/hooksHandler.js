/**
 * receives product update and product create web hook
 * check if the current alt tag on the updated/created
 * product value is the same as the templateValue stored
 * the database;
 *
 * @params
 * 1 : handle in case we don't have any stored current
 *      alt values (First time user runs the app,
 *      and happend the UPDATE/CREATE a product )
 *
 */

const util = require("util");
const status = require("../db/status");
const shops = require("../db/shops");
const { templValueHandler, botlneckMutations } = require("./generalFuncs");

// console.log(util.inspect(myObject, {showHidden: false, depth: null}))
// isUpdated = false: meaning the product was created not updated!
async function productUpdated(payload, isUpdated = true) {
    try {
        let toUpdate = false; // when true. means there are iamges that do need to be update.
        const mutations = []; // hold imgs may need to be updated
        const imgs = payload.payload.images;
        if (!imgs.length > 0) return null; // no images, this product is brand new so lets not care about it

        const shopOrigin = payload.domain;
        const foundShop = await shops.findShopByName(shopOrigin);
        const accessToken = foundShop.accessToken;

        if (!foundShop || !foundShop?.id) {
            console.log("We haven't found any matching shops, lets ignore it ");
            return null;
        }

        const shopId = foundShop.id;
        const statusData = await status.getLastStatus(shopOrigin);

        if (!statusData || !statusData?.templateValue) {
            console.log("This shop no data whatsoever an is new, so just ignore it for now!");
            return null;
        }

        const shopName = foundShop?.shopName; // from db
        const title = payload.payload.title;
        const vendor = payload.payload.vendor;
        const productType = payload.payload.product_type;
        const handle = payload.payload.handle;
        const productId = payload.payload.admin_graphql_api_id;
        const template = templValueHandler(statusData.templateValue, shopName, title, vendor, productType, handle);

        imgs.forEach((img) => {
            if (img.alt !== template) {
                const igmMutation = ` 
                    mutation {
                        productImageUpdate(productId: "${productId}", image: {id: "${img.admin_graphql_api_id}", altText: "${template}"}) {
                            image {
                                id
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;
                mutations.push(igmMutation);
                toUpdate = true;
            } //console.log("It's a match [img.alt]: " + img.alt + " === [tempalte value] : " + template);
        });

        // any image needs to be updated ?
        if (!toUpdate) return null; // if not just return

        // Write the logic the update the alt tag for the images here...
        // console.log("Updating Product id: :: ", productId);
        // const data = await botlneckMutations(shopOrigin, accessToken, mutations);
        // console.log("[+] All mutations are done, result . ", data);
    } catch (err) {
        console.log("Something went wrong while handline the webhook: ", err);
    }
}

module.exports = {
    productUpdated,
};

/**
const product = {
    topic: "PRODUCTS_UPDATE",
    domain: "arabycode.myshopify.com",
    payload: {
        id: 5933007536288,
        title: "Update Me",
        body_html: "<p>Womans zipped leather jacket. Adjustable belt for a comfortable fit, complete with shoulder pads and front zip pocket.</p>",
        vendor: "Liam Fashions",
        product_type: "",
        created_at: "2020-12-18T09:32:17-05:00",
        handle: "classic-leather-jacket",
        updated_at: "2021-01-19T15:36:46-05:00",
        published_at: "2020-12-18T09:32:16-05:00",
        template_suffix: "",
        status: "active",
        published_scope: "web",
        tags: "women",
        admin_graphql_api_id: "gid://shopify/Product/5933007536288",
        variants: [
            {
                id: 37496428200096,
                product_id: 5933007536288,
                title: "xs",
                price: "40.00",
                sku: "",
                position: 1,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "xs",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2021-01-12T12:28:39-05:00",
                taxable: true,
                barcode: null,
                grams: 290,
                image_id: 21051097809056,
                weight: 290,
                weight_unit: "g",
                inventory_item_id: 39422977638560,
                inventory_quantity: 14,
                old_inventory_quantity: 14,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428200096",
            },
            {
                id: 37496428232864,
                product_id: 5933007536288,
                title: "small",
                price: "45.00",
                sku: "",
                position: 2,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "small",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2020-12-18T09:32:17-05:00",
                taxable: true,
                barcode: null,
                grams: 485,
                image_id: null,
                weight: 485,
                weight_unit: "g",
                inventory_item_id: 39422977671328,
                inventory_quantity: 19,
                old_inventory_quantity: 19,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428232864",
            },
            {
                id: 37496428265632,
                product_id: 5933007536288,
                title: "medium",
                price: "46.00",
                sku: "",
                position: 3,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "medium",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2020-12-18T09:32:17-05:00",
                taxable: true,
                barcode: null,
                grams: 331,
                image_id: null,
                weight: 331,
                weight_unit: "g",
                inventory_item_id: 39422977704096,
                inventory_quantity: 15,
                old_inventory_quantity: 15,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428265632",
            },
            {
                id: 37496428298400,
                product_id: 5933007536288,
                title: "large",
                price: "60.00",
                sku: "",
                position: 4,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "large",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2020-12-18T09:32:17-05:00",
                taxable: true,
                barcode: null,
                grams: 471,
                image_id: null,
                weight: 471,
                weight_unit: "g",
                inventory_item_id: 39422977736864,
                inventory_quantity: 7,
                old_inventory_quantity: 7,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428298400",
            },
            {
                id: 37496428331168,
                product_id: 5933007536288,
                title: "xl",
                price: "32.00",
                sku: "",
                position: 5,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "xl",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2020-12-18T09:32:17-05:00",
                taxable: true,
                barcode: null,
                grams: 204,
                image_id: null,
                weight: 204,
                weight_unit: "g",
                inventory_item_id: 39422977769632,
                inventory_quantity: 3,
                old_inventory_quantity: 3,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428331168",
            },
            {
                id: 37496428363936,
                product_id: 5933007536288,
                title: "xxl",
                price: "41.00",
                sku: "",
                position: 6,
                inventory_policy: "continue",
                compare_at_price: null,
                fulfillment_service: "manual",
                inventory_management: "shopify",
                option1: "xxl",
                option2: null,
                option3: null,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2020-12-18T09:32:17-05:00",
                taxable: true,
                barcode: null,
                grams: 367,
                image_id: null,
                weight: 367,
                weight_unit: "g",
                inventory_item_id: 39422977802400,
                inventory_quantity: 14,
                old_inventory_quantity: 14,
                requires_shipping: true,
                admin_graphql_api_id: "gid://shopify/ProductVariant/37496428363936",
            },
        ],
        options: [
            {
                id: 7562334273696,
                product_id: 5933007536288,
                name: "Title",
                position: 1,
                values: ["xs", "small", "medium", "large", "xl", "xxl"],
            },
        ],
        images: [
            {
                id: 20771196141728,
                product_id: 5933007536288,
                position: 1,
                created_at: "2020-12-18T09:32:17-05:00",
                updated_at: "2021-01-19T15:25:56-05:00",
                alt: "dd",
                width: 925,
                height: 617,
                src: "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/leather-jacket-and-tea_925x_e917107c-d13e-4260-91a6-0ed33f12e7e1.jpg?v=1611087956",
                variant_ids: [],
                admin_graphql_api_id: "gid://shopify/ProductImage/20771196141728",
            },
            {
                id: 21051097809056,
                product_id: 5933007536288,
                position: 2,
                created_at: "2021-01-12T12:28:34-05:00",
                updated_at: "2021-01-18T16:17:13-05:00",
                alt: "Classic Leather Jacket   ",
                width: 800,
                height: 800,
                src: "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/hmm1_29106cc3-b794-46a9-a86c-cbbc3661d516.jpg?v=1611004633",
                variant_ids: [37496428200096],
                admin_graphql_api_id: "gid://shopify/ProductImage/21051097809056",
            },
            {
                id: 21051098693792,
                product_id: 5933007536288,
                position: 3,
                created_at: "2021-01-12T12:28:35-05:00",
                updated_at: "2021-01-18T16:17:13-05:00",
                alt: "Classic Leather Jacket   ",
                width: 800,
                height: 800,
                src: "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-3_4ebf85c3-7ce0-41ca-b7da-2c722f624ac6.jpg?v=1611004633",
                variant_ids: [],
                admin_graphql_api_id: "gid://shopify/ProductImage/21051098693792",
            },
            {
                id: 21051098562720,
                product_id: 5933007536288,
                position: 4,
                created_at: "2021-01-12T12:28:35-05:00",
                updated_at: "2021-01-18T16:17:13-05:00",
                alt: "Classic Leather Jacket   ",
                width: 800,
                height: 800,
                src: "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/among-us-plush-4_7c757bc2-a9fe-4fd2-ab32-ecf8c33b0646.jpg?v=1611004633",
                variant_ids: [],
                admin_graphql_api_id: "gid://shopify/ProductImage/21051098562720",
            },
        ],
        image: {
            id: 20771196141728,
            product_id: 5933007536288,
            position: 1,
            created_at: "2020-12-18T09:32:17-05:00",
            updated_at: "2021-01-19T15:25:56-05:00",
            alt: "dd",
            width: 925,
            height: 617,
            src: "https://cdn.shopify.com/s/files/1/0521/6046/3008/products/leather-jacket-and-tea_925x_e917107c-d13e-4260-91a6-0ed33f12e7e1.jpg?v=1611087956",
            variant_ids: [],
            admin_graphql_api_id: "gid://shopify/ProductImage/20771196141728",
        },
    },
};
**/
