import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/product/${id}`)
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
    }, [id]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.imagePath ? `http://localhost:5000/${product.imagePath}` : `http://localhost:5000/uploads/image-1691134764415.png`} alt={product.name} />
            <p>Price: ${product.price.toFixed(2)}</p>
            <h2>Other Store Prices</h2>
            {/* Iterate over other store prices here */}
            <h2>Price History</h2>
        </div>
    );
}

export default ProductDetail;
