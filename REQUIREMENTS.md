# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

| Endpoint | Request | Parameters | Requires Token | Usage          |
| -------- | ------- | ---------- | -------------- | -------------- |
| **/**    | **GET** | **N/A**    | **False** \*   | **Root Route** |

#### Users:

| Endpoint         | Request    | Parameters                            | Requires Token | Usage               |
| ---------------- | ---------- | ------------------------------------- | -------------- | ------------------- |
| **/users**       | **GET**    | **N/A**                               | **True** \*    | **List Users**      |
| **/users**       | **POST**   | **firstname, lastname, password**     | **False**      | **Create User**     |
| **/users**       | **PUT**    | **id, firstname, lastname, password** | **True** \*    | **Update User**     |
| **/users**       | **DELETE** | **id**                                | **True** \*    | **Delete User**     |
| **/users/:id**   | **GET**    | **id**                                | **True** \*    | **Load user by Id** |
| **/users/login** | **POST**   | **firstname, lastname, password**     | **False**      | **Logs user in**    |

#### Products:

| Endpoint          | Request    | Parameters                    | Requires Token | Usage                  |
| ----------------- | ---------- | ----------------------------- | -------------- | ---------------------- |
| **/products**     | **GET**    | **N/A**                       | **False**      | **List products**      |
| **/products**     | **POST**   | **name, price, category**     | **True** \*    | **Create product**     |
| **/products**     | **PUT**    | **id, name, price, category** | **True** \*    | **Update product**     |
| **/products**     | **DELETE** | **id**                        | **True** \*    | **Delete product**     |
| **/products/:id** | **GET**    | **id**                        | **False**      | **Load product by Id** |

#### Orders:

| Endpoint                 | Request    | Parameters                   | Requires Token | Usage                    |
| ------------------------ | ---------- | ---------------------------- | -------------- | ------------------------ |
| **/orders**              | **GET**    | **N/A**                      | **False**      | **List orders**          |
| **/orders**              | **POST**   | **status, user_id**          | **True** \*    | **Create order**         |
| **/orders**              | **PUT**    | **id, status, user_id**      | **True** \*    | **Update order**         |
| **/orders**              | **DELETE** | **id**                       | **True** \*    | **Delete order**         |
| **/orders/:id**          | **GET**    | **id**                       | **False**      | **Load order by Id**     |
| **/orders/:id/products** | **POST**   | **id, product_id, quantity** | **True** \*    | **Add product to order** |

#### Special Routes:

| Endpoint                  | Request  | Parameters   | Requires Token | Usage                                              |
| ------------------------- | -------- | ------------ | -------------- | -------------------------------------------------- |
| **/orders/current**       | **POST** | **user_id**  | **True** \*    | **List user open orders**                          |
| **/orders/completed**     | **POST** | **user_id**  | **True** \*    | **List user completed orders**                     |
| **/products/top_five**    | **GET**  | **N/A**      | **False**      | **List top five products (total units in orders)** |
| **/products/by_category** | **POST** | **category** | **False**      | **List products by category**                      |

#### \* A valid JWT token can be obtained by either signing in as a user or creating a new user.

## Database Schema

#### Product

| Field        | Type             | Special Attributes |
| ------------ | ---------------- | ------------------ |
| **id**       | **Serial**       | **Primay Key**     |
| **name**     | **Varchar(100)** | **N/A**            |
| **price**    | **Integer**      | **N/A**            |
| **category** | **Varchar(100)** | **N/A**            |

#### User

| Field               | Type             | Special Attributes |
| ------------------- | ---------------- | ------------------ |
| **id**              | **Serial**       | **Primay Key**     |
| **firstname**       | **Varchar(100)** | **N/A**            |
| **lastname**        | **Varchar(100)** | **N/A**            |
| **password_digest** | **Varchar**      | **N/A**            |

#### Orders

| Field       | Type             | Special Attributes |
| ----------- | ---------------- | ------------------ |
| **id**      | **Serial**       | **Primay Key**     |
| **status**  | **Varchar(100)** | **N/A**            |
| **user_id** | **Varchar(100)** | **Foreign Key**    |

#### Orders_Products

| Field          | Type             | Special Attributes |
| -------------- | ---------------- | ------------------ |
| **id**         | **Serial**       | **Primay Key**     |
| **quantity**   | **Integer**      | **N/A**            |
| **order_id**   | **Varchar(100)** | **Foreign Key**    |
| **product_id** | **Varchar(100)** | **Foreign Key**    |
