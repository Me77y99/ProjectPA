import { Observable, merge, map , filter} from 'rxjs';
import { WebSocketSubject, webSocket} from 'rxjs/webSocket';
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


const formatMsg = function(data){
    return {"value": data, "timestamp": Date.now()};
}

const Client_1 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Bilancia a bordo macchina

Client_1.subscribe({
  next: msg => console.log(`Client_1 - message received from server: ` + msg), // Called whenever there is a message from the server.
  error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
});



Client_2.subscribe({
  next: msg => console.log(`Client_2 - message received from server: ` + msg), // Called whenever there is a message from the server.
  error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
});


Client_1.next({ Operation: "Presa in carico", Id_order: "1" });
Client_1.next({ Operation: "Entrata zona carico", id_order: "1", id_alimento: 1});