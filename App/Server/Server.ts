require('dotenv').config({path : './../.env'})
import {WebSocketServer} from 'ws';
import { MessageFactory, MsgEnum } from './factory/factoryMessages';
import { Order } from './model/Order';
import { Recipe_foods } from './model/Recipe_foods';

//PER DOCKER
const wss = new WebSocketServer(`ws://localhost:${process.env.WS_PORT}`);

//PER DEV
//const wss = new WebSocketServer({port: process.env.WS_PORT});

let recived: any;
let weight: number;
let infoIngredients: Array<any> = [];
let count: number = 0;
let factory:MessageFactory  = new MessageFactory();

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
      console.log(`\nOrdine ${order.id} \nDi seguito vengono riportati l'id degli alimenti all'interno della ricetta ordinata con id: ${order.recipe_id} corredati di quantità minima e massima da rispettare`);

      for(let food of infoIngredients){
        console.log(`id: ${food.food_id} , quantità minima: ${Math.round(food.generalMin*100) /100} Kg, quantità massima: ${Math.round(food.generalMax*100) /100} Kg `);
        
      }

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
              count=0; //in caso di fallimento dell'ordine riazzeriamo il count per le future richieste provenienti dal client in quanto non riavviando il server count viene mantenuto all'ultimo valore
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
  if(weight >= infoIngredients[count-1].generalMin && weight <= infoIngredients[count-1].generalMax) {
    return true;
  } else{
    count=0;
    await Order.update({status : "FALLITO"}, {where : {id: recived.id_order}});
    return false;
  } 
}

async function completeOrder(){
  //Cambia lo status dell'ordine in COMPLETATO nel momento in cui il Client_1 comunica di aver terminato tutte le operazioni di carico
  count=0;
  await Order.update({status : "COMPLETATO"}, {where : {id: recived.id_order}});  
}




wss.on('connection', function connection(ws: any) {
  factory.getMessageResponse(MsgEnum.connectionEstablished, ws);
  ws.on('message', async function message(data: any) {
    recived = JSON.parse(data);
  
    switch(recived.operation){
      case 0 :  (await getChargingInfo() === true) ?  factory.getMessageResponse(MsgEnum.getChargingInfoOK, ws, recived, infoIngredients.length) :
                                                      factory.getMessageResponse(MsgEnum.getChargingInfoFAIL, ws, recived);
                break;

      case 1 :  (await checkSorting() === true) ? factory.getMessageResponse(MsgEnum.checkSortingOK, ws, recived, infoIngredients.length) : 
                                                  factory.getMessageResponse(MsgEnum.checkSortingFAIL, ws, recived);
                break;

      case 2 :  (await checkQuantity() === true) ? factory.getMessageResponse(MsgEnum.checkQuantityOK, ws, recived, infoIngredients.length) : 
                                                   factory.getMessageResponse(MsgEnum.checkQuantityFAIL, ws, recived);
                break;

      case 3 :  weight = recived.weight;
                factory.getMessageResponse(MsgEnum.communicateWeight, ws, recived)
                break;

      case 4 :  await completeOrder();
                factory.getMessageResponse(MsgEnum.completeOrderOK, ws, recived)
                break;

      case 5 :  factory.getMessageResponse(MsgEnum.completeOrderFAIL, ws, recived)
                break;

            
    }      
  });
  ws.on('close', function close() {
    console.log("Client disconnesso");
  
  });
});