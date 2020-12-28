import { useContext } from 'react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

/** Database Imports */
import store from '../models/Store';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = ({ store }) => {
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
                        token: {store}
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
    const shop = ctx.query.shop;
    if (!shop) throw 'No Shop error';

    const data = await store.findOne({ store: shop });

    return { props: { store: shop } };
}

export default Index;
