"use strict";
exports.__esModule = true;
exports.User = void 0;
var connectionAPI_1 = require("../connectionAPI");
var sequelize_1 = require("sequelize");
var sequelize = connectionAPI_1.ConnectionDb.getInstanceConnection();
exports.User = sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    modelName: 'User',
    timestamps: false
});
