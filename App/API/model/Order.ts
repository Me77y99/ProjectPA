import { ConnectionDb } from '../connectionAPI';
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    recipe_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, 
{
    modelName: 'Order',
    timestamps: false
});
