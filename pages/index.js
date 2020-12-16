// import { Heading, TextStyle, Page, Layout } from '@shopify/polaris';
import axios from 'axios';
import { EmptyState, Layout, Page } from '@shopify/polaris';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const index = (props) => (
    <div>
        <Page>
            <Layout>
                <EmptyState
                    heading='Level up your CEO game'
                    action={{
                        content: 'GO ON',
                        onAction: () => fetchProducts(),
                    }}
                    image={img}
                >
                    <p>
                        Change the ALT tag value on all you pre-existing products & new ones with
                        one click
                    </p>
                </EmptyState>
            </Layout>
        </Page>
    </div>
);

const fetchProducts = () => {};

export async function getServerSideProps(ctx) {
    // console.log('products will be fetched here');
    // var fetchUrl = '/api/products';
    // var method = 'GET';
    // fetch('http://localhost:300/api/products', { method: method })
    //     .then((response) => console.log(response))
    //     .then((json) => console.log(json));

    console.log('Fetching data');

    try {
        const results = await fetch(
            'https://arabycode.myshopify.com/admin/api/2020-10/products.json',
            {
                headers: {
                    'X-Shopify-Access-Token': 'YOUR_SHOPIFY_TOKEN',
                },
            }
        )
            .then((response) => console.log(response))
            .then((json) => {
                console.log(json);
            });
        ctx.body = {
            status: 'success',
            data: results,
        };
    } catch (err) {
        console.log(err);
    }

    return {
        props: {}, // will be passed to the page component as props
    };
}

export default index;
