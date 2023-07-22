import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: 10.99, store: 'Store 1' },
        { id: 2, name: 'Product 2', price: 20.99, store: 'Store 2' },
    ]);

    return (
        <div>
            <h1>Product List</h1>
            {products.map(product => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>{product.price}</p>
                    <p>{product.store}</p>
                    <Link to={`/product/${product.id}`}>AMOG</Link>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
