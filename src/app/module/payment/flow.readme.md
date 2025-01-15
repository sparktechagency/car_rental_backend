# Payment management

```


+-------------------+        +-------------------+        +--------------------+
|      USER         | -----> |      BACKEND      | -----> |     STRIPE         |
|                   |        |                   |        |                    |
| Initiates Payment |        | Create Payment    |        | Process Payment    |
|                   |        | Save Booking Info |        | Store Funds in     |
|                   |        |                   |        | Admin Account      |
+-------------------+        +-------------------+        +--------------------+

                               |
                               |
                               v

+-------------------+        +-------------------+        +--------------------+
|       HOST        | -----> |      BACKEND      | -----> |     STRIPE         |
|                   |        | Create Host       |        | Create Custom      |
| Register Details  |        | Account           |        | Host Account       |
|                   |        | Verify Bank Info  |        | Save Account Info  |
+-------------------+        +-------------------+        +--------------------+

                               |
                               |
                               v

+-------------------+        +-------------------+        +--------------------+
|     ADMIN         | -----> |      BACKEND      | -----> |     STRIPE         |
| Marks Booking     |        | Transfer Payment  |        | Transfer Funds to  |
| Completed         |        | to Host           |        | Host's Bank Account|
+-------------------+        +-------------------+        +--------------------+



```

# Required Info when creating a connected account

### For US (completed)

```

{
   type: "custom",
    country: "US",
    email,
    business_profile: {
      url: "https://example-host-website.com",
    },
    business_type: "individual",
        individual: {
      first_name,
      last_name,
      phone,
      dob: {
        day: 1,
        month: 1,
        year: 1901,
      },
      ssn_last_4: "0000",
    },
    external_account: {
      object: "bank_account", // Specifies the type of external account
      account_number: bank_account_no,
      routing_number: routing_no,
      country: "US", // Country of the bank account
    },
    capabilities: {
      transfers: { requested: true },
    },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: `${clientIp}`,
    },
}

```

### For UK (Enabled)

needs personal information to complete

```

{
    type: "custom",
    country: "GB",
    email,
    business_profile: {
      mcc: "5734",
      url,
    },
    business_type: "individual",
    individual: {
      first_name,
      last_name,
      email,
      phone,
      dob: {
        day: 1,
        month: 1,
        year: 2024,
      },
      address: {
        line1: "123 High Street",
        city: "London",
        postal_code: "SW1A 1AA",
        country: "GB",
      },
    },
    external_account: {
      object: "bank_account",
      account_number: bank_account_no,
      country: "GB",
      currency: "gbp",
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: `${clientIp}`,
    },
}

```

nardolimited@gmail.com
Airbnb123.!
