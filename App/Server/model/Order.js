"use strict";
exports.__esModule = true;
exports.Order = void 0;
var connectionServer_1 = require("../connectionServer");
var sequelize_1 = require("sequelize");
var sequelize = connectionServer_1.ConnectionDb.getInstanceConnection();
exports.Order = sequelize.define('Order', {
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    recipe_id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    }
}, {
    modelName: 'Order',
    timestamps: false
});
