require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

// Webhooks
const Router = require("@koa/router");

const bodyParser = require("koa-bodyparser");

const { hooksRouter } = require("./routes/webhooks");
const { apiRouter } = require("./routes/api");

const { registerWebhook } = require("@shopify/koa-shopify-webhooks");

const path = require("path");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const getSubscriptionUrl = require("./server/getSubscriptionUrl");

dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

/** DEFININE OUR GOLABAL PATH */
global.appRoot = path.resolve(__dirname);

/**
 * Connecting to the database
 * */
const shopModel = require("./db/shops");
const { Console } = require("console");

var dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log("> Connected to mysql server");
});
global.db = dbConn;

/**
 * https://github.com/devwiz73/shopify-app-boilerplate/blob/master/server.js
 * app.context is the prototype from which ctx is created.
 * You may add additional properties to ctx by editing app.context.
 */

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;
console.log("SERVER.JS: HOST", HOST);

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.context.db = dbConn;
    server.use(session({ secure: true, sameSite: "none" }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ["read_products", "write_products", "read_assigned_fulfillment_orders"],
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;

                shopModel.addShop(shop, accessToken);

                const token = jwt.sign({ shopOrigin: shop }, process.env.JWT_SECRET);

                // ctx.cookies.set("alt-text-app", token, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: "none",
                // });

                ctx.cookies.set("shopOrigin", shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                });

                const productCreateRegis = await registerWebhook({
                    address: `${HOST}/webhooks/products/create`,
                    topic: "PRODUCTS_CREATE",
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.October19,
                });
                const productUpdateRegis = await registerWebhook({
                    address: `${HOST}/webhooks/products/update`,
                    topic: "PRODUCTS_UPDATE",
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.October19,
                });

                if (productCreateRegis.success) {
                    console.log("Successfully registered PRODUCTS_CREATE webhook!");
                } else {
                    console.log("Failed to register webhook PRODUCTS_CREATE", registration.result);
                }

                if (productUpdateRegis.success) {
                    console.log("Successfully registered PRODUCTS_CREATE webhook!");
                } else {
                    console.log("Failed to register webhook PRODUCTS_CREATE", registration.result);
                }

                const isPremium = true;
                if (!isPremium) {
                    // Billing API
                    const subscriptionUrl = await getSubscriptionUrl(accessToken, shop);
                    console.log(subscriptionUrl);
                    ctx.redirect(subscriptionUrl);
                }

                ctx.redirect(`/?shop=${shop}`);
            },
        })
    ); /** END OF CUSTOM MILDDLWARE */

    server.use(bodyParser()); // Use the body parser before anything else so we can access ctx.request.body
    server.use(hooksRouter.routes());
    server.use(hooksRouter.allowedMethods());
    server.use(apiRouter.routes());
    server.use(apiRouter.allowedMethods());

    server.use(graphQLProxy({ version: ApiVersion.October19 }));

    router.get("(.*)", verifyRequest(), async (ctx) => {
        await handle(ctx.req, ctx.res);

        ctx.respond = false;
        ctx.res.statusCode = 200;
    });

    server.use(router.routes());
    server.use(router.allowedMethods());

    server.listen(port, () => {
        console.log(`> Ready on https://localhost:${port}`);
    });
});
