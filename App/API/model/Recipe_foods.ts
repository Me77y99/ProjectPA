import { ConnectionDb } from '../connectionAPI';
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Recipe_foods = sequelize.define('recipe_foods', {
    recipe_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    food_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    sort: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    rate: {
        type: DataTypes.INTEGER(),
        allowNull: false
    }
}, 
{
    modelName: 'recipe_foods',
    timestamps: false
});

Recipe_foods.removeAttribute('id');