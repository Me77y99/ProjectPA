import { ConnectionDb } from '../connectionServer';
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
        get() {
            const rawValue = this.getDataValue('id');
            return rawValue ? rawValue : null;
        }
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    }
}, 
{   
    tableName: 'Foods',
    timestamps: false
});