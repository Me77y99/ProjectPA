

# ProjectPA2022

L'applicazione consente di gestire il processo di alimentazione di animali 
all’interno di una stalla. In particolare si vuole gestire un workflow 
secondo il quale l’operatore effettui delle operazioni nella giusta sequenza
caricando le quantità desiderate di alcuni alimenti (es. alimento 1 q.tà X kg, 
alimento 2 q.tà Y kg,…). In sostanza il sistema deve dare la possibilità di creare
un “ordine” con una precisa “ricetta” che poi verrà messo in esecuzione da un operatore 
che provvederà a prelevare nelle giuste quantità e nel giusto ordine i vari alimenti 
per soddisfare la ricetta richiesta.


## Utilizzo tramite docker-compose
#### API
Copiare il repository nel proprio ambiente, posizionarsi nella cartella `ProjectPA/App` e lanciare il comando:
```bash
> docker-compose up api
```
che avvierà il container per la gestione del database mysql e poi il container che delle API.  Per testare le API avviare Postman (importare file con la collezione delle richieste). Le richieste necessitano di token JWT (vedere in seguito). Di seguito sono riportati dei token di esempio: 
 - **Utente ( id:3 ):** ```eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NTU3MTg2MjUsImV4cCI6MTY4NzI1NDYyNiwiYXVkIjoiaHR0cDovbG9jYWxob3N0OjgwODAiLCJzdWIiOiIzIiwiaWQiOiIzIiwicm9sZSI6InVzZXIifQ.gjF4f8NuYf7CoRGeQJQ30DvDXsR3MHux-U96qNfBgB4```
 - **Admin ( id:1 ):**
```eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NTU0NTI3MDgsImV4cCI6MTY4Njk4ODcwOSwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2NyZWF0ZS1yZWNpcGUiLCJzdWIiOiIxIiwiaWQiOiIxIiwicm9sZSI6ImFkbWluIn0.1T_k18SOhtrVe5F_eQXN_s6TlzxvzhKbeE8gThv77SU```
 - **Utente ( id: 2 ) creatore degli ordini:**
```eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NTU0NTI3MDgsImV4cCI6MTY4Njk4ODcwOSwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2NyZWF0ZS1yZWNpcGUiLCJzdWIiOiIxIiwiaWQiOiIxIiwicm9sZSI6ImFkbWluIn0.1T_k18SOhtrVe5F_eQXN_s6TlzxvzhKbeE8gThv77SU```

#### Websocket 
Copiare il repository nel proprio ambiente, posizionarsi nella cartella `ProjectPA/App` e lanciare il comando (avvierà il container del database e quello per il Websocket Server):
```bash
> docker-compose up websocketserver
```

In una seconda finestra , una volta attesi gli altri container, lanciare : 
```bash
> docker-compose up websocketclient
```

Il risultato sarà la stampa a terminale dell'interazione tra il Websocket Server e i due Client: 

 - Client_1: Operatore che può prendere in carico un'ordine ed entrare/uscire nelle varie zone di carico
 - Client_2: Bilancia a bordo veicolo che manda al Server i pesi una volta al secondo.
#### Database Mysql
All'avvio del container `dbmysql` viene eseguito lo script `seed.sql`, il quale creerà e popolerà le seguenti tabelle: 

  >  - Users: contiene informazioni sugli utenti
  >  - Foods: contiene informazioni sugli alimenti
  >  - Orders: contiene informazioni sugli ordini di acquisto
  >  - Recipe: contiene informazioni sulle ricette
  >  - Recipe_foods: contiene informazioni per ogni coppia ricetta/alimento insieme a sort e rate

   
## Architettura


### API Reference

| Route                     | Type   | BearerToken | JWTRole                    |
| :------------------------ | :----- | :---------- |:------------------------- |
| `/check-availability`     | `GET`  | `YES`       |User                       |
| `/check-availability-all` | `GET`  | `YES`       |User                       |
| `/order-state`            | `GET`  | `YES`       |Admin or order's User      |
| `/create-order`           | `POST` | `YES`       |User                       |
| `/create-recipe`          | `POST` | `YES`       |Admin                      |
| `/update-storage`         | `POST` | `YES`       |User                       |

- ### /check-availability

Permette di visualizzare le giacenze in magazzino degli alimenti richiesti dall'utente.

