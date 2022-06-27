import { ConnectionDb } from '../connectionAPI';
import { DataTypes, Sequelize } from 'sequelize';


/*
Per interagire con l'ORM Sequelize inizialmente è stata messa l'istanza della 
connessione nella variabile sequelize. 
Di seguito è stato definito il modello per la tabella Food specificando gli attributi 
con le relative caratteristiche.
*/ 
const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Food = sequelize.define('food', {
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
    tableName: 'food',
    timestamps: false
});