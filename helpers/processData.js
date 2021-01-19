const readline = require("readline");
const fs = require("fs");

const axios = require("axios");
const Bottleneck = require("bottleneck");

const mutations = require("../db/myMutations");
const { templValueHandler } = require("./generalFuncs");

async function prepareAndUpdateProduct(shop, accessToken, mutation) {
    try {
        const axiosConfig = {
            url: "https://" + shop + "/admin/api/2021-01/graphql.json",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                query: mutation,
            },
        };

        return axios(axiosConfig);
    } catch (e) {
        return e.message ?? e;
    }
}

async function processProductsArray(shop, accessToken, dataArray, templateValue, shopName) {
    try {
        const limiter = new Bottleneck({
            reservoir: 70, // initial value
            reservoirIncreaseAmount: 5,
            reservoirIncreaseInterval: 1000, // must be divisible by 250
            reservoirIncreaseMaximum: 70,
        });

        const allTasks = dataArray.map((product) => {
            let template = templValueHandler(
                templateValue,
                shopName,
                product.title,
                product.vendor,
                product.productType,
                product.handle
            );

            const itemMutation =
                `mutation {
                    productUpdate(input: {
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
            }
            
                `;

            return limiter
                .schedule(() => {
                    return prepareAndUpdateProduct(shop, accessToken, itemMutation);
                })
                .then((data) => {
                    // // console.log("\n\n data >", data);
                    // console.log("\n\n\n\n\n\n\n\n\n data >", data?.data);
                    // console.log(itemMutation);
                    // console.log("throttleStatus >", data?.data?.extensions?.cost?.throttleStatus);
                    // console.log("actualQueryCost >", data?.data?.extensions?.cost?.actualQueryCost);
                })
                .catch((err) => console.log("ProcessData.Limiter.sechedul.catch.erro : ", err));
        });

        await Promise.all(allTasks);

        return limiter.done();
    } catch (err) {
        console.log("Something went wrong, ", err.message);
        return err;
    }
}

const processFile = (jsonlFilePath) => {
    let res = [];
    let countImgs = 0;

    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(jsonlFilePath),
            console: false,
        });

        readInterface.on("line", (line) => {
            try {
                const myLine = JSON.parse(line);
                const { id, __parentId, title, featuredImage, options, vendor, productType, handle } = myLine;

                // if there is no `__parentId`, this is a parent
                if (typeof __parentId === "undefined") {
                    res[id] = {
                        id,
                        title,
                        vendor,
                        productType,
                        handle,
                        productImages: [],
                    };

                    return res;
                }

                // this is a child, create its parent if necessary
                if (res[__parentId] === "undefined") {
                    res[__parentId] = {
                        id: __parentId,
                        title,
                        vendor,
                        productType,
                        handle,
                        productImages: [],
                    };
                }

                /**
                 * DOWN HERE WE MUST HAVE {id: "xx", childrens: []}
                 * so now lets check if its a product image || variant
                 *  // res[__parentId].childrens.push(myLine);
                 */

                if (id.includes("ProductVariant")) {
                    res[__parentId].productVariants.push(myLine);
                } else {
                    // It must be productImage then
                    res[__parentId].productImages.push(myLine);
                    countImgs++;
                }

                return res;
            } catch (err) {
                reject(err);
            }
        });

        readInterface.on("close", function () {
            const productsArray = Object.values(res);
            resolve([productsArray, countImgs]);
        });
    });
};

function processHookPayload(payload) {
    let shop = payload?.domain;
    let topic = payload?.topic;
    let product = payload?.payload;
    let images = product?.images;

    if (!shop || !topic || !images.length > 0) return;

    let templateValue = ""; // comes from the db
    let mutationQuery = []; /**The mutation query to update img that have been modified */
    let shopName; // comes from the db

    images.forEach((img) => {
        let alt = templateValue.replace(/\[shop_name\]/gi, shopName);
        alt = alt.replace(/\[product_title\]/gi, product.title);
        alt = alt.replace(/\[product_vendor\]/g, product.vendor);
        alt = alt.replace(/\[product_type\]/gi, product.productType);
        alt = alt.replace(/\[product_handle\]/gi, product.handle);
        alt = alt.substring(0, 490);
        alt = alt.replace(/[^\w\s:\.,]/gi, "");

        if (img.alt !== alt) {
            const productId = "gid://shopify/Product/5933007110304";
            const imgId = "gid://shopify/ProductImage/21121933901984";

            const query = `
                mutation ($productId: ${productId}, $image: { id: "${imgId}", alt: "${alt}"} ) {
                    mutation productImageUpdate($productId: ID!, $image: ImageInput!) {
                        productImageUpdate(productId: $productId, image: $image) {
                        image {
                            id
                        }
                        userErrors {
                            field
                            message
                        }
                        }
                    }
                }
            
            `;
        }
    });
}

module.exports = {
    processFile,
    processProductsArray,
};

/**
 *
 * This has freaking saved me
 * https://stackoverflow.com/questions/55460298/async-await-bottleneck-rate-limiting-using-promise-all
 *
 *
 */
