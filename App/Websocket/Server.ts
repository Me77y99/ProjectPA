require('dotenv').config({path : './../../.env'})
import { Observable } from 'rxjs';
import {WebSocketServer} from 'ws';
import { Order } from './model/Order';
import { Recipe_foods } from './model/Recipe_foods';



async function getChargingInfo(){
    
    let infoIngredients: Array<any> = [];
    let err_per: number = Number(process.env.ERROR_PERCENTAGE);
    let quantityFoodToTake: number, quantityMin: number, quantityMax: number, generalMin: number = 0, generalMax: number = 0;

    let order : any = await Order.findOne({where:{id: recived.id_order}, raw: true, plain:true});
    let recipeFoods : Array<any> = await Recipe_foods.findAll({where: {recipe_id: order.recipe_id}, raw:true});
    console.log(order, recipeFoods);

    infoIngredients = recipeFoods.map(food =>{
      quantityFoodToTake = (Number(order.quantity)*food.rate)/100;
      console.log(quantityFoodToTake);
      quantityMin = quantityFoodToTake - (quantityFoodToTake * err_per ) /100;
      quantityMax = quantityFoodToTake + (quantityFoodToTake * err_per ) /100;
      generalMin = generalMin + quantityMin;
      generalMax = generalMax + quantityMax;
      return({food_id: food.food_id, sort: food.sort, generalMin: generalMin, generalMax: generalMax})
    })

    console.log(infoIngredients);  
};

function checkSorting(){
  //Controlla che l'id del food inviato dal client che entra in una zonda di carico di un alimento
  //In caso di ingresso in una zona errata cambia lo status dell'ordine in FALLITO e arresta il client
}

function checkQuantity(){
  //Controlla che l'ultima quantità misurata dalla bilancia rientri nei limiti Min Max dello step dell'ordine
  //Viene chiamata nel momento in cui il Client_1 comunica l'uscita dalla zona di carico
  //In caso di peso non conforme cambia lo status dell'ordine in FALLITO e arresta il client
}

function completeOrder(){
  //Cambia lo status dell'ordine in COMPLETATO nel momento in cui il Client_1 comunica di aver terminato tutte le operazioni di carico
}

const wss = new WebSocketServer({port: process.env.WS_PORT});
let recived: any;

const foo = new Observable(subscriber => {
  setInterval(() => {
    subscriber.next("Connessione Stabilita"); // happens asynchronously
  }, 1000);
});

wss.on('connection', function connection(ws: any) {
  console.log("CIAO CIAO");
  //foo.subscribe( value => {ws.send(value); console.log("sent...")});
  ws.send(JSON.stringify("Connessione Stabilita"));
  ws.on('message', async function message(data) {
    recived = JSON.parse(data);
    switch(recived.operation){
      case 0 : getChargingInfo();
               break;
      case 1 : checkSorting();
               console.log(`Sei entrato nella zona dell'alimento con id: ${recived.id_alimento}`)
               break;
      case 2 : checkQuantity();
               break;  
      case 3 : completeOrder();
               break;
    }         
  });
});



 /*
    METODO CON QUERY RAW PERCHÈ CON ALTRA ARCHITETTURA NON FUNZIONAVANO I MODEL.
    
    //import { Sequelize } from 'sequelize';
    //import { ConnectionDb } from './connectionServer';

    //let sequelize :Sequelize = ConnectionDb.getInstanceConnection();
    
    let order : any = await sequelize.query(`SELECT * FROM orders WHERE id = ${recived.Id_order}`, {
      model: Order,
      mapToModel: true,
      raw: true,
      plain: true
    });
    
    let recipeFoods : any = await sequelize.query(`SELECT * FROM recipe_foods WHERE recipe_id = ${order.Recipe_id}`, {
      model: Recipe_foods,
      mapToModel: true,
      raw: true,
    });
    console.log(recipeFoods)
    */