import { Food } from "../model/Food";
import { Recipe } from "../model/Recipe";
import { Recipe_foods } from "../model/Recipe_foods";
const jwt = require('jsonwebtoken');
require('dotenv').config({path : './../.env'})

export function verifyHeaderAuthorization (req: any, res:any, next: any): void{
    req.headers.authorization ? next() : next("Il campo autorizzazione non è presente nella intestazione");
}

export function verifyHeaderContentType(req: any, res:any, next: any): void{
    req.headers["content-type"] == "application/json" ? next() : next("Il content-type della richiesta non è corretto");
}

export function verifyToken(req: any, res:any, next: any): void{
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1]; 
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

export function verifyJWT(req: any, res:any, next: any): void{
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
  if(decoded !== null)
    req.user = decoded;
    next()
}

export function verifyJSON(req: any, res:any, next: any): void{
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        console.log(error);
        next();
    }
}

export function verifyUser(req: any, res:any, next: any): void{
        console.log(req.user);
        req.user.role === "user" ? next() : next("Solo gli utenti possono effetturare la creazione di un ordine");
    }

export function verifyAdmin(req: any, res:any, next: any): void{
        req.user.role === "admin" ? next() : next("Solo l'admin può effetturare la creazione di una ricetta");
    }

export async function verifyRecipe(req: any, res:any, next: any){
    let recipe: any = await Recipe.findOne({
        where: {
          id: req.body.recipe_id
        }
      });
    recipe ? next() : next("La ricetta non è stata trovata");
}

export function verifyQuantityOrder(req: any, res:any, next: any){
    req.body.quantity > 0 ? next() : next("La quantità deve essere maggiore di 0");
}

export async function verifyFoodAvailability(req: any, res:any, next: any){
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
        let promise = new Promise((resolve, reject) => {  
            recipe_foods.forEach((recipe_food) => {
                let required_quantity_of_food : number = (req.body.quantity * recipe_food.dataValues.rate) / 100;
                        
                let food : any = Food.findOne({where:{ id: recipe_food.dataValues.food_id}});   
                (required_quantity_of_food < food.quantity) ?  foods_avaiable.push(food):  foods_unavaiable.push(food) ;
                resolve(foods_unavaiable);
             });
            
            });

        promise.then((foods_unavaiable) => {
             next(`Non hai abbastanza quantità di ${foods_unavaiable}`);
        });
                  
        }      
    catch (error){
        console.log(error);
}
}

export function verifyRecipeFoodsExist(req: any, res:any, next: any){
    
}

