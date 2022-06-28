import { ConnectionDb } from '../connectionServer';
import { DataTypes, Sequelize} from 'sequelize';

/*
Per interagire con l'ORM Sequelize inizialmente è stata messa l'istanza della 
connessione nella variabile sequelize. 
Di seguito è stato definito il modello per la tabella User specificando gli attributi 
con le relative caratteristiche.
*/
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
