import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: 10.99, store: 'Store 1' },
        { id: 2, name: 'Product 2', price: 20.99, store: 'Store 2' },
    ]);

    // Fetch products when the component mounts
    useEffect(() => {
        fetch('/products') // Adjust the URL as needed
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('An error occurred:', error));
    }, []);

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.store]) {
            acc[product.store] = [];
        }
        acc[product.store].push(product);
        return acc;
    }, {});

    return (
        <div>
            <h1>Product List</h1>
            <Link to="/add-product">
                <button>Add Item</button>
            </Link>
            {Object.keys(groupedProducts).map(storeName => (
                <div key={storeName}>
                    <h2>{storeName}</h2>
                    {groupedProducts[storeName].map(product => (
                        <div key={product.id}>
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <Link to={`/product/${product.id}`}>View Details</Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default ProductList;
