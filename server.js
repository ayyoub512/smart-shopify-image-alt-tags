require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const path = require('path');

const mysql = require('mysql');

const jwt = require('jsonwebtoken');

/***
 * the end of
 * imports
 */

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

/** DEFININE OUR GOLABAL PATH */
global.appRoot = path.resolve(__dirname);

/**
 * Connecting to the database
 * */

var dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log('> Connected to mysql server');
});
global.db = dbConn;

/***
 * END OF CONNECTING TO THE DATABASE
 */

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
    const server = new Koa();
    server.context.db = dbConn;
    /**
     * https://github.com/devwiz73/shopify-app-boilerplate/blob/master/server.js
     * app.context is the prototype from which ctx is created.
     * You may add additional properties to ctx by editing app.context.
     */

    server.use(session({ secure: true, sameSite: 'none' }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'write_products', 'read_assigned_fulfillment_orders'],

            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;

                const shopModel = require('./models/shops');
                shopModel.addShop(shop, accessToken);

                console.log('> Authenticated+Saved : ' + shop + ' -token- ' + accessToken);

                /***
                 * JWT
                 */
                const token = jwt.sign({ shop_origin: shop, access_token: accessToken }, process.env.JWT_SECRET);
                ctx.cookies.set('x-auth-token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });

                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none',
                });

                ctx.redirect(`/?shop=${shop}`);
            },
        })
    ); /** END OF CUSTOM MILDDLWARE */

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
