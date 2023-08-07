import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/ProductList.css';

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
            acc[store.name].push({
                ...product,
                storeId: store.id, // Include the store ID in the product object
                price: store.ProductStore.price ? parseFloat(store.ProductStore.price.toFixed(2)) : 0,
                ProductStore: store.ProductStore, // include ProductStore in the object
            });
        });
        return acc;
    }, {});
    

    const storeOrder = ['Costco', 'WinCo', 'Walmart', 'El Super'];

    return (
        <div>
            <h1 className="product-list__header">Product List</h1>
            <Link to="/add-product">
                <button className="product-list__button">Add Item</button>
            </Link>
            {
                Object.keys(groupedProducts).sort((a, b) => storeOrder.indexOf(a) - storeOrder.indexOf(b)).map((storeName) => (
                    <div className="product-list__section" key={storeName}>
                        <h2 className="product-list__header-secondary">{storeName}</h2>
                        <div className="product-list__row">
                            {groupedProducts[storeName].map((product) => (
                                <div key={product.id} className="product-list__item">
                                    <img src={product.ProductStore.imagePath ? `http://localhost:5000/${product.ProductStore.imagePath}` : `http://localhost:5000/uploads/placeholder.png`} alt={product.name} className="product-list__image" />
                                    <h3>{product.name}</h3>
                                    <p>Price: ${product.price.toFixed(2)}</p>
                                    <Link to={`/stores/${product.storeId}/product/${product.id}`} className="product-list__link">View details</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    );



}

export default ProductList;
