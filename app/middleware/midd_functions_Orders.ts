import { Food } from "../model/Food";
import { Order } from "../model/Order";
import { Recipe } from "../model/Recipe";
import { Recipe_foods } from "../model/Recipe_foods";

/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DEL RUOLO E DELL'ID DELL'UTENTE CHE RICHIEDE LA VISUALIZZAZIONE DELLO STATUS DI UN ORDINE

Questa funzione viene raggiunta dalla rotta /order-status

Verifica che il ruolo dell'utente che ha richiesto la visualizzazione dello status di un determinato ordine sia un admin o l'utente che ha
effettivamente creato l'ordine.
*/
export async function verifyAdminOrItsUser(req: any, res:any, next: any){
    let order: any = await Order.findOne({
        where: {
            id: Number(req.body.order_id)
        }
    });

    req.orderStatus=order.dataValues.status;
    
    (req.user.role === "admin" || Number(req.user.id) === order.dataValues.user_id ) ? next() : next("Solo gli admin o l'utente che ha creato l'ordine possono visualizzarne lo status");
}


/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA DISPONIBILITÀ DI ALIMENTI IN MAGAZZINO PER IL SODDISFACIMENTO DI UN ORDINE

Questa funzione viene raggiunta dalla rotta /create-order.

Controlla che le giacenze in magazzino di tutti gli alimenti richiesti per una determinata ricetta siano sufficienti per soddisfare
l'ordine che richiede una determinata quantità di quella ricetta.

Viene popolato un Array attraverso la funzione sequelize .findAll che trova tutte le occorrenze all'interno della tabella recipe_foods che contengono
l'id della ricetta richiesta nell'ordine, quindi conterrà i dati relativi a ciascun ingrediente della ricetta in particolare il Rate Percentuale.

Successivamente attraverso un ciclo for vengono controllati tutti gli ingredienti richiesti;
viene calcolata la quantità richiesta per soddisfare l'ordine e confrontata con la quantità in giacenza nel magazzino.

Nel caso in cui la giacenza di un determinato alimento non permetta di soddisfare l'ordine, questo alimento viene inserito nell'array foods_unavailable.
Se sono presenti alimenti con giacenza insufficiente questi vengono mostrati nell'errore. 
*/
export async function verifyFoodAvailabilityByRate(req: any, res:any, next: any){ 
    let foods_avaiable : Array<any> = [];
    let foods_unavaiable : Array<any> = [];

    try{
        let recipe_foods : Array<any> = await Recipe_foods.findAll(
            {
                attributes: {exclude: ['id']},
                where:{
                    recipe_id: req.body.recipe_id
                }      
            }); 
        
        for ( let recipe_food of recipe_foods){
            let required_quantity_of_food : number = (req.body.quantity * recipe_food.dataValues.rate) / 100;          
            let food : any = await Food.findOne({where:{ id: recipe_food.dataValues.food_id}});   
            (required_quantity_of_food < food.quantity) ?  foods_avaiable.push(food.name) :  foods_unavaiable.push(food.name);
        }
        (foods_unavaiable.length > 0) ? next(`Quantità insufficiente di: ${foods_unavaiable}`) : next();
    }      
    catch (error){
        console.log(error);
    }    
}



/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELL'EFFETTIVA ESISTENZA DELL'ORDINE DI CUI È STATO RICHIESTO LO STATUS

Questa funzione viene raggiunta dalla rotta /order-status

Controlla che all'interno del DB sia effettivamente presente l'ordine di cui è stato richiesto lo status
*/
export async function verifyExistingOrder(req: any, res:any, next: any){
    let order: any = await Order.findOne({
        where: {
            id: Number(req.body.order_id)
        }
    });

    (order) ? next() : next("L'ordine richiesto è inesistente!") ;
}


/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA QUANTITÀ DELL'ORDINE RICHIESTO

Questa funzione viene raggiunta dalla rotta /create-order.

Controlla che la quantità espressa nell'ordine sia un numero maggiore di zero.
*/
export function verifyQuantityOrder(req: any, res:any, next: any){
    (req.body.quantity > 0) ? next() : next("La quantità deve essere maggiore di 0");
}


/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA PRESENZA NEL DB DELLA RICETTA RICHIESTA DA UN DETERMINATO ORDINE

Questa funzione viene raggiunta dalla rotta /create-order.

Verifica che la ricetta espressa all'interno del body della request sia presente all'interno del DB
*/
export async function verifyRecipe(req: any, res:any, next: any){
    let recipe: any = await Recipe.findOne({
        where: {
          id: req.body.recipe_id
        }
      });
    recipe ? next() : next("La ricetta non è presente in catalogo");
}