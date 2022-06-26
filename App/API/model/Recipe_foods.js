"use strict";
exports.__esModule = true;
exports.Recipe_foods = void 0;
var connectionAPI_1 = require("../connectionAPI");
var sequelize_1 = require("sequelize");
var sequelize = connectionAPI_1.ConnectionDb.getInstanceConnection();
exports.Recipe_foods = sequelize.define('Recipe_foods', {
    recipe_id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    food_id: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    sort: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    rate: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    }
}, {
    modelName: 'Recipe_foods',
    timestamps: false
});
exports.Recipe_foods.removeAttribute('id');