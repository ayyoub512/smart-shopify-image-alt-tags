const getSubscriptionUrl = async (accessToken, shop) => {
    const returnUrl = `https://55465ab81d78.ngrok.io?shop=${shop}`;

    const query = JSON.stringify({
        query: `mutation {
        appSubscriptionCreate(
          name: "Super Duper Plan"
          returnUrl: "${returnUrl}"
          test: true
          lineItems: [
            {
              plan: {
                appUsagePricingDetails: {
                  cappedAmount: { amount: 10, currencyCode: USD }
                  terms: "$1 for 1000 emails"
                }
              }
            }
            {
              plan: {
                appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
                }
              }
            }
          ]
        )
        {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
          }
        }
      }`,
    });
    console.log(query);
    console.log(returnUrl);

    const response = await fetch(`https://${shop}/admin/api/2020-10/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
        },
        body: query,
    });
    try {
        const responseJson = await response.json();
        console.log(responseJson);
        return responseJson.data.appSubscriptionCreate.confirmationUrl;
    } catch (err) {
        console.log(err);
    }
};

module.exports = getSubscriptionUrl;
