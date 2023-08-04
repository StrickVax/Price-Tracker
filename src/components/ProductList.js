import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);

    // Fetch products from backend when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched products:", data); // Debugged
                setProducts(data);
            })
            .catch((error) => console.error('An error occurred:', error));
    }, []);


    // Group producrs by store
    const groupedProducts = products.reduce((acc, product) => {
        product.Stores.forEach((store) => {
            if (!acc[store.name]) {
                acc[store.name] = [];
            }
            acc[store.name].push({ ...product, price: parseFloat(product.price.toFixed(2)) });
        });
        return acc;
    }, {});

    return (
        <div>
            <h1>Product List</h1>
            <Link to="/add-product">
                <button>Add Item</button>
            </Link>
            {Object.keys(groupedProducts).map((storeName) => (
                <div className="store-section" key={storeName}>
                    <h2>{storeName}</h2>
                    <div className="products-row">
                        {groupedProducts[storeName].map((product) => (
                            <div key={product.id} className="product-item">
                                <img src="placeholder-image.png" alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>Price: {product.price.toFixed(2)}</p>
                                <Link to={`/product/${product.id}`}>View Details</Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}

export default ProductList;
