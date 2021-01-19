const Router = require("@koa/router");
const { verifyRequest } = require("@shopify/koa-shopify-auth");

const fs = require("fs");

const shops = require("../db/shops");
const status = require("../db/status");

const getBulkData = require("../helpers/getBulkData");
const processData = require("../helpers/processData");

const router = new Router();

router.post("/api", verifyRequest(), async (ctx) => {
    ctx.response.status = 200;

    let numProductProcessed = null;
    let numImgsProcessed = null;
    let operationStatus = 1;
    let jsonlFilePath = null;
    let templateValue = null;
    let shopId = null;
    let shop = null;

    try {
        /**
         * No need to to do anything since we are using verifyRequest();
         */
        console.log("[+] Received your request");

        let operationStatus = 1;
        const accessToken = ctx.session.accessToken;
        shop = ctx.session.shop;
        templateValue = ctx.request.body?.templateValue;

        if (!templateValue || !shop || !accessToken) {
            console.log("400 Bad Request");
            throw new Error("400 Bad Request");
        }
        console.log(" > Starting operation for ", shop);

        const shopData = await shops.findShopByName(shop);

        const shopName = shopData.shopName;
        shopId = shopData.id;

        await getBulkData.initBulkRequest(shop, accessToken);
        const jsonlURL = await getBulkData.bulkStatusQuery(shop, accessToken);

        jsonlFilePath = await getBulkData.downloadJSONL(jsonlURL);
        let [productsArray, countImgs] = await processData.processFile(jsonlFilePath);
        numImgsProcessed = countImgs;
        numProductProcessed = await processData.processProductsArray(
            shop,
            accessToken,
            productsArray,
            templateValue,
            shopName
        );

        console.log(shop, ": Done 😉, status data ➡️ " + numProductProcessed);
    } catch (err) {
        ctx.response.status = 400;
        console.log("Error ", err);
        operationStatus = -1;
    } finally {
        try {
            ctx.response.body =
                operationStatus == 1
                    ? {
                          error: false,
                          message: `We've updated ${numImgsProcessed} Images from ${numProductProcessed} Products`,
                      }
                    : { error: true, message: "Something wennt wrong, please try again!" };

            // REMOVING THE JSONL FILE IF IT EXISTS
            if (fs.existsSync(jsonlFilePath)) {
                //file exists, let remove it.
                fs.unlinkSync(jsonlFilePath); //
            }

            // UPDATE THE DATABASE WITH THE CURRENT ALT VALUE
            // const statusData = await status.setStatus(
            //     shopId,
            //     operationStatus,
            //     templateValue,
            //     productsProcessed,
            //     imgsProcessed
            // );

            // const util = require("util");
            // console.log("Updated!!");
            // console.log(util.inspect(statusData, { showHidden: false, depth: null }));
        } catch (err) {
            console.error("Something went wrong while removing the file " + jsonlFilePath + " \n\n", err);
        }
    }
});

module.exports = { apiRouter: router };

/**
 * 
 * 
 * 
 * 
 *
//     .then((data) => {
//         let [productsArray, countImgs] = data;
//         imgsProcessed = countImgs;
//         console.log("Counted, ", countImgs);
//         productsProcessed = productsArray.length;

//         return processData.processProductsArray(shop, accessToken, productsArray, templateValue, shopName);
//     })

//     .then((completedMutationsCount) => {
//         // Lets update the status table with the recent value!
//         // res.json({ msg: "Bad request, Please re-authenticate!", error: true });
//         operationStatus = 1;
//     })

//     .catch((err) => {
//         console.log(err);
//         operationStatus = -1;
//         reject(err);
//     })

//     .finally(async () => {
//         productsProcessed;
//         imgsProcessed;
//         try {
//             if (shopId) {
//                 await status.setStatus(
//                     shopId,
//                     operationStatus,
//                     templateValue,
//                     productsProcessed,
//                     imgsProcessed
//                 );
//             }

//             // DELETING THE FILE
//             if (jsonlFilePath) await fs.unlinkSync(jsonlFilePath);
//         } catch (err) {
//             console.log(err);
//         }
//     });
/**
 *
 *
 *
 *
 */
