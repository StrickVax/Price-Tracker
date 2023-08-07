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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Define a "Product" model
class Product extends Model { }
Product.init({
    name: DataTypes.STRING,
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

const ProductStore = sequelize.define('ProductStore', {
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING
    }
});


// Allow us to have multiple entries for the same product-store relationship, but with different prices.
Product.belongsToMany(Store, { through: ProductStore });
Store.belongsToMany(Product, { through: ProductStore });

ProductStore.belongsTo(Product);
ProductStore.belongsTo(Store);

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
                    attributes: ['price', 'imagePath'] // Include price and imagePath
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
app.get('/product/:productId/store/:storeId/productStore', async (req, res) => {
    const { productId, storeId } = req.params;

    try {
        const productStore = await ProductStore.findAll({
            where: {
                ProductId: productId,
                StoreId: storeId
            },
            include: [
                {
                    model: Product,
                    where: { id: productId }
                },
                {
                    model: Store,
                    where: { id: storeId }
                }
            ]
        });

        if (productStore && productStore.length > 0) {
            return res.status(200).json(productStore[0]);
        } else {
            return res.status(404).json({ message: "Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
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
            // If the product does not exist, create it with just the name
            product = await Product.create({ name: productData.name }, { transaction });
        }

        for (const storeName of storesData) {
            let storeRecord = await Store.findOne({ where: { name: storeName } });

            if (!storeRecord) {
                // If the store does not exist, create it
                storeRecord = await Store.create({ name: storeName }, { transaction });
            }

            const [storeProduct, created] = await ProductStore.findOrCreate({
                where: { ProductId: product.id, StoreId: storeRecord.id },
                defaults: { price: productData.price, imagePath: req.file ? req.file.path : null },
                transaction,
            });

            if (!created) {
                // If the product exists in the store, update its price and imagePath
                storeProduct.price = productData.price;
                if (req.file) {
                    storeProduct.imagePath = req.file.path;
                }
                await storeProduct.save({ transaction });
            }
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

// Gets the prices of a product from all stores
app.get('/products/:productId/prices', async (req, res) => {
    const { productId } = req.params;

    try {
        const productStores = await ProductStore.findAll({
            where: { ProductId: productId },
            include: Store
        });

        if (productStores) {
            return res.status(200).json(productStores.map(ps => ({
                storeId: ps.Store.id,
                storeName: ps.Store.name,
                price: ps.price
            })));
        } else {
            return res.status(404).json({ message: "Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
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
