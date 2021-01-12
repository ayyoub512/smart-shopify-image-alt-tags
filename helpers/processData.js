const readline = require("readline");
const fs = require("fs");
const mutations = require("../db/myMutations");

/**
 * {string} shop is the shopOrigin arabycode.myshopify.com
 * {string} token  The access token
 * {string} jsonlFilePath  the path to the jsonl file
 * {string} templateValue the template value ex: [template_value]
 *
 *
 */

const processResultsArray = (shop, token, dataArray, templateValue, shopName) => {
    return new Promise((resolve, reject) => {
        const template = "[shop_name] [product_title] Eluxers";

        let res = [];
        const forEvery = 2;
        let index = 0;

        dataArray.forEach((item) => {
            /**
             *  Generate Muation to update the alt text to shopname
             *  code and run it for every 2 products
             */
            if (res.length <= forEvery) {
                res.push(item);
            } else {
                let mutation = dataArray.map((product) => {
                    index += 1;
                    let template = templateValue.replace(/\[shop_name\]/gi, shopName);
                    template = template.replace(/\[product_title\]/gi, product.title);
                    template = template.replace(/\[product_vendor\]/g, product.vendor);
                    template = template.replace(/\[product_type\]/gi, product.productType);
                    template = template.replace(/\[product_handle\]/gi, product.handle);

                    template = template.substring(0, 490);
                    // https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp
                    template = template.replace(/[^\w\s:\.,]/gi, "");

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
                });

                // make an api request to perform  the mutation
                mutation = `mutation {${mutation}}`;
                mutations
                    .altTextMutation(shop, token, mutation)
                    .then((data) => {
                        resolve(true);
                    })
                    .catch((err) => reject(err));

                res = [];
            }
        });

        resolve(true);
    });
};

const processFile = (jsonlFilePath) => {
    return new Promise((resolve, reject) => {
        let res = [];

        const readInterface = readline.createInterface({
            input: fs.createReadStream(jsonlFilePath),
            console: false,
        });

        readInterface.on("line", (line) => {
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
