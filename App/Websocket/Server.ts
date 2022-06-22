require('dotenv').config({path : './../../.env'})
import { Observable } from 'rxjs';
import {WebSocketServer} from 'ws';
import { Food } from './model/Food';
import { Order } from './model/Order';
import { Recipe_foods } from './model/Recipe_foods';

const wss = new WebSocketServer({port: process.env.WS_PORT});
let recived: any;
let weight: number;
let infoIngredients: Array<any> = [];
let count: number = 0;

async function getChargingInfo(){
    
    let err_per: number = Number(process.env.ERROR_PERCENTAGE);
    let quantityFoodToTake: number, quantityMin: number, quantityMax: number, generalMin: number = 0, generalMax: number = 0;
    let recipeFoods : Array<any>;

    let order : any = await Order.findOne({where:{id: recived.id_order}, raw: true, plain:true});
    
    if(order.status == "CREATO"){
      recipeFoods = await Recipe_foods.findAll({where: {recipe_id: order.recipe_id}, raw:true});
      infoIngredients = recipeFoods.map(food =>{
            quantityFoodToTake = (Number(order.quantity)*food.rate)/100;
            quantityMin = quantityFoodToTake - (quantityFoodToTake * err_per ) /100;
            quantityMax = quantityFoodToTake + (quantityFoodToTake * err_per ) /100;
            generalMin = generalMin + quantityMin;
            generalMax = generalMax + quantityMax;
            return({food_id: food.food_id, sort: food.sort, generalMin: generalMin, generalMax: generalMax});
      })
      console.log(infoIngredients);
      
      await Order.update({status : "IN ESECUZIONE"}, {where : {id: recived.id_order}});
      return true;
    } else{
      return false;
    }
};

async function checkSorting(){
    let order : any = await Order.findOne({where:{id: recived.id_order}, raw: true, plain:true});
    if(order.status === "IN ESECUZIONE"){  
              let food_sorting = infoIngredients.map(food =>{
                      return({food_id: food.food_id, sort: food.sort});
                })
            count++;

            let roundFood: any = food_sorting.find((food) => {return food.sort === count});

            // in roundFood ci sarà ogni volta l'alimento a cui si verifica il sort
            if(roundFood.food_id === recived.id_alimento){
              return true;
            } else { 
              await Order.update({status : "FALLITO"}, {where : {id: recived.id_order}});
              return false;
            }
} else {
    return false;
}
}

async function checkQuantity(){
  //Controlla che l'ultima quantità misurata dalla bilancia rientri nei limiti Min Max dello step dell'ordine
  //Viene chiamata nel momento in cui il Client_1 comunica l'uscita dalla zona di carico
  //In caso di peso non conforme cambia lo status dell'ordine in FALLITO e arresta il client
}

async function completeOrder(){
  //Cambia lo status dell'ordine in COMPLETATO nel momento in cui il Client_1 comunica di aver terminato tutte le operazioni di carico
  await Order.update({status : "COMPLETATO"}, {where : {id: recived.id_order}});
}


wss.on('connection', function connection(ws: any , req:any) {
  ws.send(JSON.stringify("Connessione Stabilita"));
  ws.on('message', async function message(data: any) {
    recived = JSON.parse(data);
  
      switch(recived.operation){
        case 0 :  (await getChargingInfo() === true) ? ws.send(JSON.stringify(`Ordine ${recived.id_order} preso in carico`)) : 
                                             ws.send(JSON.stringify(`Ordine ${recived.id_order} è già stato preso in carico precedentemente`));
                 break;
        case 1 :  (await checkSorting() === true) ? ws.send(JSON.stringify(`Sei entrato nella zona dell'alimento con id: ${recived.id_alimento}`)) : 
                                   ws.send(JSON.stringify(`Sei entrato nella zona di carico sbagliato ferma tutto, l'ordine è fallito`));
                 break;
        case 2 :  checkQuantity() ? ws.send(JSON.stringify(`Sei uscito nella zona dell'alimento con id: ${recived.id_alimento}`)) : 
                                    ws.send(JSON.stringify(`Sei entrato nella zona di carico sbagliato ferma tutto, l'ordine è fallito`));
                 break;  
        case 3 :  completeOrder();
                 break;
        case 4 : weight = recived.weight;
                 console.log(weight);
                 break;
      
      
    }      
  
  });
});