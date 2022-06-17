import { Order } from "../model/Order";
import { Recipe } from "../model/Recipe";
import { Recipe_foods } from "../model/Recipe_foods";


   export async function createOrder(req: any){
        await Order.create(req.body);

    }

    export async function createRecipe(req: any, res: any){
        let recipe = await Recipe.create(req);
        console.log(recipe);
        
        req.recipe_foods.forEach( (recipe_food: any) => {
                 let food_id 
                 Recipe_foods.create(recipe_food);
            });
        res.status(201).json({ricetta : recipe})
    }
