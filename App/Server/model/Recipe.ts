import { ConnectionDb } from '../connectionServer';
import { DataTypes, Sequelize} from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Recipe = sequelize.define('Recipe', {
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
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, 
{
    modelName: 'Recipe',
    timestamps: false
});