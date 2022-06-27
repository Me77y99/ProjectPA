import { ConnectionDb } from '../connectionAPI';
import { DataTypes, Sequelize } from 'sequelize';

/*
Per interagire con l'ORM Sequelize inizialmente è stata messa l'istanza della 
connessione nella variabile sequelize. 
Di seguito è stato definito il modello per la tabella Order specificando gli attributi 
con le relative caratteristiche.
*/
const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Order = sequelize.define('order', {
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
    modelName: 'order',
    timestamps: false
});
