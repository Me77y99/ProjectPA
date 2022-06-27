require('dotenv').config({path : './../.env'});
import { Sequelize } from 'sequelize';

/*
Seguendo il pattern Singleton è stata creata la classe ConnectionDb che instaurerà la connessione
verso il database in modo univoco evitando istanze multiple.
La connesione vera e propria si crea nel costruttore (privato) attraverso l'ORM Sequelize. 
Nell'istanza di tale classe vengono forniti in input tutti i parametri necessari alla connesione.
*/
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

    // Questo metodo evita la creazione di istanze multiple della connessione 
	public static getInstanceConnection(): Sequelize {
        if (!ConnectionDb._instance) {
            this._instance = new ConnectionDb();
        }
        return ConnectionDb._instance.connection;
    }
}