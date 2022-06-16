import { ConnectionDb } from '../connection';
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER(),
        allowNull: false
    }
}, 
{
    modelName: 'Food',
    timestamps: false
});