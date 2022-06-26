"use strict";
exports.__esModule = true;
exports.Recipe = void 0;
var connectionAPI_1 = require("../connectionAPI");
var sequelize_1 = require("sequelize");
var sequelize = connectionAPI_1.ConnectionDb.getInstanceConnection();
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
