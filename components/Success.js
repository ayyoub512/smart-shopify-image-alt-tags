/**
 * A component to handle un-accounted for errors;
 * Gives the user an option, either re-auth(refresh page, and submite new tokens) or
 * Redirect to a contact us page
 */
import React, { Component } from "react";
import { Page, Banner, TextStyle } from "@shopify/polaris";

const Success = ({ productsProcessed, imgsProcessed }) => {
    return (
        <Page>
            <Banner
                title={`${imgsProcessed} Product Images Have been Optimized!`}
                action={{ content: "Review US", onAction: () => console.log("Clicked") }}
                status='positive'
            >
                <TextStyle variation='positive'>
                    You've just opmtized {imgsProcessed} from {productsProcessed} productsArray
                </TextStyle>

                <p>We'll keep an eye out for new images and optimized the moment you added them!</p>
            </Banner>
        </Page>
    );
};

export default Success;
