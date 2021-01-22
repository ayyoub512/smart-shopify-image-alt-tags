/**
 * A component to handle un-accounted for errors; 
 * Gives the user an option, either re-auth(refresh page, and submite new tokens) or 
 * Redirect to a contact us page
 import React, { Component } from 'react'
 */

import { Page, Banner, TextStyle, Link } from "@shopify/polaris";

const ErrorsHandler = ({ message }) => {
    return (
        <Page>
            <Banner
                title='ERROR'
                action={{ content: "Contact us", onAction: () => console.log("Clicked") }}
                secondaryAction={{ content: "Re-authenticate & Refrech" }}
                status='critical'
            >
                <TextStyle variation='negative'>{message}</TextStyle>

                <p>
                    Try to
                    <Link url='https://8226650e4272.ngrok.io/?shop=arabycode.myshopify.com'></Link>
                    in case the error persist. You can report it to us and will try to resolve ASAP.
                </p>
            </Banner>
        </Page>
    );
};

export default ErrorsHandler;
