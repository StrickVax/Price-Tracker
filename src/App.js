import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/stores/:storeId/product/:id" element={<ProductDetail />} />
                    <Route path="/add-product" element={<ProductForm />} />
                    <Route path="/" element={<ProductList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
