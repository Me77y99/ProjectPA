"use strict";
exports.__esModule = true;
exports.ConnectionDb = void 0;
require('dotenv').config({ path: './../.env' });
var sequelize_1 = require("sequelize");
var ConnectionDb = /** @class */ (function () {
    function ConnectionDb() {
        this.connection = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            dialect: 'mysql',
            logging: false
        });
    }
    ConnectionDb.getInstanceConnection = function () {
        if (!ConnectionDb._instance) {
            this._instance = new ConnectionDb();
        }
        return ConnectionDb._instance.connection;
    };
    return ConnectionDb;
}());
exports.ConnectionDb = ConnectionDb;
