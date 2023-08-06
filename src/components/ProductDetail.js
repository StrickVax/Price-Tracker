import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

function ProductDetail() {
    const { id, storeId } = useParams();
    const [product, setProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                // Update the product data in the state
                setProduct(data);
                setNewPrice(''); // Clear the input field
            });
    };

    useEffect(() => {
        fetch(`http://localhost:5000/stores/${storeId}/product/${id}`)
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


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.imagePath ? `http://localhost:5000/${product.imagePath}` : `http://localhost:5000/uploads/image-1691134764415.png`} alt={product.name} />
            <p>Price: ${product.Stores[0].ProductStore.price.toFixed(2)}</p>
            <h2>Other Store Prices</h2>
            {/* Iterate over other store prices here */}
            <h2>Price History</h2>
            <h2>Edit Price</h2>
            <input type="number" value={newPrice} onChange={handlePriceChange} />
            <button onClick={handleUpdatePrice}>Update Price</button>
        </div>
    );
}

export default ProductDetail;
