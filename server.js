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
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const getSubscriptionUrl = require("./server/getSubscriptionUrl");
const { Shop } = require("./models/shopModel");

dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

/** DEFININE OUR GOLABAL PATH */
global.appRoot = path.resolve(__dirname);
global.Shop = Shop;

/**
 * Connecting to the database
 * */
// const shopModel = require("./db/shops");
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((e) => {
        console.log("\n\n[+] DB Connected");

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

            server.use(session({ secure: true, sameSite: "none" }, server));
            server.keys = [SHOPIFY_API_SECRET_KEY];

            server.use(
                createShopifyAuth({
                    apiKey: SHOPIFY_API_KEY,
                    secret: SHOPIFY_API_SECRET_KEY,
                    scopes: ["read_products", "write_products", "read_assigned_fulfillment_orders", "read_orders"],
                    async afterAuth(ctx) {
                        const { shop: shopOrigin, accessToken } = ctx.session;

                        console.log("Shop and token", shopOrigin, accessToken);

                        // shopModel.addShop(shop, accessToken);
                        try {
                            // const shop = new Shop({
                            //     shopOrigin,
                            //     accessToken,
                            // });

                            const updateResp = await Shop.findOneAndUpdate(
                                { shopOrigin },
                                { shopOrigin, accessToken },
                                { upsert: true }
                            );

                            console.log("The updated shop:", updateResp);
                            // await shop.save();
                        } catch (err) {
                            console.log("[+] Something went wrong while saving ", shopOrigin, "\n\n", err);
                        }
                        // const token = jwt.sign({ shopOrigin: shop }, process.env.JWT_SECRET);
                        // ctx.cookies.set("alt-text-app", token, {
                        //     httpOnly: true,
                        //     secure: true,
                        //     sameSite: "none",
                        // });

                        console.log("The shop is: ", shopOrigin);
                        console.log("The token is: ", accessToken);

                        ctx.cookies.set("shopOrigin", shopOrigin, {
                            httpOnly: false,
                            secure: true,
                            sameSite: "none",
                        });

                        // const productCreateRegis = await registerWebhook({
                        //     address: `${HOST}/webhooks/products/create`,
                        //     topic: "PRODUCTS_CREATE",
                        //     accessToken,
                        //     shopOrigin,
                        //     apiVersion: ApiVersion.October19,
                        // });
                        // const productUpdateRegis = await registerWebhook({
                        //     address: `${HOST}/webhooks/products/update`,
                        //     topic: "PRODUCTS_UPDATE",
                        //     accessToken,
                        //     shopOrigin,
                        //     apiVersion: ApiVersion.October19,
                        // });

                        // if (productCreateRegis.success) console.log("Successfully registered PRODUCTS_CREATE webhook!");
                        // else console.log("Failed to register webhook PRODUCTS_CREATE", productCreateRegis.result);

                        // if (productUpdateRegis.success) console.log("Successfully registered PRODUCTS_CREATE webhook!");
                        // else console.log("Failed to register webhook PRODUCTS_CREATE", productUpdateRegis.result);

                        // const isPremium = true;
                        // if (!isPremium) {
                        //     // Billing API
                        //     const subscriptionUrl = await getSubscriptionUrl(accessToken, shopOrigin);
                        //     console.log(subscriptionUrl);
                        //     ctx.redirect(subscriptionUrl);
                        // }

                        ctx.redirect(`/?shop=${shopOrigin}`);
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
    })
    .catch((e) => {
        console.log("\n\n[-]Error connected to db: ", e);
    });
