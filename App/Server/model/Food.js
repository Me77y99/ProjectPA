"use strict";
exports.__esModule = true;
exports.Food = void 0;
var connectionServer_1 = require("../connectionServer");
var sequelize_1 = require("sequelize");
var sequelize = connectionServer_1.ConnectionDb.getInstanceConnection();
exports.Food = sequelize.define('Food', {
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
        get: function () {
            var rawValue = this.getDataValue('id');
            return rawValue ? rawValue : null;
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'Foods',
    timestamps: false
});
