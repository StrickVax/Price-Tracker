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
    price: DataTypes.FLOAT,
}, {
    sequelize,
    modelName: 'Product'
});

class Store extends Model { }
Store.init({
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'Store'
});

class ProductStore extends Model { }
ProductStore.init({}, {
    sequelize,
    modelName: 'ProductStore'
});

Product.belongsToMany(Store, { through: ProductStore });
Store.belongsToMany(Product, { through: ProductStore });

sequelize.sync();

app.get('/', (req, res) => {
    res.send('Welcome to my Price Tracker API!');
});

app.use(express.json());

app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Store,
                through: {
                    attributes: [] // Exclude the join table from the result
                }
            }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});



app.post('/products', async (req, res) => {
    console.log(req.body);
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.create(req.body.product, { transaction });
        const stores = req.body.stores.map(storeName => ({ name: storeName }));
        const storeRecords = await Store.bulkCreate(stores, { transaction, ignoreDuplicates: true });
        await product.addStores(storeRecords, { transaction });

        await transaction.commit();
        res.status(201).json(product);
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
