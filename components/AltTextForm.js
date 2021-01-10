import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
    TextField,
    Banner,
    Card,
    Stack,
    Page,
    Layout,
    Tag,
    TextContainer,
    TextStyle,
    Subheading,
} from '@shopify/polaris';

import LoadingComponent from './LoadingComponent';

/**
 * The Template Form
 */
class AltTextForm extends React.Component {
    constructor(props) {
        super(props);

        const shopName = props.shopName ?? '[shop_name]';
        const imgSrc = props.product?.node?.featuredImage?.originalSrc;
        const handle = props.product?.node?.handle;
        const productType = props.product?.node?.productType;
        const productTitle = props.product?.node?.title;
        const vendor = props.product?.node?.vendor;

        this.state = {
            value: '[product_title] [variant_title]  - ' + shopName, // template value
            imgSrc,
            handle,
            productType,
            productTitle,
            vendor,
            shopName: props.shopName,
            isLoading: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        // if (this.state.isLoading) return <LoadingComponent />;

        return (
            <Page title='Settings'>
                {this.state.isLoading && <LoadingComponent />}
                <Layout>
                    <Layout.Section oneHalf>
                        <Card sectioned>
                            <img
                                src={
                                    this.state.imgSrc ??
                                    'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
                                }
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        </Card>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <Card
                            title='Set an image alt text template'
                            primaryFooterAction={{ content: 'Optimize Now', onAction: this.handleSubmit }}
                        >
                            <Card.Section>
                                <TextField
                                    label='Alt text template'
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder='Alt text value'
                                    clearButton
                                    onClearButtonClick={() => this.setState({ value: '' })}
                                />
                            </Card.Section>
                            <Card.Section subdued>
                                <TextContainer>
                                    <Subheading>Click to use the following values</Subheading>

                                    <Stack>
                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue
                                                    ? (newValue += ' [product_title] ')
                                                    : (newValue = '[product_title] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [product_title]
                                        </Tag>

                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue
                                                    ? (newValue += ' [variant_title] ')
                                                    : (newValue = '[variant_title] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [variant_title]
                                        </Tag>

                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue
                                                    ? (newValue += ' [product_handle] ')
                                                    : (newValue = '[product_handle] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [product_handle]
                                        </Tag>

                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue
                                                    ? (newValue += ' [product_vendor] ')
                                                    : (newValue = '[product_vendor] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [product_vendor]
                                        </Tag>

                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue
                                                    ? (newValue += ' [product_type] ')
                                                    : (newValue = '[product_type] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [product_type]
                                        </Tag>

                                        <Tag
                                            onClick={(e) => {
                                                let newValue = this.state.value.trim();

                                                newValue ? (newValue += ' [shop_name] ') : (newValue = '[shop_name] ');

                                                this.setState({
                                                    value: newValue,
                                                });
                                            }}
                                        >
                                            [shop_name]
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
                                        <Tag>[product_handle]</Tag> Very useful, refers to the product handle, exemple
                                        /products/this-is-the-product-handle
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

    handleChange(newValue) {
        this.setState({ value: newValue });
    }

    handleSubmit(event) {
        const templateValue = this.state.value.trim();
        if (templateValue.length > 0) {
            axios
                .post('/api/shopify/', {
                    templateValue,
                })
                .then(
                    (result) => {
                        console.log(result);
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
}

export default AltTextForm;
