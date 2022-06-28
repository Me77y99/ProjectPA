import {webSocket} from 'rxjs/webSocket';
require('dotenv').config({path : './../.env'});
(global as any).WebSocket = require('ws');

/*
//DEFINIZIONE DELLA PORTA DI COLLEGAMENTO AL SERVER PER DOCKER
const Client_1 = webSocket(`ws://websocketserver:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://websocketserver:${process.env.WS_PORT}`); //Bilancia a bordo macchina 
*/

//DEFINIZIONE DELLA PORTA DI COLLEGAMENTO AL SERVER PER FASE DI SVILUPPO IN LOCALE
const Client_1 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Bilancia a bordo macchina

let check1: any

/*
I seguenti blocchi Client1.subscribe e Client2.subscribe, permettono ai due client di instaurare un canale
di comunicazione con il server in funzione (nel caso di sviluppo in locale collegandosi a localhost; nel caso di
docker collegandosi al container chiamato websocketserver; in entrambi i casi la porta di comunicazione è specificata nella voce
WS_PORT all'interno del file .env)
In entrambi i blocchi subscribe troviamo tre funzioni: Next, Error e Complete:
1) Next viene chiamato ogni volta che il client riceve un messaggio dal Server; in particolare il client  
2) Error viene chiamato se in un qualsiasi momento l'API Websocket riscontra un qualche errore. 
3) Complete viene chimato al momento della chiusura del canale di comunicazione con il server (per qualsiasi ragione)
*/
Client_1.subscribe({
  next: msg  =>{
                check1 = JSON.parse(JSON.stringify(msg));
                console.log(`\nOperatore: ` + check1.message );
              },
  error: err => console.log(err),
  complete: () => console.log('Client_1 (Operatore) connessione terminata')
});

Client_2.subscribe({
  next: msg =>{
                console.log(`Bilancia: ` + JSON.parse(JSON.stringify(msg)).message)
              },
  error: err => console.log(err),
  complete: () => console.log('Client_2 (Bilancia) connessione terminata')
});

/*
Nel rispetto delle direttive di progetto sono stati creati 2 Client (Operatore e Bilancia) entrambi cablati al fine di verificare
3 casi particolari di funzionamento della comunicazione tra Client e Server:
1) Presa in carico di un ordine con conseguente fallimento causa errato ordine di inserimeto degli ingredienti
2) Presa in carico di un ordine con conseguente fallimento causa non conformità del peso misurato dalla Bilancia in uscita da una delle zone
   di carico. (La percentuale di errore massima rispetto alla misura corretta è definita all'interno della voce ERROR_PERCENTAGE nel file .env)
3) Presa in carico di un ordine con conseguente successo.

Di seguito riassumiamo le azioni che i client possono comunicare al server identificati attraverso un numero da 0 a 5:

( Codice  -       Azione                   - Client Chiamante)
    0     - Ordine preso in carico         - Client_1
    1     - Ingresso in zona di carico     - Client_1
    2     - Uscita da zona di carico       - Client_1
    3     - Pesa alimenti caricati a bordo - Client_2
    4     - Ordine completato              - Client_1
    5     - Ordine fallito                 - Client_1
*/

/*
Il Client_1 comunica al server di prendere in carico un determinato ordine fornendo il codice dell'operazione e l'id dell'ordine;
il server controllerà se lo status dell'ordine è CREATO e in tal caso restituisce in risposta (caricata all'interno della varaibile check_1)
il numero degli ingredienti che compongono la ricetta richiesta nell'ordine e un valore di status=1(azione consentita).
Viceversa se lo status dell'ordine all'interno del DB risulta essere diverso da CREATO, il server manderà in risposta un messaggio di errore
in cui comunica che l'ordine è già stato preso in carico precedentemente e un valore status=0(azione non consentita).
Infine la funzione dopo 1 secondo chiama la funzione successiva.
*/
async function communicateToServerToGetChargingInfo(ingredients : Array<number>, id_order: number , add_weight:number){
  Client_1.next({ operation: 0, id_order: id_order});
  await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToCheckSortingAndQuantity(ingredients, id_order, add_weight));}, 1000)); 
}

