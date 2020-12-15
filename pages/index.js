// import { Heading, TextStyle, Page, Layout } from '@shopify/polaris';
import axios from 'axios';
import { EmptyState, Layout, Page } from '@shopify/polaris';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const index = () => (
    <div>
        <Page>
            <Layout>
                <EmptyState
                    heading='Discount your products temporarily'
                    action={{
                        content: 'Select products',
                        onAction: () => fetchProducts(),
                    }}
                    image={img}
                >
                    <p>Select products to change their price temporarily.</p>
                </EmptyState>
            </Layout>
        </Page>
    </div>
);

const fetchProducts = () => {
    console.log('products will be fetched here');
    // axios
    //     .get('/admin/api/2020-10/products.json')
    //     .then((res) => {
    //         console.log(resp.data);
    //     })
    //     .catch((err) => {
    //         // Handle Error Here
    //         console.error(err);
    //     });
    ///admin/api/2020-10/products.json
};

export default index;
