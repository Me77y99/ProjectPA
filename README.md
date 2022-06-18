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

- ### Creazione ordine

```http
  POST /create-order
```
#### Body

```json 
{
        "recipe_id": "1",
        "quantity": "10",
    }
```  

- ### Creazione ricetta

```http
  POST /create-recipe
```
Nota: L'ordine degli ingredienti nella ricetta è lo stesso con cui vengono inseriti 
nella richiesta
#### Body

```json 
{
    "name" : "ricetta-prova",
    "recipe_foods" : [
        {
            "name" : "Soja",
            "rate" : "70" 
        } , {
            "name" : "Crusca",
            "rate" : "30"  
        }
    ]
}
```  


## Authors

- [@Mattia Scuriatti](https://github.com/Me77y99)
- [@Francesco Giostra](https://github.com/Franz95)