È necessario definire, all'interno del body della request, un array di oggetti con attributo il nome dell'alimento desiderato,
questo ci permette di poter visualizzare la disponibilità di 1 o più alimenti in una singola richiesta.

#### Request Body

```json 
{
    "foods": [
        {"name" : "Inserire nome alimneto desiderato"},
        {"name" : "Inserire nome alimneto desiderato"}
    ]
}
```  

- ### /check-availability-all

Permette di visualizzare la disponibilità di tutti gli alimenti presenti nel magazzino; essendo una richiesta che coinvolge tutti gli alimenti non è necessaria la presenza di un body JSON per la richiesta.


- ### /order-state

Permette di visualizzare lo status di un ordine; è consentita agli utenti di tipo admin e all'utente che ha creato l'ordine.

#### Request Body

```json 
{
    "order_id": "Inserire id dell'ordine da controllare"
}
```  

- ### /create-order

Permette a un utente di tipo User di creare un ordine; nel body della richiesta vanno specificati il nome della ricetta che si vuole ordinare
e la quantità desiderata (Kg).

#### Request Body

```json 
{
    "recipe_name": "Inserire nome della ricetta desiderata",
    "quantity": "Inserire la quantità desiderata(Kg)",
}
```  

- ### /create-recipe

Permette agli utenti di tipo Adimn di creare una nuova ricetta da inserire nel Database.

Nel body della richiesta vanno specificati il nome della ricetta e la lista degli alimenti che compongono la ricetta, ogni alimento deve essere espresso sottoforma di oggetto composto dagli attributi: nome e rate percentuale nella ricetta.

Nota: Il valore di sort per l'esecuzione della ricetta viene generato automaticamente contestualmente all'ordine espresso all'interno della lista degli ingredienti.

#### Request Body

```json 
{
    "name" : "Inserire nome nuvoa ricetta",
    "recipe_foods" : [
        {
            "name" : "Inserire nome alimento",
            "rate" : "Inserire percentuale dell'alimento nella ricetta" 
        } , 
        {
            "name" : "Inserire nome alimento",
            "rate" : "Inserire percentuale dell'alimento nella ricetta"         
        }
    ]
}
```

- ### /update-storage

Permette agli utenti di tipo User di modificare la giacenza di un determinato alimento all'interno del Database.

Nel body della richiesta vanno specificati il nome dell'alimento di cui si vuole modificare la giacenza e la quantità che si desidera aggiungere(espressa come numero positivo) o rimuovere(espressa come numero negativo).

#### Request Body

```json 
{
    "name": "Inserire nome alimento di cui modificare la giacenza",
    "quantity": "Inserire quantità da aggiungere o togliere (per togliere precedere il numero con -)"
}
```

## Websocket Reference
Nella directory `App/Server` è incapsulato il back-end per la gestione di un flusso di dati che proviene da due Websocket definite in `App/Client/Clients.ts`. Queste si connettono ad un WebSocket Server (`Server.ts`) che può essere interrogato alla porta `WS_PORT` definita nel file `.env`. Tutti i messaggi che vengono scambiati tra i client e il server vengono generati ad hoc dall'apposita `factoryMessages`.



[![Watch the video](https://yon.fun/content/images/2019/12/WebSocket-with-RxJS-2.png)](https://github.com/Me77y99/ProjectPA/blob/main/Client-Server_WebSocketComm720p.mp4)


## Diagrammi UML

### Use Case 
![Use Case Diagram](https://github.com/Me77y99/ProjectPA/blob/main/UML/Use%20Case.png)
### Sequence Diagrams
![API-check-avaiability-all](https://github.com/Me77y99/ProjectPA/blob/main/UML/API-check-avaiability-all.png)
![API-check-availability](https://github.com/Me77y99/ProjectPA/blob/main/UML/API-check-availability.png)
![API-create-order](https://github.com/Me77y99/ProjectPA/blob/main/UML/API-create-order.png)
![API-order-state](https://github.com/Me77y99/ProjectPA/blob/main/UML/API-order-state.png)
![API-update-storage](https://github.com/Me77y99/ProjectPA/blob/main/UML/API-update-storage.png)
![Websocket Communication Sequence](https://github.com/Me77y99/ProjectPA/blob/main/UML/WebsocketCommunicationSequence.png)

## Pattern utilizzati 



## Authors

- [@Mattia Scuriatti](https://github.com/Me77y99)
- [@Francesco Giostra](https://github.com/Franz95)
