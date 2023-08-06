const cors = require('cors');
const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Configure SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Component that lets users upload photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Define a "Product" model
class Product extends Model { }
Product.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    imagePath: DataTypes.STRING,
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

// lets images be access with urls
app.use('/uploads', express.static('uploads'));

// Gets the data from the database
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
        console.error(err); // Log the entire error object
        res.status(500).json({ error: err.message });

    }
});

// Gets a single product from the database
app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id; // Get the id from the request parameters
        const product = await Product.findOne({
            where: {
                id: id
            },
            include: {
                model: Store,
                through: {
                    attributes: [] // Exclude the join table from the result
                }
            }
        });

        if (product) {
            res.json(product);
        } else {
            // If no product was found, send a 404 response
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error(err); // Log the entire error object
        res.status(500).json({ error: err.message });
    }
});


// Sends the data to the frontend
app.post('/products', upload.single('image'), async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        const productData = JSON.parse(req.body.product);
        console.log('Parsed product data:', productData);

        const storesData = JSON.parse(req.body.stores);
        console.log('req.body.stores:', req.body.stores);
        console.log('Parsed stores data:', storesData);


        if (req.file) {
            productData.imagePath = req.file.path; // Add the image path if the file exists
        }

        const product = await Product.create(productData, { transaction });
        const stores = storesData.map(storeName => ({ name: storeName }));
        console.log('Mapped stores:', stores);
        const storeRecords = await Store.bulkCreate(stores, { transaction, ignoreDuplicates: true });
        await product.addStores(storeRecords, { transaction });

        await transaction.commit();
        res.status(201).json(product);
    } catch (err) {
        await transaction.rollback();
        console.error(err); // Log the entire error object
        res.status(500).json({ error: err.message });

    }
    console.log("Request body:", req.body);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
