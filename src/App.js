import React from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './assets/App.css';


function App() {
  return (
    <div className='App'>
      <ProductList />
      <ProductDetail />
    </div>
  );
}

export default App;
