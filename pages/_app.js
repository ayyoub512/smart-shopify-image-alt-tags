import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <React.Fragment>
                <Head>
                    <title>ALT TEXT</title>
                    <meta charSet='utf-8' />
                </Head>

                {/**Following: https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react
                 * /build-your-user-interface-with-polaris**/}
                <AppProvider i18n={translations}>
                    <Component {...pageProps} />
                </AppProvider>
            </React.Fragment>
        );
    }
}

export default MyApp;
