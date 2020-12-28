require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/** DATABASE IMPORTS */
// const mongoose = require('mongoose');
let mongoose = require('./utils/dbConnect');
let store = require('./models/Store');

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
    const server = new Koa();
    server.use(session({ secure: true, sameSite: 'none' }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'write_products'],
            async afterAuth(ctx) {
                // const urlParams = new URLSearchParams(ctx.request.url);
                // const shop = urlParams.get('shop');
                const { shop, accessToken } = ctx.session;

                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none',
                });

                await store.findOneAndUpdate(
                    { store: shop },
                    { accessToken: accessToken, date: JSON.stringify(new Date()) },
                    { upsert: true }
                );

                // await dbConnect();

                // const StoreSchema = new mongoose.Schema({
                //     store: {
                //         /* The name of this pet */
                //         type: String,
                //         required: [true, 'Please provide a store.'],
                //     },
                //     accessToken: {
                //         type: String,
                //         required: [true, 'An accessToken is required.'],
                //     },
                //     date: {
                //         type: String,
                //         required: [true, 'date is required'],
                //     },
                // });

                // let Store = mongoose.models.store || mongoose.model('store', StoreSchema);

                // await Store.findOneAndUpdate(
                //     { store: shop },
                //     { accessToken: accessToken, date: JSON.stringify(new Date()) },
                //     { upsert: true }
                // );

                // mongoose.connection.close();

                ctx.redirect(`/?shop=${shop}`);
            },
        })
    );

    server.use(graphQLProxy({ version: ApiVersion.October19 }));

    server.use(verifyRequest());

    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    });

    server.listen(port, () => {
        console.log(`> Ready on https://localhost:${port}`);
    });
});
