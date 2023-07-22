import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './assets/App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />


        <Route path="/product/:productID" element={<ProductDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
