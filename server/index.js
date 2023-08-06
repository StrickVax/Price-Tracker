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
ProductStore.init({
    price: DataTypes.FLOAT
}, {
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
app.get('/stores/:storeId/products/:productId', async (req, res) => {
    try {
        const { storeId, productId } = req.params;
        const product = await Product.findByPk(productId, {
            include: [{
                model: Store,
                where: { id: storeId },
                through: {
                    attributes: ['price'] // Include the price from the join table
                }
            }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found in store' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



// Sends the data to the frontend
app.post('/products', upload.single('image'), async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const productData = JSON.parse(req.body.product);
        const storesData = JSON.parse(req.body.stores);


        if (req.file) {
            productData.imagePath = req.file.path; // Add the image path if the file exists
        }

        let product = await Product.findOne({ where: { name: productData.name } });
        if (!product) {
            // If the product does not exist, create it
            product = await Product.create(productData, { transaction });
        }
        // If the product exists, the existing product is used

        const stores = storesData.map(storeName => ({ name: storeName }));
        const storeRecords = await Store.bulkCreate(stores, { transaction, ignoreDuplicates: true });

        // Add the stores to the product and specify the price
        for (const storeRecord of storeRecords) {
            await product.addStore(storeRecord, { through: { price: productData.price }, transaction });
        }

        await transaction.commit();
        res.status(201).json(product);
    } catch (err) {
        await transaction.rollback();
        console.error(err); // Log the entire error object
        res.status(500).json({ error: err.message });

    }
    console.log("Request body:", req.body);

});

// If the product already exists, and you want to update the price
app.put('/stores/:storeId/products/:productId', async (req, res) => {
    try {
        const { storeId, productId } = req.params;
        const { price } = req.body;
        const productStore = await ProductStore.findOne({ where: { StoreId: storeId, ProductId: productId } });

        if (!productStore) {
            return res.status(404).json({ message: 'Product not found in store' });
        }

        productStore.price = price;
        await productStore.save();

        res.json(productStore);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
