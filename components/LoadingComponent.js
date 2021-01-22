import { Loading } from "@shopify/app-bridge-react";
import { Card, Page, SkeletonBodyText, SkeletonDisplayText, Spinner } from "@shopify/polaris";

/**
 * @description Provides a loading component
 */
const LoadingComponent = ({ processing }) => {
    return (
        <Page>
            <Loading />
            <SkeletonDisplayText size='medium' />
            <SkeletonBodyText />
            <SkeletonDisplayText size='small' />
            {/* <Card title='Please wait...' sectioned>
                <center>We're processing your request...</center> <br />
                <center>
                    <Spinner accessibilityLabel='Small spinner example' size='small' color='teal' />
                </center>
            </Card> */}
        </Page>
    );
};

export default LoadingComponent;