/*
Nella seguente funzione è stato creato un ciclo for per il controllo dell'ordine di caricamento degli alimenti e per il successivo controllo della quantità
totale caricata a bordo all'uscita da ogni zona di carico.
Nello specifico le condizioni del for sono definite sui dati inviati dal server nella funzione precedente; infatti il for cicla tante volte quanti sono 
gli ingredienti che compongono la ricetta tramite conteggio effettuato sui dati nel DB; inoltre viene valutato che lo status restituito dal server sia =1 per
verificare che l'azione che si sta per svolgere è stata consentita.
all'interno del for la Bilancia inizia ad inviare i primi dati al server con cadenza pari ad 1 secondo; dopo 3 secondi il client comunica l'ingresso nella zona di carico
designata dall'utente nell'array dato in input a inizio procedura.
Il server controllerà che la zona di carico segnalata dal client sia conforme con il sorting degli ingredienti ricavato dal DB e consentirà l'azione successiva (status=1)
oppure restituirà un messaggio di errore vietando l'azione successiva (status=0)
È stato inserito un timeout di 1 secondo con funzione vuota per permettere al server di comunicare in maniera corretta lo status per la prossima azione descritta
nel blocco if-else immediatamente successivo.
Nel caso in cui l'azione sia consentita la bilancia inizierà ad inviare al server la variazione del peso caricato a bordo con cadenza pari ad 1 secondo;
la quantità che viene aggiunta al peso in entrata alla zona di carico è stata specificata dall'utente nella dichiarazione degli input di inizio procedura.
Dopo 6 secondi il Client_1 comunicherà al server l'uscita dalla zona di carico attuale; il server confronterà quindi l'ultimo valore pesato dalla bilancia con
i valori di quantità minima e massima prevista per quello step della ricetta per controllare il rispetto del massimo errore percentuale consentito.
In caso di peso conforme lo status viene mantenuto a valore 1 permettendo quindi di eseguire la successiva iterazione del ciclo for; altrimenti viene restituito
un messaggio di errore causa peso non conforme e lo status impostato a 0 così da forzare l'uscita dal ciclo for della funzione precedentemente descritta.
Infine; all'uscita dal for sia in caso di conclusione naturale del ciclo sia in presenza di errori (status=0) viene chiamata la funzione finale di completamento dell'ordine.
*/
async function communicateToServerToCheckSortingAndQuantity(ingredients : Array<number>, id_order: number, add_weight:number){
  let intervalID : any;
  let weight: number = 0;

  for( let i:number=0; check1.status == 1 && i < check1.ingredients.length; i++){
    intervalID = setInterval(() => {(Client_2.next({ operation: 3, weight: weight}));}, 1000);
    
    await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 1, id_order: id_order, id_alimento: ingredients[i], index: i, foods: check1.ingredients}));}, 3000));
    clearInterval(intervalID);
    await new Promise( resolve => setTimeout(() => {resolve({});}, 1000));
    
    if(check1.status == 1){
      intervalID = setInterval(() => {(weight= (weight+add_weight), Client_2.next({operation: 3, weight: weight}));}, 1000);
      await new Promise( resolve => setTimeout(() => {resolve(Client_1.next({ operation: 2, id_order: id_order, id_alimento: ingredients[i], index: i, foods: check1.ingredients, weight: weight}));}, 6000));    
      clearInterval(intervalID);
      await new Promise( resolve => setTimeout(() => {resolve({});}, 1000));
    }
    else{
      clearInterval(intervalID);
    }

  }
  await new Promise (resolve => resolve(communicateToServerToCompletingOrder(id_order)));
}

/*
Una volta terminato il ciclo for precedentemente descritto, viene chiamata questa funzione che semplicemente controlla il valore
dello status inviato dal server nell'ultima comunicazione; se è 1 viene chiamata l'operazione di completamento dell'ordine; nel caso
in cui è 0 viene chiamata l'operazione che decreta il fallimento dell'ordine in corso.
*/
async function communicateToServerToCompletingOrder(id_order :number){
  if(check1.status == 1){
    Client_1.next({ operation: 4, id_order: id_order});  
  } else{
    Client_1.next({ operation: 5, id_order: id_order});
  }
}

/*
Questa funzione viene chiamata come ultima funzione nella catena di funzioni descritta nel prossimo commento;
e permette a entrambi i client di chiudere la comunicazione con il server.
*/
async function disconnection(){
  Client_1.unsubscribe(); 
  Client_2.unsubscribe();
}

/* 
  L'esecuzione delle seguenti righe permette di simulare il processo di gestione di 3 ordini
  consequenziali, permettendoci di effettuare una simulazione del comportamento del server 
  rispetto ai dati inviatigli dal client:
  - La prima riga simula un ordine fallito a causa di sorting di carico degli alimenti errato;
  - La seconda simula un ordine completato correttamente
  - La terza simula un ordine fallito a causa di peso non conforme (nello specifico all'uscita dalla seconda zona di carico)
  - La quarta chiude la comunicazione tra i client e il server.
*/
communicateToServerToGetChargingInfo([4,2,5] , 3, 4).then( //sort sbagliato, ORDINE FALLITO 
  async()=> await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToGetChargingInfo([2,5,3,4,1] ,2 , 4));}, 1000)).then( //sort giusto e quantità giuste, ORDINE COMPLETATO   
      async() => await new Promise( resolve => setTimeout(() => {resolve(communicateToServerToGetChargingInfo([2,5] , 4 , 17));}, 1000)).then( //sort giusto ma quantità sbagliate, ORDINE FALLITO 
          async() => await new Promise( resolve => setTimeout(() => {resolve(disconnection());}, 1000))
      )
  )
);

  