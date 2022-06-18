import { Order } from "../model/Order";
import { Recipe } from "../model/Recipe";
import { Food } from "../model/Food";
import { Recipe_foods } from "../model/Recipe_foods";


export async function createOrder(req: any, res: any){
    await Order.create({
        user_id: req.user.id,
        recipe_id: req.body.recipe_id,
        quantity: req.body.quantity,
        status: "CREATO"
    });
    res.status(201).send(`Ordine creato correttamente`)
}

export async function createRecipe(req: any, res: any){

    let recipe: any = await Recipe.create(req);
    console.log(recipe) 
    for(let ingredient of req.recipe_foods){
        let food: any =  (await Food.findOne( {where : {name : ingredient.name} } ));
        await Recipe_foods.create({
            recipe_id : recipe.dataValues.id , 
            food_id: food.dataValues.id, 
            sort: req.recipe_foods.indexOf(ingredient)+1, 
            rate: ingredient.rate
            
        });
    }
            
    res.sendStatus(201).send(`Ricetta ${recipe.dataValues.name} creata correttamente`)
}

export async function updateStorage(req: any, res: any){
    await Food.increment({quantity: Number(req.body.quantity)}, {where: {name: req.body.name}});
    let foodUpdated: any = await Food.findOne({where: {name: req.body.name}});
    await res.status(201).send(`La quantità dell'alimento ${req.body.name} è stata modificata di ${req.body.quantity}kg ed attualmente è ${foodUpdated.dataValues.quantity}kg`);
}

export async function orderState(req: any, res: any){     
    res.status(201).send(`Lo status dell'ordine è: ${req.orderStatus}`);
}

export async function checkAvailabilityAll(req: any, res: any) {
    let foods: Array<any> = await Food.findAll();
    const foods_and_quantity = foods.map(food => `${food.name}, disponibilità: ${food.dataValues.quantity}`);
    res.status(201).send(foods_and_quantity);
}
export async function checkAvailability(req: any, res: any) {
    let foods_unique_names: Array<String> = req.body.recipe_foods.map((item: any) => item.name.toUpperCase())
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

