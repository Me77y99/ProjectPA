import { Order } from "../../model/Order";
import { Recipe } from "../../model/Recipe";
import { Food } from "../../model/Food";
import { Recipe_foods } from "../../model/Recipe_foods";

//CONTROLLER DI VISUALIZZAZIONE GIACENZA DEGLI ALIMENTI, RICHIESTI DALL'UTENTE, IN MAGAZZINO
//La funzione crea un array di stringhe contenente tutti i nomi degli alimenti richiesti dall'utente,
//processando la lista nel body della request inizialmente con map per renderli tutti in maiuscolo e
//successivamente con filter per evitare di fare interrogazioni identiche in caso di presenza di alimenti
//duplicati nella lista di alimenti fornita dall'utente; infine tramite un ciclo for viene popolato
//un array di stringhe con tutti i gli alimenti richiesti e la rispettiva giacenza in magazzino.
export async function checkAvailability(req: any, res: any) {
    let foods_unique_names: Array<String> = req.body.foods.map((item: any) => item.name.toUpperCase())
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) === index);
    let foods_and_quantity : Array <string> = [];

    for(let food of foods_unique_names){
        let food_found: any = await Food.findOne({
            where: { name: food }
        });
        foods_and_quantity.push(`${food_found.name}, disponibilità: ${food_found.dataValues.quantity}`);    
    }

    res.status(201).send(foods_and_quantity);
}

//CONTROLLER DI VISUALIZZAZIONE GIACENZA DI TUTTI GLI ALIMENTI IN MAGAZZINO
export async function checkAvailabilityAll(req: any, res: any) {
    let foods: Array<any> = await Food.findAll();
    let foods_and_quantity = foods.map(food => `${food.name}, disponibilità: ${food.dataValues.quantity}`);
    
    res.status(201).send(foods_and_quantity);
}

//CONTROLLER DI CREAZIONE DI UN ORDINE
//La funzione prende dalla request tutte le informazioni necessarie
//per la creazione di un ordine, il cui stato viene impostato a CREATO
export async function createOrder(req: any, res: any){
    await Order.create({
        user_id: req.user.id,
        recipe_id: req.body.recipe_id,
        quantity: req.body.quantity,
        status: "CREATO"
    });
    res.status(201).send(`Ordine creato correttamente`)
}

//CONTROLLER DI CREAZIONE DI UNA RICETTA
//La funzione prende dalla request tutte le informazioni necessarie
//per la creazione di una ricetta (record di tipo Recipe contenente id e nome della ricetta).
//Effettuata la creazione della ricetta procede tramite il ciclo for alla creazione dei record di tipo Recipe_foods
//che saranno necessari per verificare la corretta esecuzione di un ordine in cui è stata richiesta quella ricetta.
//(i record di tipo Recipe_foods contengono: id_ricetta, id_alimento, valore di ordinamento e rate percentuale)
export async function createRecipe(req: any, res: any){

    let recipe: any = await Recipe.create({
        name: req.body.name
    });
    
    for(let ingredient of req.body.foods){
        let food: any =  (await Food.findOne( {where : {name : ingredient.name} } ));
        await Recipe_foods.create({
            recipe_id : recipe.dataValues.id , 
            food_id: food.dataValues.id, 
            sort: req.body.foods.indexOf(ingredient)+1, 
            rate: ingredient.rate
        });
    }

    res.status(201).send(`Ricetta ${recipe.dataValues.name} creata correttamente`)
}

//CONTROLLER DI VISUALIZZAZIONE STATUS ORDINE
export async function orderState(req: any, res: any){     
    res.status(201).send(`Lo status dell'ordine è: ${req.orderStatus}`);
}

//CONTROLLER DI MODIFICA DELLA GIACENZA DI UN ALIMENTO IN MAGAZZINO
export async function updateStorage(req: any, res: any){
    await Food.increment({quantity: Number(req.body.quantity)}, {where: {name: req.body.name}});
    let foodUpdated: any = await Food.findOne({where: {name: req.body.name}});
    await res.status(201).send(`La quantità dell'alimento ${req.body.name} è stata modificata di ${req.body.quantity}kg ed attualmente è ${foodUpdated.dataValues.quantity}kg`);
}