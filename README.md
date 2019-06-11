# Turing fullstack challenge

This project presents the fullstack turing challenge "Tshirtstore"
To test the project online you can visit [turing.fouita.com](http://turing.fouita.com) 

# Table of Contents
1. [Installation](#installation)
2. [Core features](#core-features)
3. [Tech stack used](#tech-stack-used)
4. [Project Structure](#project-structure)
5. [API Requests](#api-requests)
6. [Root Queries](#root-queries)
7. [Services](#services)
8. [Work not yet done](#work-not-yet-done)
9. [Made by](#made-by)

## Installation

### Initiate the database and Set your environment values
You can add them to your `.bashrc` file
```sh
export MYSQL_HOST=127.0.0.1
export MYSQL_USER=your_mysql_user
export MYSQL_PASSWORD=your_mysql_user_password
export MYSQL_DATABASE=your_database_name
export STRIPE_SK=your_stripe_sk
```

### Development mode

```sh
git clone https://github.com/haynajjar/turing-fullstack.git
cd turing-fullstack
npm install
npm start
```
Then visit the application at `localhost:3000` 

### Production mode
This will make the application look much faster
to run in production you need to build the project first

```sh
npm run build
npm run prod
# or launch with pm2 using 
pm2 sart start.sh --name turing
# the app will be accessible on port 3001
```

## Core features

* mobile friendly products display with material design
* product filtering through departments and categories
* product details display with options selection , the selection will be used as default values for the new cart items unless they are updated 
* client state management , remembering the filters and the page when returning from product details page so you can't loose track on the page you visited
* shopping cart instant update , if the user choose the same product multiple times the cart item quantity will be updated, otherwise it will add a new item
* user registration and login , after the login the app will remember the user until he clicks on logout
* responsive checkout steps with "some" data validation (still not completed)
* possibility to update the shopping cart items options and quantity before validating the order
* create order and save its state so when the user returns to checkout he can either pay or cancel the his order, he can also add new shopping cart items and then cancel the previous order
* display order notification if the user returns to the website without completing his order (the display is set only if the shopping cart is empty)
* payment using stripe API


## Tech stack used
To make the application run very fast i needed a combination of the following frameworks

#### React, redux, nextjs , fastify, urql, bookshelfjs , material-ui

For the backend i used fastify based on some [benchmarks](https://github.com/fastify/fastify#benchmarks) , and to make it faster on the client i needed some ssr engine that's why i used [nextjs](https://www.manifold.co/blog/we-migrated-to-next-js-to-serve-our-home-page-7-5-faster-559443219c84). I decided to run with redux because it is a good fit for application state management especially with React. to go even further i needed to retreive multiple resources in a single request that's where graphQL comes into place, i found a new library that works well with React called [urql](https://github.com/FormidableLabs/urql). and for model management i decided to run with bookshelf because of its simplicity. finally, for the design and the page layouts i used [material ui](https://material-ui.com/).


## Project Structure

```
turing-fullstack
│    app.js
└───forontend     
│    └──.next
│    └──components
│    └──lib
│    └──pages
│          _app.js
│          _document.js
│    └──static
│      store.js
│
└───models
│    └──graphql
│    └──records
│      index.js
└───plugins
└───services
│       root.js
```

##### /app.js
this is where the project started , it has fastify loading modules and integrations . it has the initilization of the following modules:
* bookshelf mysql connection
* nextjs integration with the server
* registing jwt and auth module for authentication handling
* autoloading services and plugins files from the app and adding static file serving from the frontend

##### /frontend
this folder has all the files served under nextjs, the compiled version of all the files is located under `.next` folder.
* `components` :
   folder that has all React components used in `pages` directory, 
* `lib`:
  has some shared methods used by the components , like validation, formating, persistance
* `pages`:
  every file here except `_app.js` and `_document.js` can be routed by its name , nextjs map the route with the filename, for example, to load the file `products.js` we can just call `/products`, for more detailed routing using paramters, look at the file `services/root.js`.
  the files `_app.js` and `_document.js` are overrided from the basic files used by nextjs, we needed that for `material-ui` and for passing `urql` providers as well as `redux`'s
* `/static`:
this file has the image assets that can be served directely from the server using `fastify-static` using a prefix `/static/`, more details on `app.js`
* `store.js`:
contains all the store management and the application state , it integrates redux with persistance capability, the states that needs to be mapped with the components in a global way and the methods that needs biding with the states. The biding is managed using the function `connect` of `react-redux` (look inside the folder `components` for examples of how to use `connect` and `bindActionCreators` )

#### models
the folder `models` wraps the ORM with graphQl queries and mutations, it integrates `bookshelfjs` and `bookshelfjs-graphql` modules, by declaring the models and their relationships we can automatically use a `resolverFactory` to automatically run queries recursively.

> when fastify is initializing, the application tries to load the models from `models/index.js` and make them accessible all over the application by calling `fastify.models.ModelName`

##### plugins 
this is where we can add decorators or hooks to fastify queries and use them by configuring the request, in this application, the folder `plugin` has only the authentication decorator that verifies the token from `user-key` header attribute. the usage of the decorator is called in `user` and `order` services by adding `preHandler` parameter to the route.

##### /services/root.js
All the application rooting for the frontend and the backend is served by `root.js` , so every root is either to call the API , will be served to nextjs or get handled by graphql server


# API Requests

The API requests used for fetching and saving data , as well the root graphQl queries and mutations.

## graphQl  
The entrypoint of every graphql query is located in `services/root.js` through `POST /graphql` containing `query` and `variables` as parameters.

The root schema of the queries and mutations can be found in `models/graphql/root.js` , 
An example of graphQl request on how to query product with its attributes and attribute_values can be presented as the following
```js
POST /graphQl
PARAMS
{
    variables: {product_id: 1}
    query: `{
				        	product(product_id: 1) { 
				                  product_id, 
				                  name, 
				                  description,
				                  attributes {
				                    name
				                    attribute_values{
				                      attribute_value_id
				                      value
				                    }
				                  }
				            }
				      }`
}
```
looking at the example query above we try to fetch a product , hist attributes and the attribute_values related to the attributes, but the case is to find the attribute_values related to the product in question as well as the attribute requested, this is the responsability of the resolver, the implementation of how the resolver work to find the attribute_values related to the product in question can be found in `models/graphql/attribute.js`

## Root Queries

The table below describe the queries that can be used as roots, to find details about the types , look at the schema inside `models/graphql/{type}`.

### Queries
| Root Query | Result Type | Params | Description
| ------ | ------ | ----- | ----- |
| products | List ProductType| `page: Int!,pageSize: Int!` | fetch all products in certain page number with page size 
| product | ProductType | `product_id: Int!` | fetch product by product_id with `attributes` and `attribute_values` relation if needed
| categories | List CategoryType | | fetch all categories, can use product as relation `categories { products ...}`
| category | CategoryType | `category_id: Int!`| fetch category by its id 
| departments | List DepartmentType |  | fetch all departments , can use categories or products as relation, look at `models/graphql/department.js` for products realtion resolver.
| department | DepartmentType | `department_id: Int!`| fetch department by id 
| attributes | List AttributeType | | fetch all attributes
| attribute | AttributeType | `attribute_id: Int`| fetch attribute by its id
| shopping_cart | List ShoppingCartType | `cart_id: String!` | fetch shoppingcart items by cart_id
| shipping_regions | List ShippingRegionType | | fetch all shipping_regions
| shippings | List ShippingType | `shipping_region_id: Int!`| fetch all shippings

### Mutations
| Root Mutation | Result Type | Params | Description
| ------ | ------ | ----- | -------- |
| add_to_cart | ShoppingCartType | `cart_id: String!, product_id: Int!,quantity: Int!, attributes: String!` | create a new shopping cart item with `cart_id` if it does not exist with the same attributes, otherwise it will increase the quantity of the found shopping cart item (`shopping_cart` table in the db, see `db/tshirtshop.sql`). Returns a shopping cart item.|
update_cart_attribtues | Boolean | `item_id: Int!, attributes: String!` | update the `shopping_cart` attributes field |
| update_cart_quantity | Boolean | `item_id: Int!, quatity: Int!` | set a quantity value for the found `shopping_cart`|
| remove_from_cart | Boolean | `item_id: Int!`| remove shopping cart by its item_id


We should note that all the graphql queries and mutations do not require authorization or any user related queries, to make the request related to user and use authorization we used REST API

## Services

All the application REST request are available under `services` directory


| Method | Request | Params | USER-KEY required | Description
| ------ | ------ | ----- | -------- | ------ |
| POST | /signup | `name, email, password`|no| create a new user or return 'user exist' error |
| POST | /auth | `email, password` |no| authenticate user and return a new signed token so it can be used in `headers['USER-KEY']` |
| POST | /user/address | `customer_id, address_1, address_2, city, postal_code, country, shipping_region_id`| yes | add address information to a user , return `{success: status_update}`
| POST | /order | `cart_id, customer_id, shipping_id` | yes | create order from shopping cart , uses mysql procedure `shopping_cart_create_order`. The tax_id is set to 1 by default in this service for now.|
| POST | /order/cancel | `order_id` | yes | update order status to 2 (cancelled) |
| POST | /order/charge | `order_id, card_name, card_number, expiry_date (mm/yy), cvc` | yes | charge user using stripe api with the order amount and update order status to 1 (confirmed) |

## Work not yet done
 - Blocking bug after few requests (investigating ... )
 - Authentication using social media
 - Unit Test Cases 
 - Still some things to fix (exp: caching user address (can be done using logout and login again))

# Made by
Abdelhay NAJJAR, 
for more details about the project please contact dev.abdelhay@gmail.com




