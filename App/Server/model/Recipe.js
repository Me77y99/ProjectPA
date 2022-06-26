"use strict";
exports.__esModule = true;
exports.Recipe = void 0;
var connectionServer_1 = require("../connectionServer");
var sequelize_1 = require("sequelize");
var sequelize = connectionServer_1.ConnectionDb.getInstanceConnection();
exports.Recipe = sequelize.define('Recipe', {
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
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    modelName: 'Recipe',
    timestamps: false
});
