const dotenv = require("dotenv");
const Router = require("@koa/router");
const { receiveWebhook } = require("@shopify/koa-shopify-webhooks");

const hooksHandler = require("../helpers/hooksHandler");

dotenv.config();

const { SHOPIFY_API_SECRET_KEY } = process.env;
const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

const hooksRouter = new Router();

hooksRouter.post("/webhooks/products/create", webhook, (ctx) => {
    console.log("[+] WEBHOOK RECEIVED! - /webhooks/products/create");
    hooksHandler.productUpdated(ctx.state.webhook, false);
});

hooksRouter.post("/webhooks/products/update", webhook, (ctx) => {
    console.log("[+] WEBHOOK RECEIVED! - /webhooks/products/update");
    hooksHandler.productUpdated(ctx.state.webhook);
});

module.exports = { hooksRouter: hooksRouter };
