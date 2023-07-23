import React, { useState } from 'react';

function ProductForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const product = { name, price: parseInt(price, 10) };

        try {
            const response = await fetch('http://localhost:5000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear the form
                setName('');
                setPrice('');
            } else {
                // Handle error
                console.error(data.error);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <button type="submit">Add Product</button>
        </form>
    );
}

export default ProductForm;
