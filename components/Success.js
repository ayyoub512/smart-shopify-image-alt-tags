/**
 * A component to handle un-accounted for errors;
 * Gives the user an option, either re-auth(refresh page, and submite new tokens) or
 * Redirect to a contact us page
 */

import React from "react";

import axios from "axios";

import { Page, Banner, TextStyle } from "@shopify/polaris";
import LoadingComponent from "./LoadingComponent";

class Success extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            data: {}, // gets returned from the server
        };
    }

    render() {
        if (this.state.isLoading) return <LoadingComponent />;

        return (
            <Page>
                <Banner
                    title={`${this.state.data.imgsProcessed} Images Have been Optimized!`}
                    action={{ content: "Review US", onAction: () => console.log("Clicked") }}
                    status='positive'
                >
                    <TextStyle variation='positive'>
                        {this.state.data.imgsProcessed} images were optimized, from
                        {this.state.data.productsProcessed} products, templateValue is: {this.state.data.templateValue}
                    </TextStyle>

                    <p>We'll keep an eye out for new images and optimize them the moment you added them! </p>
                </Banner>
            </Page>
        );
    }

    componentDidMount() {
        axios.post("/api/status").then(
            (result) => {
                this.setState({ isLoading: false, data: result.data?.data });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (err) => {
                console.log(err);
            }
        );

        this.setState({ isLoading: true });
    }
}
export default Success;
