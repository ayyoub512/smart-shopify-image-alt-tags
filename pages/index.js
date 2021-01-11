import React from 'react';
import axios from 'axios';

import AltTextForm from '../components/AltTextForm';
import { findShopByName, updateFields } from '../db/shops';
import { GET_IMGS_QUERY } from '../db/queries';
import ErrorsHandler from '../components/ErrorsHandler';
import { parseCookies } from '../helpers/parseCookies';
import { randomNumber } from '../helpers/randomNum';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
    constructor(props) {
        super(props);

        // const product = props.products

        this.state = {
            product: props.product,
            shopName: props.shopName,
            isError: props.isError,
        };
    }

    render() {
        if (!this.state.isError) return <AltTextForm product={this.state.product} shopName={this.state.shopName} />;
        else return <ErrorsHandler />;
    }
}

/*
 * ON SERVER DO THIS
 * 1 - see if cookies has shop origin, else Error=true
 * 2 - findShopByName & if email hasn't been inserted yet, insert it
 * 3 - Get 1 product and send it to component as a prop from the last intered 10.
 */
export async function getServerSideProps(ctx) {
    const cookies = parseCookies(ctx.req); // Getting the  shopOrigin cookie

    const shop = cookies.shopOrigin;
    let product; // gets retreived from the db later
    let shopName; // gets retreived from the db later
    let isError = false;

    if (!shop) {
        isError = true;
    } else {
        try {
            /**
             * @fsd means findShopData
             */
            const findShopData = await findShopByName(shop);
            const fsd_email = findShopData.email;
            const fsd_contactEmail = findShopData.contactEmail;

            const url = 'https://' + shop + '/admin/api/2021-01/graphql.json';
            const accessToken = findShopData.access_token.toString();

            const result = await axios({
                url: url,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken,
                },
                data: {
                    query: GET_IMGS_QUERY,
                },
            });

            /** OPTIONAL CHAINING ?.
             * : https://javascript.info/optional-chaining
             */
            const nodes = result?.data?.data?.products?.edges;

            if (nodes) {
                const email = result.data.data?.shop?.email;
                const contactEmail = result.data.data?.shop?.contactEmail;
                shopName = result.data.data?.shop?.name;

                /** INSERTING/UPDATING THE EMAIL ADDRESSES, contactEmail: is the support email */
                if (email !== fsd_email || contactEmail !== fsd_contactEmail)
                    await updateFields(shop, email, contactEmail, shopName);

                const products = nodes.map((product) => {
                    const title = product.node.title.toString();
                    const handle = product.node.handle.toString();
                    const vendor = product.node.vendor.toString();
                    const productType = product.node.productType.toString();
                    const featuredImgSrc = product.node?.featuredImage?.originalSrc;

                    if (title && handle && featuredImgSrc && (vendor || productType)) {
                        return product;
                    }
                });

                // TODO: pick up one product
                if (products.length > 0) {
                    // Pick a random object
                    const index = randomNumber(0, products.length - 1);

                    product = products[index];
                }
            }
        } catch (err) {
            console.log(err);
            isError = true;
        }
    }

    return {
        props: {
            product: {},
            shopName: '',
            isError,
        },
    };
}

export default Index;
