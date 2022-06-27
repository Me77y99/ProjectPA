import { ConnectionDb } from '../connectionAPI';
import { DataTypes, Sequelize} from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const User = sequelize.define('user', {
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
    modelName: 'user',
    timestamps: false
});
