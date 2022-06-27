import { ConnectionDb } from '../connectionServer';
import { DataTypes, Sequelize} from 'sequelize';

/*
Per interagire con l'ORM Sequelize inizialmente è stata messa l'istanza della 
connessione nella variabile sequelize. 
Di seguito è stato definito il modello per la tabella Recipe specificando gli attributi 
con le relative caratteristiche.
*/ 
const sequelize: Sequelize = ConnectionDb.getInstanceConnection();

export const Recipe = sequelize.define('recipe', {
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
    modelName: 'recipe',
    timestamps: false
});