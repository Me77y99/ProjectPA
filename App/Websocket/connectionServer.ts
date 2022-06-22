require('dotenv').config({path : '../.env'});
import { Sequelize } from 'sequelize';

export class ConnectionDb {
	
    private static _instance: ConnectionDb;
	private connection: Sequelize;

    
    private constructor() {
		this.connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
        {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			dialect: 'mysql'
		});
	}

	public static getInstanceConnection(): Sequelize {
        if (!ConnectionDb._instance) {
            this._instance = new ConnectionDb();
        }
        return ConnectionDb._instance.connection;
    }
}