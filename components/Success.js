/**
 * A component to handle un-accounted for errors;
 * Gives the user an option, either re-auth(refresh page, and submite new tokens) or
 * Redirect to a contact us page
 */
import React, { Component } from "react";
import { Page, Banner, TextStyle } from "@shopify/polaris";

const Success = (props) => {
    return (
        <Page>
            <Banner
                title="Something isn't right!"
                action={{ content: "Review US", onAction: () => console.log("Clicked") }}
                status='positive'
            >
                <TextStyle variation='positive'>We've changed the alt tag for all the images on your store</TextStyle>

                <p>We've keep an eye for new images and update the alt tag as soon as they come!</p>
            </Banner>
        </Page>
    );
};

export default Success;
