const Router = require("@koa/router");
const { verifyRequest } = require("@shopify/koa-shopify-auth");

const fs = require("fs");
const util = require("util");

const shops = require("../db/shops");
const status = require("../db/status");

const getBulkData = require("../helpers/getBulkData");
const processData = require("../helpers/processData");
const { operationStatus: opStatus } = require("../helpers/staticVars");

const router = new Router();

router.post("/api/init", verifyRequest(), async (ctx) => {
    // set timeout to 20 minutes
    ctx.request.socket.setTimeout(20 * 60 * 1000);

    let numProductProcessed = null;
    let numImgsProcessed = null;
    let operationStatus = opStatus.IN_PROGRESS;
    let jsonlFilePath = null;
    let altFormula = null;
    let shopId = null;
    let shop = null;

    try {
        ctx.assert(ctx.request.body?.altFormula, 401, "Template was found");
        ctx.assert(ctx.session.shop, 401, "Auth token not found, please re-authenticate");
        ctx.assert(ctx.session.accessToken, 401, "Auth token not found, please re-authenticate");

        shop = ctx.session.shop;
        const accessToken = ctx.session.accessToken;
        altFormula = ctx.request.body?.altFormula;

        console.log("[+] Starting operation for ", shop);

        const shopData = await shops.findShopByName(shop);
        const shopName = shopData.shopName;

        try {
            await status.setStatus(shop, operationStatus, altFormula);
            console.log("> shopOrigin ", shop, "status set to 2");
        } catch (err) {
            console.log("Something went wrong while updating the status, details: " + err);
        }

        await getBulkData.initBulkRequest(shop, accessToken);
        const jsonlURL = await getBulkData.bulkStatusQuery(shop, accessToken);

        jsonlFilePath = await getBulkData.downloadJSONL(jsonlURL);
        let [productsArray, countImgs] = await processData.processFile(jsonlFilePath);
        numImgsProcessed = countImgs;
        numProductProcessed = await processData.processProductsArray(shop, accessToken, productsArray, altFormula, shopName);

        operationStatus = opStatus.SUCCEEDED;
        console.log(shop, "Mutation done, productsProcessed: ➡️ " + numProductProcessed);
        ctx.response.status = 200;
    } catch (err) {
        ctx.response.status = 400;
        console.log("Error ", err);
        operationStatus = opStatus.FAILED;
    } finally {
        try {
            ctx.set("Content-Type", "application/json");
            ctx.body =
                operationStatus == opStatus.SUCCEEDED
                    ? {
                          error: false,
                          data: {
                              updatedImgs: numImgsProcessed,
                              updatedProducts: numProductProcessed,
                          },
                      }
                    : { error: true, message: "Something went wrong, please try again!" };

            // REMOVING THE JSONL FILE IF IT EXISTS
            if (fs.existsSync(jsonlFilePath)) {
                //file exists, let remove it.
                fs.unlinkSync(jsonlFilePath); //
            }

            // UPDATE THE DATABASE WITH THE CURRENT ALT VALUE
            if (operationStatus && shop && altFormula) {
                const updatedStatus = await status.setStatus(shop, operationStatus, altFormula, numProductProcessed, numImgsProcessed);

                console.log("[+] UPDATED THE DATABASE WITH THE CURRENT ALT FORMULA, STATUS...ETC");
                console.log(util.inspect(updatedStatus, { showHidden: false, depth: null }));
            }
        } catch (err) {
            console.error("Something went wrong while removing the file " + jsonlFilePath + " \n\n", err);
        }
    }
});

// RETURN THE STATUS OF THE OPERATION
router.post("/api/status", verifyRequest(), async (ctx) => {
    let error = false;
    let data;

    try {
        // ctx.assert(ctx.request.body?.altFormula, 401, "Template was found");
        ctx.assert(ctx.session.shop, 401, "Auth token not found, please re-authenticate");
        ctx.assert(ctx.session.accessToken, 401, "Auth token not found, please re-authenticate");

        const shop = ctx.session.shop;

        const shopData = await shops.findShopByName(shop);
        data = await status.getLastStatus(shopData.shopOrigin);
        // console.log(statusData);
        // data = statusData?.statusData;

        ctx.response.status = 200;
    } catch (err) {
        console.log(err);
        error = true;
        ctx.response.status = 400;
    } finally {
        const payload = {
            error,
            data,
        };

        ctx.response.body = payload;
    }
});

module.exports = { apiRouter: router };
