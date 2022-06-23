import {webSocket} from 'rxjs/webSocket';
require('dotenv').config({path : './../../.env'});
(global as any).WebSocket = require('ws');

/*
Ho preso in carico l'ordine X (order_id) => il server riceve l'id dell'ordine:
1) cambia status da Creato a In Esecuzione all'ordine, 
2) si tira fuori la ricetta con il sorting degli alimenti,
3) si calcola rispetto alla quantità dell'ordine e ai rate degli alimenti nella ricetta le quantità di ciascun alimento +- 
   l'errore percentuale in .env

Alla fine il server ha un array di oggetti in cui ciascun elemento è ordinato rispetto al sort;
e contiene l'id dell'alimento (per controllare che l'operatore esegua i carichi nel giusto ordine), 
la quantità minima e la quantità massima che la bilancia deve avere dopo il carico dell'alimento 
(per controllare di non sforare l'errore percentuale)

Dopo 10 sec: Sono entrato in zona Alimento 1, sono le ore tot

Dopo 10 sec: Sto uscendo da zona Alimento 1, sono le ore tot

Dopo 10 sec: Sono entrato in zona Alimento 2, sono le ore tot

Dopo 10 sec: Sto uscendo da zona Alimento 2, sono le ore tot

Dopo 10 sec: Sono entrato in zona Alimento 3, sono le ore tot

Dopo 10 sec: Sto uscendo da zona Alimento 3, sono le ore tot

Ho finito di processare l'ordine
*/

const Client_1 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Bilancia a bordo macchina
let check1: any , check2: any;
let weight : number = 0;

Client_1.subscribe({
  next: msg  =>{
                check1 = JSON.parse(JSON.stringify(msg));
                console.log(`Client_1 - message received from server: ` + check1.message );
              }, // Called whenever there is a message from the server.
  error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
});

Client_2.subscribe({
  next: msg =>{
                check2 = JSON.parse(JSON.stringify(msg));
                console.log(`Client_2 - message received from server: ` + check2.message)
              }, // Called whenever there is a message from the server.
  error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
});

//operation legenda: 0 - Ordine preso in carico; 1 - ingresso zona di carico; 2 - uscita zona di carico; 3 - ordine completato; 4 - pesa dell'alimento
async function communicateToServerToGetChargingInfo(){
  Client_1.next({ operation: 0, id_order: 1});
  await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToCheckSorting());}, 1000)); 
}

async function communicateToServerToCheckSorting(){
    let intervalID : any;
    let ingredientsInRecipe : Array<number> = [1, 3, 2];

    for( let i:number=0; i < check1.num_Ingredients && check1.status == 1; i++){
    intervalID = setInterval(() => {(Client_2.next({ operation: 4, weight: weight}));}, 1000);
    //ENTRA
      await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 1, id_order: 1, id_alimento: ingredientsInRecipe[i]}));}, 3000));
      clearInterval(intervalID);
      await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToCheckQuantity(intervalID, ingredientsInRecipe[i]));}, 1000)); //permette di attendere il cambio di check1.status in caso di fallimento dell'ordine causa sorting
  }
  communicateToServerToCompletingOrder();
}

async function communicateToServerToCheckQuantity(intervalID : any, ingredient: number){
  if(check1.status == 1){
   
    intervalID = setInterval(() => {(weight= (weight+Math.random()), Client_2.next({operation: 4, weight: weight}));}, 1000);
    await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 2, id_order: 1, id_alimento: ingredient}));}, 6000));
    //ESCE
    
    clearInterval(intervalID);
    await new Promise( resolve => setTimeout(() => {resolve({});}, 1000));
    
  }
  else{
    clearInterval(intervalID);

  }
}

async function communicateToServerToCompletingOrder(){
  if(check1.status == 1){
    Client_1.next({ operation: 3, id_order: 1});
  } else{
    console.log("FINITO FALLITO")
  }
}


communicateToServerToGetChargingInfo();
  