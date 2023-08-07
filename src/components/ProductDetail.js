import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

function ProductDetail() {
    const { id, storeId } = useParams();
    const [product, setProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prices, setPrices] = useState([]);


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
                setProduct(data);
                setNewPrice(''); // Clear the input field
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
        <div>
            <h1>{product.Product.name}</h1>
            <img src={product.imagePath ? `http://localhost:5000/${product.imagePath}` : `http://localhost:5000/uploads/placeholder.png`} alt={product.Product.name} />
            <p>Price: ${product.price ? parseFloat(product.price.toFixed(2)) : 0}</p>
            <h2>Other Store Prices</h2>
            {
                prices.map(price =>
                    <div key={price.storeId}>
                        <p>{price.storeName}: ${price.price.toFixed(2)}</p>
                    </div>
                )
            }
            <h2>Price History</h2>
            {/* TODO: Add the chart */}
            <h2>Edit Price</h2>
            <input type="number" value={newPrice} onChange={handlePriceChange} />
            <button onClick={handleUpdatePrice}>Update Price</button>
        </div>
    );
}

export default ProductDetail;
