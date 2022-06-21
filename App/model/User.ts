import { ConnectionDb } from '../connection';
import { DataTypes, Sequelize} from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, 
{
    modelName: 'User',
    timestamps: false
});
