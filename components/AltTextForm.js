import React, { useState, useCallback } from 'react';
// import { Loading } from '@shopify/app-bridge-react';

import {
    TextField,
    Button,
    Card,
    Form,
    Stack,
    Page,
    Layout,
    Tag,
    TextContainer,
    TextStyle,
    FormLayout,
    Heading,
    Subheading,
} from '@shopify/polaris';

const imgSrc =
    'https://cdn.shopify.com/s/files/1/0521/6046/3008/products/young-man-in-bright-fashion_925x_f7029e2b-80f0-4a40-a87b-834b9a283c39.jpg?v=1608301949';

function AltTextForm(props) {
    const [textFieldValue, setTextFieldValue] = useState('[product_title][variant_title] - [shop_name]');

    const handleTextFieldChange = useCallback((value) => setTextFieldValue(value), []);

    return (
        <Page title='Settings'>
            <Layout>
                <Layout.Section oneHalf>
                    <Card sectioned>
                        <img src={imgSrc} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card title='Set an image alt text template' primaryFooterAction={{ content: 'Optimize Now' }}>
                        <Card.Section>
                            <TextField
                                value={textFieldValue}
                                label='Alt text template'
                                onChange={handleTextFieldChange}
                                placeholder='Alt text value'
                                clearButton
                                onClearButtonClick={() => setTextFieldValue('')}
                            />
                        </Card.Section>
                        <Card.Section subdued>
                            <TextContainer>
                                <Subheading>Click to use the following values</Subheading>

                                <Stack>
                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[product_title]')}>
                                        [product_title]
                                    </Tag>

                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[variant_title]')}>
                                        [variant_title]
                                    </Tag>

                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[product_handler]')}>
                                        [product_handler]
                                    </Tag>

                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[product_vendor]')}>
                                        [product_vendor]
                                    </Tag>

                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[product_type]')}>
                                        [product_type]
                                    </Tag>

                                    <Tag onClick={(e) => setTextFieldValue(textFieldValue + '[shop_name]')}>
                                        [shop_name]
                                    </Tag>
                                </Stack>
                            </TextContainer>
                        </Card.Section>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

// /* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps(ctx) {
    const shop = ctx.query.shop;
    console.log(db);
    if (!shop) throw ' getServerSideProps(ctx) if (!shop) throw';

    findShopByName(shop)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });

    return { props: { shop: shop } };
}

export default AltTextForm;
