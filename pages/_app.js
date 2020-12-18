import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';

class MyApp extends App {
    render() {
        const { Component, pageProps, shopOrigin } = this.props;
        const config = {
            apiKey: '9fe4f7e7b889108a337197a073cce0f8',
            shopOrigin,
            forceRedirect: true,
        };

        return (
            <React.Fragment>
                <Head>
                    <title>Sample App</title>
                    <meta charSet='utf-8' />
                </Head>
                <Provider config={config}>
                    <AppProvider i18n={translations}>
                        <Component {...pageProps} />
                    </AppProvider>
                </Provider>
            </React.Fragment>
        );
    }
}

MyApp.getInitialProps = async ({ ctx }) => {
    console.log('about to read the Shop Origin from _app.js line 29');
    return {
        shopOrigin: ctx.query.shop,
    };
};
export default MyApp;
