import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextField, Card, Stack, Page, Layout, Tag, TextContainer, TextStyle, Subheading } from "@shopify/polaris";

import Working from "./Working";
import Success from "./Success";
import ErrorsHandler from "./ErrorsHandler";
import LoadingComponent from "./LoadingComponent";
import { operationStatus as opStatus } from "../helpers/staticVars";
/**
 * The Template Form
 */
class AltTextForm extends React.Component {
    constructor(props) {
        super(props);

        const shopName = props.shopName ?? "[shop_name]";
        const imgSrc = props.product?.node?.featuredImage?.originalSrc;
        const handle = props.product?.node?.handle;
        const productType = props.product?.node?.productType;
        const productTitle = props.product?.node?.title;
        const vendor = props.product?.node?.vendor;
        const altFormula = props.altFormula;
        const lastOperationStatus = props.lastOperationStatus;

        this.state = {
            altFormula: altFormula ?? "[product_title] [product_type]  - " + shopName,
            imgSrc,
            handle,
            productType,
            productTitle,
            vendor,
            shopName: props.shopName,
            lastOperationStatus,
            isLoading: false,
            lastStatusData: {}, // gets returned from the server
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        if (this.state.isLoading) return <Working />;
        else if (this.state.lastOperationStatus == opStatus.IN_PROGRESS) return <Working />;
        else if (this.state.lastOperationStatus == opStatus.SUCCEEDED) return <Success lastStatusData={this.state.lastStatusData} />;
        else if (this.state.lastOperationStatus == opStatus.FAILED) return <ErrorsHandler />;
        else
            return (
                <Page title='Alt Value Setup'>
                    {/* {this.state.isLoading && <LoadingComponent />} */}
                    <Layout>
                        <Layout.Section oneHalf>
                            <Card sectioned>
                                <img src={this.state.imgSrc ?? "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneHalf>
                            <Card title='Set the alt formula' primaryFooterAction={{ content: "Optimize Now", onAction: this.handleSubmit }}>
                                <Card.Section>
                                    <TextField
                                        label='Alt Formula'
                                        value={this.state.altFormula}
                                        onChange={this.handleChange}
                                        placeholder='Alt Formulas'
                                        clearButton
                                        onClearButtonClick={() => this.setState({ altFormula: "" })}
                                    />
                                </Card.Section>
                                <Card.Section subdued>
                                    <TextContainer>
                                        <Subheading>Click to use the following values</Subheading>

                                        <Stack>
                                            <Tag
                                                onClick={(e) => {
                                                    let newAltFormula = this.state.altFormula.trim();

                                                    newAltFormula ? (newAltFormula += " [product_title] ") : (newAltFormula = "[product_title] ");

                                                    this.setState({
                                                        altFormula: newAltFormula,
                                                    });
                                                }}
                                            >
                                                [product_title]
                                            </Tag>

                                            <Tag
                                                onClick={(e) => {
                                                    let newAltFormula = this.state.altFormula.trim();

                                                    newAltFormula ? (newAltFormula += " [shop_name] ") : (newAltFormula = "[shop_name] ");

                                                    this.setState({
                                                        altFormula: newAltFormula,
                                                    });
                                                }}
                                            >
                                                [shop_name]
                                            </Tag>

                                            <Tag
                                                onClick={(e) => {
                                                    let newAltFormula = this.state.altFormula.trim();

                                                    newAltFormula ? (newAltFormula += " [product_vendor] ") : (newAltFormula = "[product_vendor] ");

                                                    this.setState({
                                                        altFormula: newAltFormula,
                                                    });
                                                }}
                                            >
                                                [product_vendor]
                                            </Tag>

                                            <Tag
                                                onClick={(e) => {
                                                    let newAltFormula = this.state.altFormula.trim();

                                                    newAltFormula ? (newAltFormula += " [product_type] ") : (newAltFormula = "[product_type] ");

                                                    this.setState({
                                                        altFormula: newAltFormula,
                                                    });
                                                }}
                                            >
                                                [product_type]
                                            </Tag>

                                            <Tag
                                                onClick={(e) => {
                                                    let newAltFormula = this.state.altFormula.trim();

                                                    newAltFormula ? (newAltFormula += " [product_handle] ") : (newAltFormula = "[product_handle] ");

                                                    this.setState({
                                                        altFormula: newAltFormula,
                                                    });
                                                }}
                                            >
                                                [product_handle]
                                            </Tag>
                                        </Stack>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                        </Layout.Section>

                        <Layout.AnnotatedSection
                            title='Explaining the template values'
                            description='We thought its a good idea to explain what each value does with a correspondent exemple pulled from your store.'
                        >
                            <Card title='More info about above values'>
                                <Card.Section>
                                    <TextContainer>
                                        <p>
                                            <Tag>[product_handle]</Tag> Very useful, refers to the product handle, exemple /products/this-is-the-product-handle
                                        </p>
                                        Ex: <TextStyle variation='code'> this-is-the-product-handle </TextStyle>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                        </Layout.AnnotatedSection>
                    </Layout>
                </Page>
            );
    }

    handleChange(newAltFormula) {
        this.setState({ altFormula: newAltFormula });
    }

    handleSubmit(event) {
        const altFormula = this.state.altFormula.trim();
        if (altFormula.length > 0) {
            axios
                .post("/api/init", {
                    altFormula,
                })
                .then(
                    (result) => {
                        console.log(result.data);
                        if (result.data.error) {
                            this.setState({ lastOperationStatus: opStatus.FAILED, isLoading: false });
                        } else {
                            this.setState({ lastOperationStatus: opStatus.SUCCEEDED, isLoading: false, lastStatusData: result.data.data });
                        }
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (err) => {
                        console.log(err);
                    }
                );

            this.setState({ isLoading: true });

            // const socket = new WebSocket("ws://8.tcp.ngrok.io:12562");

            // socket.send("hey");
            // socket.onmessage = ({ data }) => {
            //     console.log("I got this ", data);
            // };
        }
    }
}

export default AltTextForm;
