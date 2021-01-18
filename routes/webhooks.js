const Router = require("@koa/router");
const { receiveWebhook } = require("@shopify/koa-shopify-webhooks");

const { SHOPIFY_API_SECRET_KEY } = process.env;

const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

Router.post("/webhooks/products/create", webhook, (ctx) => {
    console.log("[+] WEBHOOK RECEIVED! - /webhooks/products/create");

    hooksHandler.productUpdated(ctx.state.webhook, false);
});

Router.post("/webhooks/products/update", webhook, (ctx) => {
    console.log("[+] WEBHOOK RECEIVED! - /webhooks/products/update");
    hooksHandler.productUpdated(ctx.state.webhook);
});

module.exports = { router };
