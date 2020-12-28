import { useContext } from 'react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

/** Database Imports */
import dbConnect from '../utils/dbConnect';
import Store from '../models/Store';
// import Shop from '../models/Shop';
const { getToken } = require('../utils/accessToken');

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = ({ token }) => {
    const app = useContext(Context);

    const redirectToProduct = () => {
        /**
         * More on context api here
         * https://shopify.dev/tools/app-bridge/react-components/provider
         */

        // app.getState().then((state) => console.log(state));
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.APP, '/processing');
    };

    return (
        <Page>
            <Layout>
                <EmptyState
                    heading='First time here? no worries'
                    action={{
                        content: "Let's GO",
                        onAction: () => {
                            redirectToProduct();
                        },
                    }}
                    image={img}
                >
                    <p>
                        token: {token}
                        convince me text goes here with multple lines explaining things user should
                        do.
                    </p>
                </EmptyState>
            </Layout>
        </Page>
    );
};

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps(ctx) {
    // const token = getToken();
    // console.log('Access Token', token);

    // await dbConnect();
    // console.log(ctx.req.headers.cookie);

    /* find all the data in our database */
    // const result = await Store.find({});

    // const newStore = new Store({ store: 'hi', accessToken: 'myToken' });
    // const data = await newStore.save();

    // console.log(data);

    return { props: {} };
}

export default Index;
