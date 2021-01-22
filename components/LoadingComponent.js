import { Loading } from "@shopify/app-bridge-react";
import { Card, SkeletonPage, SkeletonBodyText, Layout } from "@shopify/polaris";

/**
 * @description Provides a loading component
 */
const LoadingComponent = () => {
    return (
        <SkeletonPage title='Optimization Results' primaryAction secondaryActions={2}>
            <Loading />
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                    </Card>
                </Layout.Section>

                <Layout.Section oneHalf>
                    <Card sectioned>
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                    </Card>
                </Layout.Section>

                <Layout.Section oneHalf>
                    <Card sectioned title='Change Alt Template'>
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                        <SkeletonBodyText />
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
};

{
    /* <Card title='Sales channels'>
                        <Card.Section>
                            <SkeletonBodyText lines={2} />
                        </Card.Section>
                        <Card.Section>
                            <SkeletonBodyText lines={1} />
                        </Card.Section>
                    </Card> */
}
{
    /* <Card title='Organization' subdued>
                        <Card.Section>
                            <SkeletonBodyText lines={2} />
                        </Card.Section>
                        <Card.Section>
                            <SkeletonBodyText lines={2} />
                        </Card.Section>
                    </Card> */
}

export default LoadingComponent;
