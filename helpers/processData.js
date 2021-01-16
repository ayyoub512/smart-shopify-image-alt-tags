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

const processResultsArray = async (shop, accessToken, dataArray, templateValue, shopName) => {
    try {
        let index = 0; // used for mutation names

        const limiter = new Bottleneck({
            // reservoir: 90, // initial amount
            // reservoirRefreshAmount: 2,
            // reservoirRefreshInterval: 1000,

            reservoir: 80, // initial value
            reservoirIncreaseAmount: 4,
            reservoirIncreaseInterval: 1000, // must be divisible by 250
            reservoirIncreaseMaximum: 90,

            // also use maxConcurrent and/or minTime for safety
            // minTime: 250, // pick a value that makes sense for your use case
        });

        // let interval = setInterval(() => {
        //     // Every second, increment the reservoir by 2, up to a maximum of 40
        //     limiter.currentReservoir().then((reservoir) => {
        //         var incrBy = Math.min(2, 40 - reservoir);
        //         if (incrBy > 0) {
        //             return limiter.incrementReservoir(incrBy);
        //         }
        //     });
        // }, 1000);

        const allTasks = dataArray.map((product) => {
            let template = templateValue.replace(/\[shop_name\]/gi, shopName);
            template = template.replace(/\[product_title\]/gi, product.title);
            template = template.replace(/\[product_vendor\]/g, product.vendor);
            template = template.replace(/\[product_type\]/gi, product.productType);
            template = template.replace(/\[product_handle\]/gi, product.handle);
            index++;

            template = template.substring(0, 490);
            // https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp
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

            return limiter.schedule(() => {
                return prepareAndUpdateProduct(shop, accessToken, itemMutation)
                    .then((data) => {
                        console.log("\n\n data >", data?.data?.data);
                        console.log("throttleStatus >", data?.data?.extensions?.cost?.throttleStatus);
                        console.log("actualQueryCost >", data?.data?.extensions?.cost?.actualQueryCost);
                    })
                    .catch((err) => console.log(err));
            });
        });

        await Promise.all(allTasks);
    } catch (err) {
        console.log("Something went wrong, ", err.message);
    }
};

const processFile = (jsonlFilePath) => {
    return new Promise((resolve, reject) => {
        let res = [];

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
                }

                return res;
            } catch (err) {
                reject("");
            }
        });

        readInterface.on("close", function () {
            const resultsArray = Object.values(res);
            resolve(resultsArray);
        });
    });
};

module.exports = {
    processFile,
    processResultsArray,
};

/**
 *
 * This has freaking saved me
 * https://stackoverflow.com/questions/55460298/async-await-bottleneck-rate-limiting-using-promise-all
 *
 *
 */
