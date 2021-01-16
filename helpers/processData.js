const readline = require("readline");
const fs = require("fs");
const mutations = require("../db/myMutations");
import axios from "axios";
import Bottleneck from "bottleneck";

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
            let template = templateValue.replace(/\[shop_name\]/gi, shopName);
            template = template.replace(/\[product_title\]/gi, product.title);
            template = template.replace(/\[product_vendor\]/g, product.vendor);
            template = template.replace(/\[product_type\]/gi, product.productType);
            template = template.replace(/\[product_handle\]/gi, product.handle);
            template = template.substring(0, 490);
            template = template.replace(/[^\w\s:\.,]/gi, "");

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
                        featuredImage: featuredImage ?? {},
                        options: options ?? [],
                        productVariants: [],
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
                        featuredImage: featuredImage ?? {},
                        options: options ?? [],
                        productVariants: [],
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
