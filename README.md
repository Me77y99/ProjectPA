
# ProjectPA2022

L'applicazione consente di gestire il processo di alimentazione di animali 
all’interno di una stalla. In particolare si vuole gestire un workflow 
secondo il quale l’operatore effettui delle operazioni nella giusta sequenza
caricando le quantità desiderate di alcuni alimenti (es. alimento 1 q.tà X kg, 
alimento 2 q.tà Y kg,…). In sostanza il sistema deve dare la possibilità di creare
un “ordine” con una precisa “ricetta” che poi verrà messo in esecuzione da un operatore 
che provvederà a prelevare nelle giuste quantità e nel giusto ordine i vari alimenti 
per soddisfare la ricetta richiesta.

## API Reference

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


## Authors

- [@Mattia Scuriatti](https://github.com/Me77y99)
- [@Francesco Giostra](https://github.com/Franz95)
