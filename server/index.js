const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');

const app = express();
const port = process.env.PORT || 5000;

// Configure SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Define a "Product" model
class Product extends Model { }

Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'Product'
});

sequelize.sync();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
