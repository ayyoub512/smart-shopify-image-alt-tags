/**
 * A component to handle un-accounted for errors;
 * Gives the user an option, either re-auth(refresh page, and submite new tokens) or
 * Redirect to a contact us page
 */

import React from "react";
import axios from "axios";

import { Page, Layout, Banner, Badge, Card, FormLayout, TextField, TextContainer, Heading } from "@shopify/polaris";
import LoadingComponent from "./LoadingComponent";
import FAQs from "./FAQs";

class Success extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            lastStatusData: props.lastStatusData, // gets returned from the server
        };
    }

    render() {
        if (!this.state.isLoading)
            return (
                <Page title='Optimazation Report' titleMetadata={<Badge status='success'>Optimized</Badge>}>
                    <Layout>
                        <Layout.Section>
                            <Banner
                                title={`You've just optimized ${this.state.lastStatusData.imgsProcessed} images from ${this.state.lastStatusData.productsProcessed} products 😎`}
                                action={{ content: "Review US", onAction: () => console.log("Clicked") }}
                                status='success'
                            >
                                <p>We'll keep an eye out for new images and optimize them the moment they get uploaded</p>
                            </Banner>
                        </Layout.Section>

                        <Layout.AnnotatedSection title='Alt Template Settings' description='Want to update your alt template value for all your exisiting images and newly added ones?'>
                            <Card
                                sectioned
                                secondaryFooterActions={[
                                    {
                                        content: "Edit the ALT rule",
                                        onAction: () => {
                                            alert("We're working on this feature");
                                        },
                                    },
                                ]}
                            >
                                <FormLayout>
                                    <TextField disabled label='Current alt template value' value={this.state.lastStatusData.templateValue} />
                                </FormLayout>
                            </Card>
                        </Layout.AnnotatedSection>

                        <Layout.Section>
                            <Heading>FAQs</Heading>

                            <br />
                            <FAQs />
                        </Layout.Section>
                    </Layout>
                </Page>
            );

        return <LoadingComponent data={this.state.data} />;
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
