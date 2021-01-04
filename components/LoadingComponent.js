import { Loading } from '@shopify/app-bridge-react';
import { Card, Page, Banner, Spinner } from '@shopify/polaris';

/**
 * @description Provides a loading component
 */
const LoadingComponent = ({ processing }) => {
    return (
        <Page>
            <Loading />
            {processing ? (
                <Card title='Optimizing your images' sectioned>
                    <p>We're currently optizing your images, please wait.</p> <br />
                    <Banner title='' onDismiss={() => {}}>
                        <p>
                            You can safely close this window - we will send you an email notification when the
                            optimization is complete.
                        </p>
                    </Banner>
                    <br />
                    <center>
                        <Spinner accessibilityLabel='Small spinner example' size='small' color='teal' />
                    </center>
                </Card>
            ) : (
                <Card title='Please wait...' sectioned>
                    <center>We're processing your request...</center> <br />
                    <center>
                        <Spinner accessibilityLabel='Small spinner example' size='small' color='teal' />
                    </center>
                </Card>
            )}
        </Page>
    );
};

export default LoadingComponent;
