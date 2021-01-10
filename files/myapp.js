const readline = require('readline');
const fs = require('fs');

let res = {};

function processLine(line) {
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
}

const readInterface = readline.createInterface({
    input: fs.createReadStream('data.jsonl'),
    // output: process.stdout,
    console: false,
});

readInterface.on('line', processLine);

readInterface.on('close', function () {
    const resultArray = Object.values(res);
    console.log(resultArray.length);
});
