import React, { useState, useEffect } from "react";

function ProductForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stores, setStores] = useState([]);
    const storeOptions = ["Costco", "WinCo", "Walmart", "El Super"];
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch products from backend when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('An error occurred:', error));
    }, []);


    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        const newSuggestions = items.filter((item) => item.name.startsWith(value));
        setSuggestions(newSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setName(suggestion.name);
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || isNaN(price) || price <= 0) {
            setMessage("Please provide a valid name and price.");
            return;
        }

        const productData = { name, price: parseFloat(price, 10) };
        const body = JSON.stringify({ product: productData, stores }); // both product and stores

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
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

    // Frontend display
    return (
        <form onSubmit={handleSubmit} className="product-form">
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    required
                />
                <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.name}
                        </div>
                    ))}
                </div>
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
