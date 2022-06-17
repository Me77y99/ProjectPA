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
                
        res.status(201).send(`Ricetta ${recipe.dataValues.name} creata correttamente`)
    }

    export async function orderState(req: any, res: any){     
       res.status(201).send(`Lo status dell'ordine è: ${req.orderStatus}`);
    }