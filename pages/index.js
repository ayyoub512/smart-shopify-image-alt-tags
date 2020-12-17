import { EmptyState, Layout, Page } from '@shopify/polaris';
const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => (
    <div>
        <Page>
            <Layout>
                <EmptyState
                    heading="AYYOUB'S NEW HOBBY"
                    action={{
                        content: 'You can do it!',
                        onAction: () => console.log('clicked'),
                    }}
                    image={img}
                >
                    <p>Hello, World Shopify. Here is to a new hobby!</p>
                </EmptyState>
            </Layout>
        </Page>
    </div>
);

export default Index;
