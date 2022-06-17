import { Food } from "../model/Food";
import { Order } from "../model/Order";
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

export async function verifyFoodAvailabilityForRecipes(req: any, res:any, next: any){
    
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

export function verifyRateSum(req: any, res:any, next: any){
    
    let totalRate: number = 0;
    for(let recipe_food of req.body.recipe_foods){
        totalRate += Number(recipe_food.rate);
    }

    (totalRate === 100) ? next() : next("La somma delle percentuali degli ingredienti che compongono la ricetta non è uguale al 100%");

}

export function verifyFoodsUnique(req: any, res:any, next: any){
    
    let recipe_foods_names :Array<String> = [];
    for(let recipe_food of req.body.recipe_foods){
        recipe_foods_names.push(recipe_food.name.toUpperCase());
    }
    let set = new Set(recipe_foods_names);
    let foods_repeated = recipe_foods_names.filter( item => {
        if(set.has(item)){
            set.delete(item);
        } else{
            return item;
        }
    });

    let repeated: Set<String> =new Set(foods_repeated);
    (repeated.size > 0) ? next(`Nella ricetta i seguenti elementi sono ripetuti più volte: ${Array.from(repeated)}`) : next();
}

//CONTROLLARE EVENTUALMENTE CON OR IN SEQUELIZE
export async function verifyFoodsInDB(req: any, res:any, next: any){
    let count: number = 0;
    let recipe_foods_names :Array<String> = [];
    
    for(let recipe_food of req.body.recipe_foods){
        recipe_foods_names.push(recipe_food.name.toUpperCase());
    }
    
    for(let food of recipe_foods_names){
        let instance: any = await Food.count({
            where:{
                name: food
            }      
        });
        (instance===1) ? count+=1 : true;
    }
    console.log(count);
    (count === recipe_foods_names.length) ? next() : next("All'interno della ricetta sono elencati degli ingredienti non presenti in catalogo!")
}

export async function verifyAdminOrThatUser(req: any, res:any, next: any){
    let order: any = await Order.findOne({
        where: {
            id: Number(req.body.order_id)
        }
    });
    req.orderStatus=order.dataValues.status;

    (req.user.role === "admin" || Number(req.user.id) === order.dataValues.user_id ) ? next() : next("Solo l'admin o l'utente che ha creato l'ordine possono visualizzarne lo status");
}

export async function verifyFoodAvailabilityForStorage(req: any, res:any, next: any){
    let quantity = Number(req.body.quantity);
    try{          
        let food : any = await Food.findOne({where:{ name: req.body.name}});   
        if(quantity < 0){
            if(Math.abs(quantity) <= food.dataValues.quantity){
                next();
            }
            else{
                next("Attenzione! La quantità da ritirare eccede le giacenze in magazzino!")
            }
        } else if(quantity > 0) {
            next();
        } else if(quantity == 0) {
            next("Inserire una quantità diversa da Zero!")
        } else{
            next("Inserire un cristo di numero!")
        }
    }      
    catch (error){
        console.log(error);
    }    
}

export async function verifyFoodInDB(req: any, res:any, next: any){        
    let food =  await Food.findOne({where: {name: req.body.name}});
    (food) ? next() : next("L'alimento richiesto non è presente in catalogo!")
}

/*
const getUserByUsername = username => {
  return Viewer.findOne({
    where: {username}
  }).then(response => {
    console.log(response.dataValues);//the object with the data I needreturn response.dataValues;
  });
};
*/