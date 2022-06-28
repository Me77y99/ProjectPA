import { ConnectionDb } from '../connectionServer';
import { DataTypes, Sequelize } from 'sequelize';

/*
Per interagire con l'ORM Sequelize inizialmente è stata messa l'istanza della 
connessione nella variabile sequelize. 
Di seguito è stato definito il modello per la tabella Recipe_foods specificando gli attributi 
con le relative caratteristiche.
*/
const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Recipe_foods = sequelize.define('Recipe_foods', {
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
    modelName: 'Recipe_foods',
    timestamps: false
});

/*
Il seguente comando di Sequelize rimuove il campo 'id' che avrebbe aggiunto di default l'ORM.
*/
Recipe_foods.removeAttribute('id');