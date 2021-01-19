const readline = require("readline");
const fs = require("fs");

const { templValueHandler, botlneckMutations } = require("./generalFuncs");

async function processProductsArray(shop, accessToken, dataArray, templateValue, shopName) {
    try {
        const mutations = dataArray.map((product) => {
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

            return itemMutation;
        });

        const processedProducts = await botlneckMutations(shop, accessToken, mutations);

        return processedProducts;
    } catch (err) {
        console.log("Error ", err);
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
