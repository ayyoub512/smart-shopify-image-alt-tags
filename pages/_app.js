import React from "react";
import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ClientRouter from "../components/ClientRouter";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: new createHttpLink({
        credentials: "include",
        headers: {
            "Content-Type": "application/graphql",
        },
    }),
    cache: new InMemoryCache(),
});

class MyApp extends App {
    state = {};

    render() {
        const { Component, pageProps, shopOrigin } = this.props;

        const config = {
            apiKey: API_KEY, // has to do with next.config.js I think because I have setup that variable there as well
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
                    <ClientRouter />
                    <AppProvider newDesignLanguage={true} i18n={translations}>
                        <ApolloProvider client={client}>
                            <Component {...pageProps} />
                        </ApolloProvider>
                    </AppProvider>
                </Provider>
            </React.Fragment>
        );
    }
}

MyApp.getInitialProps = async ({ ctx }) => {
    return {
        shopOrigin: ctx.query.shop,
    };
};
export default MyApp;
