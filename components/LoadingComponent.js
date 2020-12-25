import { Loading } from '@shopify/app-bridge-react';
import { Card, Page, Spinner } from '@shopify/polaris';

const LoadingComponent = (props) => {
    return (
        <Page>
            <Loading />

            <Card title='Please wait...' sectioned>
                <div>
                    <center>
                        <Spinner
                            accessibilityLabel='Small spinner example'
                            size='small'
                            color='teal'
                        />
                    </center>
                    <center>We're talking with the Shopify backend, please wait.</center>
                </div>
            </Card>
        </Page>
    );
};

export default LoadingComponent;
