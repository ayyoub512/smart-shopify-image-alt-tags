const readline = require('readline');
const fs = require('fs');

/**
 * @param {string} shop is the shopOrigin arabycode.myshopify.com
 * @param {string} token  The access token
 * @param {string} jsonlFilePath  the path to the jsonl file
 * @param {string} templateValue the template value ex: [template_value]
 */

const process = (shop, token, jsonlFilePath, templateValue) => {
    return new Promise((resolve, reject) => {
        processFile(jsonlFilePath)
            .then((resultsArray) => {
                console.log(resultsArray);
                console.log('i have the results array');
                console.log(templateValue);
                console.log(token);
                console.log(shop);
            })
            .catch((err) => {
                reject(err);
            });
    }).catch((err) => {
        console.log('processData.js | process.promise.catch : ' + err);
    });
};

const processFile = (jsonlFilePath) => {
    return new Promise((resolve, reject) => {
        let res = [];

        const readInterface = readline.createInterface({
            input: fs.createReadStream(jsonlFilePath),
            console: false,
        });

        readInterface.on('line', (line) => {
            const myLine = JSON.parse(line);
            const { id, __parentId, title, featuredImage, options, vendor, productType, handle } = myLine;

            // if there is no `__parentId`, this is a parent
            if (typeof __parentId === 'undefined') {
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
            if (res[__parentId] === 'undefined') {
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

            if (id.includes('ProductVariant')) {
                res[__parentId].productVariants.push(myLine);
            } else {
                // It must be productImage then
                res[__parentId].productImages.push(myLine);
            }

            return res;
        });

        readInterface.on('close', function () {
            const resultsArray = Object.values(res);
            resolve(resultsArray);
        });
    }).catch((err) => {
        console.log('processData.js | processFile.promise.catch : ' + err);
    });
};

module.exports = {
    process,
};
