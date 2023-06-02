# COINQVEST Payments API SDK (NodeJS)

Official COINQVEST Payments API SDK for NodeJS by www.coinqvest.com

Accepting cryptocurrency payments using the COINQVEST API is fast, secure, and easy. After you've signed up and obtained your [API key](https://www.coinqvest.com/en/api-settings), all you need to do is create a checkout or blockchain deposit address on Bitcoin, Lightning, Litecoin, Stellar, or other supported networks to get paid. You can also use the API for fiat on- and off-ramping via SWIFT or SEPA.

This SDK implements the REST API documented at https://www.coinqvest.com/en/api-docs

For SDKs in different programming languages, see https://www.coinqvest.com/en/api-docs#sdks

Requirements
------------
* NodeJS >= 10.14.0
* axios >= 0.21.1

Installation with npm
---------------------
`npm install coinqvest-merchant-sdk`

**Usage Client**
```javascript
require('coinqvest-merchant-sdk');

const client = new CoinqvestClient(
    'YOUR-API-KEY',
    'YOUR-API-SECRET'
);
```
Get your API key and secret here: https://www.coinqvest.com/en/api-settings

Guides
------

* [Using the COINQVEST API](https://www.coinqvest.com/en/api-docs#getting-started)
* [Building Checkouts](https://www.coinqvest.com/en/api-docs#building-checkouts)
* [Authentication](https://www.coinqvest.com/en/api-docs#authentication) (handled by SDK)
* [Brand Connect](https://www.coinqvest.com/en/api-docs#brand-connect) (white label checkouts on your own domain)

## Wallets and Deposits

Your COINQVEST account comes equipped with dedicated deposit addresses for Bitcoin, Lightning, Litecoin, select assets on the Stellar Network, SWIFT, and SEPA, and other supported networks. You can receive blockchain payments within seconds after registering. The [GET /wallets](https://www.coinqvest.com/en/api-docs#get-wallets) and [GET /deposit-address](https://www.coinqvest.com/en/api-docs#deposit-address) endpoints return your blockchain addresses to start receiving custom deposits.

**List Wallets and Deposit Addresses** (https://www.coinqvest.com/en/api-docs#get-wallets)
```javascript
let response = await client.get('/wallets');
```

## Checkouts

COINQVEST checkouts provide fast and convenient ways for your customers to complete payment. We built a great user experience with hosted checkouts that can be fully branded. If you're not into payment pages, you can take full control over the entire checkout process using our backend checkout APIs. Click [here](https://www.coinqvest.com/en/api-docs#building-checkouts) to learn more about building checkouts.

**Create a Hosted Checkout (Payment Link)** (https://www.coinqvest.com/en/api-docs#post-checkout-hosted)
```javascript
let response = await client.post('/checkout/hosted', {
    charge:{
        billingCurrency: 'EUR', // specifies the billing currency
        lineItems: [{ // a list of line items included in this charge
            description: 'PCI Graphics Card',
            netAmount: 169.99,
            quantity: 1
        }],
        shippingCostItems: [], // an optional list of shipping and handling costs
        taxItems: []
    },
    settlementAsset: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' // your settlement asset as given by GET /assets (or ORIGIN to omit conversion)
});
```

## Swaps And Transfers

Once funds arrive in your account, either via completed checkouts or custom deposits, you have instant access to them and the ability to swap them into other assets or transfer them to your bank account or other blockchain accounts (we recommend to always forward funds into self-custody on cold storage). The [POST /swap](https://www.coinqvest.com/en/api-docs#post-swap) and [POST /transfer](https://www.coinqvest.com/en/api-docs#post-transfer) endpoints will get you started on swaps and transfers.

**Swap Bitcoin to USDC** (https://www.coinqvest.com/en/api-docs#post-swap)
```javascript
let response = await client.post('/swap', {
    sourceAsset: 'BTC:GCQVEST7KIWV3KOSNDDUJKEPZLBFWKM7DUS4TCLW2VNVPCBGTDRVTEIT',
    targetAsset: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    targetAmount: 100
});
```

**Transfer USDC to your SEPA Bank** (https://www.coinqvest.com/en/api-docs#post-transfer)
```javascript
let response = await client.post('/transfer', {
    network: 'SEPA',
    asset: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    amount: 100,
    targetAccount: 'A unique SEPA account label as previously specified in POST /target-account'
});
```

## Supported Assets, Currencies, and Networks

**List all available Networks** (https://www.coinqvest.com/en/api-docs#get-networks)
```javascript
let response = await client.get('/networks');
```

**List all available Assets** (https://www.coinqvest.com/en/api-docs#get-assets)
```javascript
let response = await client.get('/assets');
```

**List all available Billing Currencies** (https://www.coinqvest.com/en/api-docs#get-currencies)
```javascript
let response = await client.get('/currencies');
```

## Financial Reports and Accounting

We don't leave you hanging with an obscure and complicated blockchain payment trail to figure out by yourself. All transactions on COINQVEST are aggregated into the Financial Reports section of your account and can even be associated with counter-parties, such as customers and beneficiaries. We provide CSV reports, charts, and beautiful analytics for all your in-house accounting needs.

Please inspect https://www.coinqvest.com/en/api-docs for detailed API documentation or send us an email to service@coinqvest.com.

Support and Feedback
--------------------
Your feedback is appreciated! If you have specific problems or bugs with this SDK, please file an issue on Github. For general feedback and support requests, send an email to service@coinqvest.com.

Contributing
------------

1. Fork it ( https://github.com/COINQVEST/nodejs-merchant-sdk/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

