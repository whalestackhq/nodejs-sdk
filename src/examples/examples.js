#!/usr/bin/env node
const CoinqvestClient = require('../lib/index');

/**
 This file contains examples on how to interact with the COINQVEST Merchant API.
 All endpoints of the API are documented here: https://www.coinqvest.com/en/api-docs

 Create a COINQVEST Merchant API client
 The constructor takes your API Key, API Secret and an optional log file location as parameters
 Your API Key and Secret can be obtained here: https://www.coinqvest.com/en/api-settings
 */
const client = new CoinqvestClient(
    'YOUR-API-KEY',
    'YOUR-API-SECRET'
);

async function main() {

    /**
     Invoke a request to GET /auth-test (https://www.coinqvest.com/en/api-docs#get-auth-test) to see if everything worked
     */
    let response = await client.get('/auth-test');
    console.log(response.status);
    console.log(response.data);

    /**
     Check our USD wallet balance using GET /wallet (https://www.coinqvest.com/en/api-docs#get-wallet)
     */
    response = await client.get('/wallet', {assetCode: 'USD'});
    console.log(response.status);
    console.log(response.data);


    /**
     Create a checkout and get paid in two easy steps

     It's good practice to associate payments with a customer, let's create one.
     Invoke POST /customer (https://www.coinqvest.com/en/api-docs#post-customer) to create a new customer object.
     Tip: At a minimum a customer needs an email address, but it's better to provide a full billing address for invoices.
     */
    response = await client.post('/customer', {customer:{
        email: 'mail@example.org',
        firstname: 'John',
        lastname: 'Doe',
        company: 'ACME Inc.',
        adr1: '810 Beach St',
        adr2: 'Finance Department',
        zip: 'CA 94133',
        city: 'San Francisco',
        countrycode: 'US'
    }});

    console.log(response.status);
    console.log(response.data);

    if (response.status !== 200) {
        // something went wrong, let's abort and debug by looking at our log file
        console.log('Could not create customer. Inspect above log entry.');
        return;
    }

    // the customer was created
    // response.data now contains an object as specified in the success response here: https://www.coinqvest.com/en/api-docs#post-customer
    // extract the customer id to use it in our checkout below
    let customerId = response.data['customerId'];

    response = await client.post('/checkout/hosted', {
        charge:{
            customerId: customerId, // associates this charge with a customer
            billingCurrency: 'USD', // specifies the billing currency
            lineItems: [{ // a list of line items included in this charge
                description: 'T-Shirt',
                netAmount: 10,
                quantity: 1
            }],
            discountItems: [{ // an optional list of discounts
                description: 'Loyalty Discount',
                netAmount: 0.5
            }],
            shippingCostItems: [{ // an optional list of shipping and handling costs
                description: 'Shipping and Handling',
                netAmount: 3.99,
                taxable: false // sometimes shipping costs are taxable
            }],
            taxItems: [{
                name: 'CA Sales Tax',
                percent: 0.0825 // 8.25% CA sales tax
            }]
        },
        settlementAsset: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' // specifies in which asset you want to settle
    });

    console.log(response.status);
    console.log(response.data);

    if (response.status !== 200) {
        // something went wrong, let's abort and debug by looking at our log file
        console.log('Could not create checkout.');
        return;
    }

    // the checkout was created
    // response.data now contains an object as specified in the success response here: https://www.coinqvest.com/en/api-docs#post-checkout
    let checkoutId = response.data['id']; // store this persistently in your database
    let url = response.data['url']; // redirect your customer to this URL to complete the payment

    console.log(checkoutId, url);


    /**
     you can update a customer object like this
     */
    response = await client.put('/customer', {customer:{id: customerId, email: 'mail@example.org'}});
    console.log(response.status);
    console.log(response.data);


    /**
     delete a customer when not needed anymore
     */
    response = await client.delete('/customer', {id: customerId});
    console.log(response.status);
    console.log(response.data);


}

main();
