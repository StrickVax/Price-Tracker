const cors = require('cors');
const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');

const app = express();
app.use(cors());
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
    res.send('Welcome to my Price Tracker API!');
});

app.use(express.json());

app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
