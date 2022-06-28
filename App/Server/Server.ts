require('dotenv').config({path : './../.env'})
import {WebSocketServer} from 'ws';
import { MessageFactory, MsgEnum } from './factory/factoryMessages';
import { Order } from './model/Order';
import { Recipe_foods } from './model/Recipe_foods';

//DEFINIZIONE DELLA PORTA DI ASCOLTO SIA PER DOCKER SIA IN FASE DI SVILUPPO
const wss = new WebSocketServer({port: process.env.WS_PORT});

const factory:MessageFactory  = new MessageFactory();

/*
Funzione che viene chiamata ogni volta che il client invia al server un messaggio con valore di operation pari a 0, che equivale
al comunicare al server che si sta per predere in carico un ordine, e l'id dell'ordine che il client vuole prendere in carico.
Al suo interno il server come primissima cosa trova nel database l'ordine corrispondente all'id ricevuto; controlla che lo status
dell'ordine sia CREATO e in caso positivo popola un array di oggetti con tutti gli alimenti che fanno parte della ricetta richiesta nell'ordine
e tramite una funzione di map lo modifica popolandolo di oggetti compostida:
- Id del singolo alimento,
- Numero di sorting dell'alimento per l'esecuzione della ricetta,
- Quantità minima obbligatoria sulla bilancia al termine della fase di carico dell'alimento, 
- Quantità massima consentita sulla bilancia al termine della fase di carico dell'alimento.
Una volta terminato di popolare l'array, il server stampa a schermo i dettagli appena calcolati.
Infine aggiorna lo status dell'ordine nel database da CREATO a IN ESECUZIONE e ritorna in risposta un oggetto composto di due attributi:
- Ingredients: contenente l'array calcolato precedentemente
- Result: per effettuare il controllo nell'if all'interno dello switch.
Nel caso in cui l'ordine fosse già stato preso in carico viene direttamente ritornato allo switch un oggetto con il solo result a false.
*/
async function getChargingInfo(recived : any){
    
    let err_per: number = Number(process.env.ERROR_PERCENTAGE);
    let quantityFoodToTake: number, quantityMin: number, quantityMax: number, generalMin: number = 0, generalMax: number = 0;
    let recipeFoods : Array<any>;

    let order : any = await Order.findOne({where:{id: recived.id_order}, raw: true, plain:true});
    
    if(order.status == "CREATO"){
      recipeFoods = await Recipe_foods.findAll({where: {recipe_id: order.recipe_id}, raw:true});
      recipeFoods = recipeFoods.map(food =>{
            quantityFoodToTake = (Number(order.quantity)*food.rate)/100;
            quantityMin = quantityFoodToTake - (quantityFoodToTake * err_per ) /100;
            quantityMax = quantityFoodToTake + (quantityFoodToTake * err_per ) /100;
            generalMin = generalMin + quantityMin;
            generalMax = generalMax + quantityMax;
            return({food_id: food.food_id, sort: food.sort, generalMin: generalMin, generalMax: generalMax});
      })
      console.log(`\nOrdine ${order.id} \nDi seguito vengono riportati l'id degli alimenti all'interno della ricetta ordinata con id: ${order.recipe_id} corredati di quantità minima e massima da rispettare`);

      for(let food of recipeFoods){
        console.log(`id: ${food.food_id} , quantità minima: ${Math.round(food.generalMin*100) /100} kg, quantità massima: ${Math.round(food.generalMax*100) /100} kg `);
        
      }

      await Order.update({status : "IN ESECUZIONE"}, {where : {id: recived.id_order}});
      return {ingredients: recipeFoods, result: true};
    } else{
      return {result: false};
    }
};

