import React, { useState } from "react";

function ProductForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState("");

    const storeOptions = ["Costco", "WinCo", "Walmart", "El Super"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || isNaN(price) || price <= 0) {
            setMessage("Please provide a valid name and price.");
            return;
        }

        const product = { name, price: parseInt(price, 10), stores: JSON.stringify(stores) };

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear the form
                setName("");
                setPrice("");
                setMessage("Product added successfully!");
            } else {
                // Handle error
                console.error(data.error);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleStoreChange = (e) => {
        const selectedStores = Array.from(e.target.selectedOptions, option => option.value);
        setStores(selectedStores);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" step="0.01" />
            </label>
            <label>
                Stores:
                <select multiple onChange={handleStoreChange}>
                    {storeOptions.map(store => (
                        <option key={store} value={store}>{store}</option>
                    ))}
                </select>
            </label>
            <button type="submit">Add Product</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default ProductForm;
