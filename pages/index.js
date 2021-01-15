import React from "react";
import axios from "axios";

import shops from "../db/shops";
import { randomNumber } from "../helpers/randomNum";

import { GET_IMGS_QUERY } from "../db/queries";
import AltTextForm from "../components/AltTextForm";
import ErrorsHandler from "../components/ErrorsHandler";
import Working from "../components/Working";

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: props.product,
            status: props.status,
            shopName: props.shopName,
            isError: props.isError,
        };
    }

    render() {
        if (!this.state.isError && this.state.status == 0)
            return <AltTextForm product={this.state.product} shopName={this.state.shopName} />;
        else if (this.state.status == 2) return <Working />;
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
    const shop = ctx.query.shop;
    let product; // gets retreived from the db later
    let shopName; // gets retreived from the db later
    let isError = false;
    let templateValue;
    let status = 0; // by default status = 0, first time.

    try {
        if (!shop) throw new Error("Something went wrong");

        /**
         * @fsd means findShopData
         */
        const findShopData = await shops.findShopByName(shop);
        const fsd_email = findShopData.email;
        const fsd_contactEmail = findShopData.contactEmail;
        const accessToken = findShopData.access_token;
        status = findShopData.status;
        templateValue = findShopData.template_value;

        /// When status code = 0, means first time
        if (status == 0) {
            const url = "https://" + shop + "/admin/api/2021-01/graphql.json";

            const result = await axios({
                url: url,
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken,
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
                    await shops.updateFields(shop, email, contactEmail, shopName);

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
        } // end of if status == 0
    } catch (err) {
        console.log(err);
        isError = true;
    }

    return {
        props: {
            product: product ?? {},
            shopName: "",
            templateValue: templateValue ?? null,
            status,
            isError,
        },
    };
}

export default Index;
