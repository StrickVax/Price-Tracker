const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {});

module.exports = Product;