/*
Questa funzione è adibita al controllo della corretta esecuzione della sequenza di carico stabilita nella ricetta all'interno del DB.
Il server estrae l'ordine richiesto dal client, ne verifica lo status IN ESECUZIONE, in caso positivo popola un array contenente l'id e il relativo
valore di ordinamento di ogni singolo alimento all'interno della ricetta; mentre in caso negativo viene ritornato un oggetto con un attributo result uguale a false.
Inserisce in una variabile l'alimento che andrebbe processato nella fase comunicata dal client tramite l'attributo index.
(tale valore viene incrementato di 1 unità in quanto nel client parte con valore 0 e i valori di sort nel db partono da 1)
Infine il server verifica che l'id dell'alimento che dovrebbe essere processato è uguale all'id dell'alimento che il client ha comunicato di
voler caricare.
In caso affermativo viene ritornato un oggetto composto da due attributi:
- Ingredients: contenente l'array calcolato precedentemente
- Result: per effettuare il controllo nell'if all'interno dello switch.
Nel caso in cui l'ordine di esecuzione non fosse rispettato viene direttamente ritornato allo switch un oggetto con il solo result a false.
*/
async function checkSorting(recived : any){
    let order : any = await Order.findOne({where:{id: recived.id_order}, raw: true, plain:true});
    if(order.status === "IN ESECUZIONE"){  
              let food_sorting = recived.foods.map((food: any) =>{
                      return({food_id: food.food_id, sort: food.sort});
                })

            let roundFood: any = food_sorting.find((food: any) => {return food.sort === recived.index+1});

            // in roundFood ci sarà ogni volta l'alimento a cui si verifica il sort
            if(roundFood.food_id === recived.id_alimento){
              return {ingredients: recived.foods, result: true};
            } else { 
              await Order.update({status : "FALLITO"}, {where : {id: recived.id_order}});
              return {result: false};
            }
      } else {
        return {result: false};
             }
}

/*
Controlla che l'ultima quantità misurata dalla bilancia rientri nei limiti di peso stabiliti per l'alimento dell'ordine che il
client ha appena terminato di caricare.
Viene chiamata nel momento in cui il Client_1 comunica l'uscita dalla zona di carico.
In caso di peso non conforme cambia lo status dell'ordine in FALLITO e arresta il client.
*/
async function checkQuantity(recived:any){
  if(recived.weight >= recived.foods[recived.index].generalMin && recived.weight <= recived.foods[recived.index].generalMax) {
    return {ingredients: recived.foods, result: true};
  } else{
    await Order.update({status : "FALLITO"}, {where : {id: recived.id_order}});
    return {result: false};
  } 
}

//Cambia lo status dell'ordine in COMPLETATO nel momento in cui il Client_1 comunica di aver terminato tutte le operazioni di carico
async function completeOrder(recived:any){
  await Order.update({status : "COMPLETATO"}, {where : {id: recived.id_order}});  
}

/*
La seguente funzione viene lanciata appena uno dei client esegue il comando subscribe(), instaurando la comunicazione con il server.
Al momento della connessione il server manda un messaggio di connessione stabilita.
Nel momento in cui uno dei client esegue il comando next(), inviando un messaggio al server, quest'ultimo inserisce i dati ricevuti in un
oggetto (recived) e a seconda del valore dell'attributo operation chiama la funzione di gestione associata.
Nel caso 0 chiama la funzione di controllo dello status dell'ordine per la presa in carico.
Nel caso 1 chiama la funzione di controllo per il rispetto dell'ordine di carico della ricetta definita nell'ordine.
Nel caso 2 chiama la funzione di controllo della conformità del peso caricato a bordo all'uscita da una zona di carico
Nel caso 3 chiama la funzione della factory che conferma alla bilancia di aver ricevuto i dati pesati. (unico casi di comunicazione con Client_2)
Nel caso 4 chiama la funzione di completamento dell'ordine che porta alla modifica dello status nel database a COMPLETATO
Nel caso 5 chiama la funzione della factory che comunica al client il fallimento dell'ordine.
Infine quando i client interrompono la comunicazione con il comando unsubscribe() il server stampa a schermo l'avviso di client disconnesso.
*/
wss.on('connection', function connection(ws: any) {
  factory.getMessageResponse(MsgEnum.connectionEstablished, ws);
  ws.on('message', async function message(data: any) {
    let recived: any = JSON.parse(data);
    let result: any
    switch(recived.operation){
      case 0 :   result = await getChargingInfo(recived); 
                (result.result) ?  factory.getMessageResponse(MsgEnum.getChargingInfoOK, ws, recived, result.ingredients) :
                                   factory.getMessageResponse(MsgEnum.getChargingInfoFAIL, ws, recived);
                break;

      case 1 :  result = await checkSorting(recived);
                (result.result) ? factory.getMessageResponse(MsgEnum.checkSortingOK, ws, recived, result.ingredients) : 
                                  factory.getMessageResponse(MsgEnum.checkSortingFAIL, ws, recived);
                break;

      case 2 :  result = await checkQuantity(recived);
                (result.result) ? factory.getMessageResponse(MsgEnum.checkQuantityOK, ws, recived, result.ingredients) : 
                                  factory.getMessageResponse(MsgEnum.checkQuantityFAIL, ws, recived);
                break;

      case 3 :  factory.getMessageResponse(MsgEnum.communicateWeight, ws, recived)
                break;

      case 4 :  await completeOrder(recived);
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
