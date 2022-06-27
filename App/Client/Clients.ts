import {webSocket} from 'rxjs/webSocket';
//require('dotenv').config({path : './../.env'});
(global as any).WebSocket = require('ws');


//PER DOCKER
const Client_1 = webSocket(`ws://websocketserver:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://websocketserver:${process.env.WS_PORT}`); //Bilancia a bordo macchina 

/*
//PER DEV 
const Client_1 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Bilancia a bordo macchina
*/

let check1: any , check2: any;
let weight : number = 0;


/*
I seguenti blocchi Client1.subscribe e Client2.subscribe, permettono ai due client di instaurare un canale
di comunicazione con il server in funzione (nel caso di sviluppo in locale sulla porta in env.WS_PORT; nel caso di
docker nel container chiamato WebsocketServer)
*/
Client_1.subscribe({
  // Next viene chiamato ogni volta che il client riceve un messaggio dal Server.
  next: msg  =>{
                check1 = JSON.parse(JSON.stringify(msg));
                console.log(`\nOperatore: ` + check1.message );
              }, 
  // Error viene chiamato se in un qualsiasi momento l'API Websocket riscontra un qualche errore.
  error: err => console.log(err), 
  //Complete viene chimato al momento della chiusura del canale di comunicazione con il server (per qualsiasi ragione)
  complete: () => console.log('Client_1 (Operatore) connessione terminata')
});

Client_2.subscribe({
  next: msg =>{
                check2 = JSON.parse(JSON.stringify(msg));
                console.log(`Bilancia: ` + check2.message)
              },
  error: err => console.log(err),
  complete: () => console.log('Client_2 (Bilancia) connessione terminata')
});

//operation legenda: 0 - Ordine preso in carico; 1 - ingresso zona di carico; 2 - uscita zona di carico; 3 - pesa dell'alimento ; 4 - ordine completato ; 5 - ordine fallito
/*

*/
async function communicateToServerToGetChargingInfo(ingredients : Array<number>, id_order: number , add_weight:number){
  Client_1.next({ operation: 0, id_order: id_order});
  await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToCheckSorting(ingredients, id_order, add_weight));}, 1000)); 
}

async function communicateToServerToCheckSorting(ingredients : Array<number>, id_order: number, add_weight:number){
    let intervalID : any;
    let ingredientsInRecipe : Array<number> = ingredients;

    for( let i:number=0; i < check1.num_Ingredients && check1.status == 1; i++){
    intervalID = setInterval(() => {(Client_2.next({ operation: 3, weight: weight}));}, 1000);
    //ENTRA
      await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 1, id_order: id_order, id_alimento: ingredientsInRecipe[i]}));}, 3000));
      clearInterval(intervalID);
      await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToCheckQuantity(intervalID, ingredientsInRecipe[i] , id_order, add_weight));}, 1000)); //permette di attendere il cambio di check1.status in caso di fallimento dell'ordine causa sorting
  }
  await new Promise (resolve => resolve(communicateToServerToCompletingOrder(id_order)));
}

async function communicateToServerToCheckQuantity(intervalID : any, ingredient: number ,id_order :number , add_weight:number){
  if(check1.status == 1){
    
    intervalID = setInterval(() => {(weight= (weight+add_weight), Client_2.next({operation: 3, weight: weight}));}, 1000);
    await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 2, id_order: id_order, id_alimento: ingredient}));}, 6000));
    //ESCE
    
    clearInterval(intervalID);
    await new Promise( resolve => setTimeout(() => {resolve({});}, 1000));
    
  }
  else{
    clearInterval(intervalID);

  }
}

async function communicateToServerToCompletingOrder(id_order :number){
  if(check1.status == 1){
      Client_1.next({ operation: 4, id_order: id_order});
    weight = 0;  
  } else{
    Client_1.next({ operation: 5, id_order: id_order});
    weight = 0;
  }
}

async function disconnection(){
  Client_1.unsubscribe(); 
  Client_2.unsubscribe();
}

/* 
  L'esecuzione delle seguenti righe permette di simulare il processo di gestione di 3 ordini
  consequenziali, permettendoci di effettuare una simulazione del comportamento del server 
  rispetto ai dati inviatigli dal client.
  (la prima riga simula un ordine fallito )
*/
communicateToServerToGetChargingInfo([4,2,5] , 3, 4).then( //sort sbagliato, ORDINE FALLITO 
  async()=> await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToGetChargingInfo([2,5,3,4,1] ,2 , 4));}, 1000)).then( //sort giusto e quantità giuste, ORDINE COMPLETATO   
      async() => await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToGetChargingInfo([2,5] , 4 , 17));}, 1000)).then( //sort giusto ma quantità sbagliate, ORDINE FALLITO 
          async() => await new Promise( resolve => setTimeout(() => {resolve(disconnection());}, 1000))
      )
  )
);

  