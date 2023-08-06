# Price Comparison App

This project is a full stack web application for comparing prices of products from different stores. The frontend is built with React, and the backend uses Express and SQLite.

## Installation

To get started with this project:

1. Clone this repository.
2. Install dependencies in both the root directories with `npm install`.
3. Make sure you have SQLite installed locally, or configure the connection in `server/database.js` to point to a SQLite instance.
4. In the `root` directory, start the server with `npm start`.

## File Structure

The project is organized into two main directories, `server` and `src` (frontend).

### Server

The `server` directory contains the Express backend server.

- `models/product.js`: This file defines the SQLite schema for products.
- `uploads`: This directory is where uploaded product images are stored.
- `database.js`: This file sets up the connection to the SQLite database.
- `database.sqlite`: This is the SQLite database file.
- `index.js`: This is the main server file that initializes Express and connects to the SQLite database.

### Src

The `src` directory contains the React frontend application.

- `components/ProductForm.jsx`: This is the form for adding a new product.
- `components/ProductList.js`: This is the component that displays a list of all products, grouped by store.
- `components/ProductDetails.js`: This is the component that displays the details of a product.
- `assets`: This directory contains CSS files for the application.
- `App.js`: This is the main component that renders the product form and list.
- `index.js`: This is the entry point for the React application.

## Features

- Add a product with a name, price, stores where it's available, and an optional image.
- View a list of all products, grouped by store.
- View product details with images, price and store availability.
- See an image preview when adding or updating a product.
- Automatic price conversion and formatting.

## Future Features

- Duplicate product detection based on product name.
- User authentication and authorization.
- More detailed product information.
- Comparisons between different products.
- Integration with real store data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.