import React from 'react';
import axios from 'axios';
import AltTextForm from '../components/AltTextForm';
import { findShopByName } from '../models/shops';
import { GET_IMGS_QUERY } from '../helpers/queries';
import ErrorsHandler from '../components/ErrorsHandler';
import LoadingComponent from '../components/LoadingComponent';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shop: props.shop,
            email: props.email,
            products: props.products,
            isError: props.isError,
            isLoading: false,
        };
    }

    componentDidMount() {}

    render() {
        if (!this.state.isError) {
            return <AltTextForm />;
        } else {
            return <ErrorsHandler />;
        }
    }
}

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps(ctx) {
    let shop = '';
    let products = {};
    let isError = false;

    if (!ctx.query.shop) {
        throw '> No shop.';
        isError = true;
    } else {
        try {
            const findShopData = await findShopByName(ctx.query.shop.toString());
            const uri = findShopData.shop_origin.toString();

            if (uri) {
                // CHECK IF THE SHOP ORIGIN EXISTS
                const url = 'https://' + uri + '/admin/api/2021-01/graphql.json';
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

                const nodes = result.data.data.products.edges;
                console.log('shop Data >> ', result.data.data.shop);

                shop = result.data.data.shop.name;
                const email = result.data.data.shop.email;

                products = nodes.map((product) => {
                    // console.log('Title: ', product.node.title);
                    // console.log('Handle: ', product.node.handle);
                    // console.log('Vendor: ', product.node.vendor);
                    // console.log('Product Type: ', product.node.productType);
                    console.log('Link', product.node.featuredImage.originalSrc);

                    const title = product.node.title.toString();
                    const handle = product.node.handle.toString();
                    const vendor = product.node.vendor.toString();
                    const productType = product.node.productType.toString();

                    if (title && handle && (vendor || productType)) {
                        return product;
                    }
                });
            } else {
                isError = true;
            }
        } catch (err) {
            console.log(err);
            isError = true;
        }
    }

    console.log('typeof products');
    console.log(typeof products);
    console.log(products);

    return {
        props: {
            products,
            isError,
            shop,
        },
    };
}

export default Index;
