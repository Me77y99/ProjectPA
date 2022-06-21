import { Recipe } from "../../model/Recipe";

/*
FUNZIONE MIDDLEWARE PER CONTROLLARE CHE LA RICETTA DI CUI SI È RICHIESTA LA CREAZIONE NON ABBIA LO STESSO NOME DI UNA RICETTA PRE-ESISTENTE

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica che nel DB non sia presente una ricetta con lo stesso nome di quella che si è richiesto di creare.
*/
export async function verifyExistingRecipe(req: any, res:any, next: any){
    
    let recipe:any = await Recipe.findOne({where:{name: req.body.name}});
    (recipe) ? next("Esiste già una ricetta con lo stesso nome!") : next();
    
}

/*
FUNZIONE MIDDLEWARE PER CONTROLLARE LA CONFORMITÀ DEI RATE NELLA RICETTA DA CREARE

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica che la somma dei rate, espressi negli ingredienti che compongono la ricetta, sia conforme, ovvero, uguale a 100.
*/
export function verifyRateSum(req: any, res:any, next: any){
    
    let totalRate: number = 0;
    for(let recipe_food of req.body.foods){
        totalRate += Number(recipe_food.rate);
    }

    (totalRate === 100) ? next() : next("La somma delle percentuali degli ingredienti che compongono la ricetta non è uguale al 100%");

}


/*
FUNZIONE MIDDLEWARE PER CONTROLLARE LA PRESENZA DI ELEMENTI DUPLICATI NELL'ELENCO DEGLI INGREDIENTI DELLA RICETTA

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica all'interno dell'elenco degli ingredienti che compongono la ricetta non siano presenti alimenti con lo stesso nome.
Per fare questo viene popolato un array di stringhe prendendo l'elenco degli alimenti nel body della request e processandolo con
map per rendere tutti i nomi in maiuscolo, successivamente con una prima filter per conservare tutti gli elementi duplicati nell'elenco
e infine con una seconda filter per mantenere un elemento per elemento duplicato, nel caso in cui l'array finale contenga almeno un elemento
viene restituito il relativo errore.
*/
export function verifyFoodsUnique(req: any, res:any, next: any){
    let foods_repeated_names : Array<String> = req.body.foods.map((item: any) => item.name.toUpperCase())
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) != index) // array con nomi ripetuti con possibilità doppioni
    .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) === index); // array con nomi ripetuti univoci
    
    (foods_repeated_names.length > 0) ? next(`Nella ricetta i seguenti elementi sono ripetuti più volte: ${Array.from(foods_repeated_names)}`) : next();
}