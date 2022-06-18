import { Food } from "../model/Food";
import { Order } from "../model/Order";
import { Recipe } from "../model/Recipe";
import { Recipe_foods } from "../model/Recipe_foods";
import { ErrorFactory , ErrEnum } from "../factory/factoryError";
const jwt = require('jsonwebtoken');
require('dotenv').config({path : './../.env'})

let factory:ErrorFactory  = new ErrorFactory();

export function verifyHeaderAuthorization (req: any, res:any, next: any): void{
    req.headers.authorization ? next() : 
    next(res.status(factory.getError(ErrEnum.HeaderAuthEmpty).error_code)
        .send(factory.getError(ErrEnum.HeaderAuthEmpty).getMsg()));
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
    let foods_repeated_names : Array<String> = req.body.recipe_foods.map((item: any) => item.name.toUpperCase())
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) != index) // array con nomi ripetuti con possibilità doppioni
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) === index); // array con nomi ripetuti univoci
    
    (foods_repeated_names.length > 0) ? next(`Nella ricetta i seguenti elementi sono ripetuti più volte: ${Array.from(foods_repeated_names)}`) : next();
}

//CONTROLLARE EVENTUALMENTE CON OR IN SEQUELIZE
export async function verifyFoodsInDB(req: any, res:any, next: any){
    let count: number = 0;
    let recipe_foods_names_unavailable :Array<String> = [];
    
    //se richiesta viene da /create-recipe non succede nulla (già verificata univocità)
    //se richiesta viene da /check-availability elimina doppioni (evitiamo di far ripetere la ricerca nel caso in cui l'utente fornisca doppioni nella ricerca)
    try {
    let foods_unique_name :Array<String> = req.body.recipe_foods.map((item:any) => item.name.toUpperCase())
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) === index); 
  
    for(let food of foods_unique_name){
        let instance: any = await Food.count({
            where:{
                name: food
            }      
        });
        (instance===1) ? count+=1 : recipe_foods_names_unavailable.push(food); 
        // se alimento è trovato incrementa count altrimenti messo nell'array dei non disponibili
        // controllo di (instance===1) perchè nella tabella Food non è previsto che ci siano record con stesso nome 
    }

    (count === foods_unique_name.length) ? next() : next(`Gli ingredienti: ${recipe_foods_names_unavailable} non sono presenti in catalogo!`)
} catch(error){
    console.log(error);
    next(error);
}
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