# Productify, Storefront Backend API

<p align="center">
  <img src="">
</p>

## Table of Contents

- [Summary](#Summary)

- [Technologies](#Technologies)

- [Features](#Features)

- [Endpoints](#Endpoints)

- [Testing](#Testing)

- [Structure](#Structure)

- [Migration](#Migration)

- [Usage and Installation](#usage-and-installation)

## Summary

Productify is a storefront backend API that I made as part of my Full Stack JavaScript Developer Nanodegree from Udacity.

It was made following the requirements in the REQUIREMENTS.md file.

It demonstrates my understanding of Typescript, NodeJS, Express, Postgresql, migrations, Endpoints, Jasmine, Unit Testing, JWT, authorization, authentication, salting and peppering.

## Technologies

NodeJS was used for the runtime.  
Express was used for the backend.  
Jasmine was used for the unit testing.  
db-migrate was used for database migration.  
PostgreSQL was used for the relational database.  
Typescript was used as the programming language.  
Bcrypt was used for password salting and peppering.

## Features

#### Security

- Using salted and peppered passwords.
- Authenticatication and authorization using JWT.

#### Users

- Register as a new user.
- Login as an existing user.
- Update your user data once signed in.
- Delete your user account and all its data.

#### Products

- Add new product.
- Update a product.
- Delete an existing product.

#### Orders

- Add new order.
- Update an order.
- Delete an existing order.

#### Special Routes

- Get user open orders.
- Get products by category.
- Get user completed orders.
- Get the top five products (By total units in orders).

## Endpoints

For an extensive list of all the end points and the database schema/data-shapes please check the [requirements](REQUIREMENTS.md) file.

## Testing

A full suite of tests that includes 70 tests is ready to use that cover all endpoints and models.

You can use

```
npm test
```

To start the unit testing

## Structure

```
|   dotEnv_Example
+---migrations
|   |   20211107201216-users-table.js
|   |   20211107201251-products-table.js
|   |   20211107201316-orders-table.js
|   |   20211107201443-order-products-table.js
|   |   package.json
|   |
|   \---sqls
|           20211107201216-users-table-down.sql
|           20211107201216-users-table-up.sql
|           20211107201251-products-table-down.sql
|           20211107201251-products-table-up.sql
|           20211107201316-orders-table-down.sql
|           20211107201316-orders-table-up.sql
|           20211107201443-order-products-table-down.sql
|           20211107201443-order-products-table-up.sql
|           package.json
|
+---spec
|   \---support
|           jasmine.json
|
\---src
    |   database.ts
    |   server.ts
    |
    +---handlers
    |       dashboard.ts
    |       orders.ts
    |       products.ts
    |       users.ts
    |
    +---models
    |       order.ts
    |       product.ts
    |       user.ts
    |
    +---services
    |       dashboard.ts
    |
    \---tests
        +---handlers
        |       dashboardSpec.ts
        |       ordersSpec.ts
        |       productsSpec.ts
        |       usersSpec.ts
        |
        +---helpers
        |       reporter.ts
        |
        \---models
                orderSpec.ts
                productSpec.ts
                userSpec.ts
```

## Migration

A complete database migration schema is available.  
Please use the following command to install db-migrate globally

```
npm install -g db-migrate
```

Start by making two databases one for production and one for testing.  
Using psql we can do the following

```
psql -U username
# Enter Password
CREATE DATABASE databaseName;
CREATE DATABASE testDatabaseName;
```

Create a .env file for the database connection using the the template in the file

```
dotEnv_Example
```

Found in the project root filder and replace the following fields with your information

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=DB_NAME_HERE
POSTGRES_TEST_DB=UNIT_TEST_DB_NAME_HERE
POSTGRES_USER=DB_USER
POSTGRES_PASSWORD=DB_USER_PASSWORD
BCRYPT_PASSWORD=YOUR_PEPPER_HERE
TOKEN_SECRET=YOUR_JWT_SECRET
SALT_ROUNDS=10
ENV=dev
```

Then use the following command to migrate the tables automatically to your new database

```
db-migrate up
```

## Usage and Installation

You can get the project up and running in two simple steps.

Install the required packages using the following command.

```
npm install
```

Then follow the steps mentioned in the migration section above.

You can then use the following command to run the project

```
npm run watch
```
