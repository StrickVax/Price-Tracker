import React, { useState, useEffect } from "react";
import '../assets/App.css'

function ProductForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stores, setStores] = useState([]);
    const storeOptions = ["Costco", "WinCo", "Walmart", "El Super"];
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch products from backend when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('An error occurred:', error));
    }, []);

    // Update suggestions when name changes
    useEffect(() => {
        if (name.length > 0) {
            const matchingItems = items.filter((item) =>
                item.name.toLowerCase().startsWith(name.toLowerCase())
            );
            setSuggestions(matchingItems);
        } else {
            setSuggestions([]); // Clear suggestions when there's no input
        }
    }, [name, items]);

    // Sends data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || isNaN(price) || price <= 0) {
            setMessage("Please provide a valid name and price.");
            return;
        }

        const productData = {
            name: name,
            price: parseFloat(price), // Convert the price to a number
        };


        // Create FormData object
        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));
        formData.append('stores', JSON.stringify(stores));
        if (file) {
            formData.append('image', file);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                body: formData, // Use FormData object here
            });
            console.log("Server response:", response);
            const data = await response.json();
            console.log("Server data:", data);

            if (response.ok) {
                // Clear the form
                setName("");
                setPrice("");
                setMessage("Product added successfully!");
            } else {
                // Handle error
                console.log("Name:", name);
                console.log("Price:", price);
                console.log("Stores:", stores);
                console.log("File:", file);

                console.error(data.error);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    // Updates image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFile(file); // Update the file state here
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null)  // Clear the preview if the file input is cleared
        }
    }

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
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <div>
                    {Array.isArray(suggestions) && suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            onClick={() => setName(suggestion.name)}
                        >
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
            <label>
                Image:
                <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                {imagePreview && (
                    <img src={imagePreview} alt="Image Preview" style={{ width: '100px' }} />
                )}
            </label>
            <button type="submit">Add Product</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default ProductForm;
