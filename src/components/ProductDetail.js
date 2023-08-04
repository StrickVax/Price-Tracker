import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Replace with your actual API call
        fetch(`http://localhost:5000/products`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);

            });
    }, [id]);

    return (
        <div>
            <h1>{product.name}</h1>
            <img src="placeholder-image.png" alt={product.name} />
            <p>Price: ${product.price.toFixed(2)}</p>
            <h2>Other Store Prices</h2>
            {/* Iterate over other store prices here */}
            <h2>Price History</h2>
            <Line data={chartData} />
        </div>
    );
}

export default ProductDetail;
