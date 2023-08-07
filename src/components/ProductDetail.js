import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import '../assets/ProductDetail.css';


function ProductDetail() {
    const { id, storeId } = useParams();
    const [product, setProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prices, setPrices] = useState([]);
    const [message, setMessage] = useState("");


    const handlePriceChange = (event) => {
        setNewPrice(event.target.value);
    };

    const handleUpdatePrice = () => {
        fetch(`http://localhost:5000/stores/${storeId}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: newPrice })
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.Product) {
                    // Fetch the product data again if it was not in the response
                    return fetch(`http://localhost:5000/product/${id}/store/${storeId}/productStore`)
                        .then((res) => res.json());
                }
                return data;
            })
            .then((data) => {
                if (newPrice > 0) {

                    setProduct(data);
                    setMessage("Price updated successfully!");
                    setNewPrice(''); // Clear the input field
                } else {
                    setMessage("Please provide a valid name and price.");
                }
            })
            .catch((error) => console.error('Error:', error));

    };

    useEffect(() => {
        fetch(`http://localhost:5000/product/${id}/store/${storeId}/productStore`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                console.log(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [id, storeId]);

    useEffect(() => {
        if (product) {
            fetch(`http://localhost:5000/products/${id}/prices`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    setPrices(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [id, product]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-details__container">
            <h1 className="product-details__header">{product.Product.name}</h1>
            <img src={product.imagePath ? `http://localhost:5000/${product.imagePath}` : `http://localhost:5000/uploads/placeholder.png`} alt={product.Product.name} className="product-details__image" />
            <p className="product-details__description">Price: ${product.price ? parseFloat(product.price.toFixed(2)) : 0}</p>
            <h2 className="product-details__header-secondary">Other Store Prices</h2>
            <div className="product-details__price-list">
                {
                    prices
                        .filter(price => price.storeId !== Number(storeId)) // exclude current store's price
                        .map(price =>
                            <div key={price.storeId}>
                                <Link to={`/stores/${price.storeId}/product/${id}`}>
                                    <p>{price.storeName}: ${price.price.toFixed(2)}</p>
                                </Link>
                            </div>
                        )
                }
            </div>
            <h2 className="product-details__header-secondary">Price History</h2>
            {/* TODO: Add the chart */}
            <h2 className="product-details__header-secondary">Edit Price</h2>
            <input type="number" value={newPrice} onChange={handlePriceChange} className="product-details__input" />
            <button onClick={handleUpdatePrice} className="product-details__button">Update Price</button>
            {message && <p>{message}</p>}
        </div>
    );
    

}

export default ProductDetail;
