require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const Router = require('koa-router');
const router = new Router();

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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
            afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                console.log(accessToken);

                console.log('Hi from afterAuth method accessToken is will follow me');
                console.log('accessToken ', accessToken);
                ctx.cookies.set('accessToken', accessToken); // Setting our access token
                // ctx.cookies.set('shop', shop); // Setting our access token

                ctx.redirect('/');
            },
        })
    );

    server.use(verifyRequest());

    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});

router.get('/api/products', async (ctx) => {
    /**
     * @LINK https://community.shopify.com/c/Shopify-APIs-SDKs/Problem-Querying-REST-API-from-React-Node/m-p/509542#M33091
     */
    console.log('I am inside server /api/product end point');

    try {
        const results = await fetch(
            'https://' + ctx.cookies.get('shopOrigin') + '/admin/api/2020-10/products.json',
            {
                headers: {
                    'X-Shopify-Access-Token': ctx.cookies.get('accessToken'),
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {
                return json;
            });
        ctx.body = {
            status: 'success',
            data: results,
        };
    } catch (err) {
        console.log(err);
    }
});
