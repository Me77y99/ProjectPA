import { Food } from "../model/Food";

/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA GIACENZA ALL'INTERNO DEL MAGAZZINO PER EFFETTUARE OPERAZIONI DI MODIFICA

Questa funzione viene raggiunta dalla rotta /update-storage.
Controlla a seconda del tipo di operazione richiesta, attraverso l'input all'interno del body della request ("Quantità" o "-Quantità"), se la giacenza in magazzino
dell'alimento da modificare permetta di effettuare tale operazione.
Nel caso in cui viene richiesta una modifica in negativo(diminuzione della giacenza) viene verificato che l'operazione non porti la giacenza ad una quantità negativa.
Nel caso in cui la richiesta porti ad un incremento della giacenza questa viene lasciata proseguire.
Se la quantità richiesta nella modifica è pari a 0, l'operazione viene bloccata e viene richiesto di inserire un numero diverso da 0.
Infine se come quantità viene inserita una Stringa, anziché un numero, l'operazione viene bloccata e viene richiesto l'inserimento di un numero.
*/
export async function verifyFoodAvailabilityInStorage(req: any, res:any, next: any): Promise<void>{
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
            next("Attenzione! È necessario inserire un numero per effettuare la modifica della giacenza")
        }
    }      
    catch (error){
        console.log(error);
    }    
}


/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA PRESENZA DI UN DETERMINATO ALIMENTO ALL'INTERNO DEL DB
(caso con un solo alimento all'interno del body della request)

Questa funzione viene raggiunta dalla rotta /update-storage e controlla che l'alimento di cui è stata richiesta la modifica di giacenza
sia effettivamente presente nel DB.
*/
export async function verifyFoodInDB(req: any, res:any, next: any): Promise<void>{        
    let food =  await Food.findOne({where: {name: req.body.name}});
    (food) ? next() : next("L'alimento richiesto non è presente in catalogo!")
}


/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA PRESENZA DI UN DETERMINATO ALIMENTO ALL'INTERNO DEL DB
(caso con più alimenti all'interno del body della request)

Questa funzione viene raggiunta da due rotte: /create-recipe e /check-availability.
All'interno della funzione viene generato un array di stringhe contenente i nomi degli alimenti richiesti o dalla ricetta che si vuole creare
oppure dalla richiesta di visualizzazione delle giacenze.
Per popolare l'array viene processato l'elenco degli alimenti, contenuto nel body della request, prima con map per rendere tutti i nomi in maiuscolo
e successivamente tramite filter per eliminare eventuali doppioni.
(Nel caso create /create-recipe l'univocità degli alimenti nella request è già stata verificata quindi il filter non altera l'input)
Tramite un ciclo for viene effettuato il controllo della presenza degli alimenti nel DB, tramite la funzione sequelize .count
che conta il numero di istanze che rispettano la condizione where.
Nel nostro caso all'interno del DB non è previsto che nella tabella degli alimenti siano presenti alimenti con lo stesso nome, quindi,
o viene trovata esattamente un'istanza oppure l'alimento non è presente nel DB.
Nel caso ci fossero degli alimenti non presenti nel DB questi vengono inseriti in un apposito Array che successivamente viene inserito nell'errore.
*/
export async function verifyFoodsInDB(req: any, res:any, next: any): Promise<void>{
    let count: number = 0;
    let recipe_foods_names_unavailable :Array<String> = [];
    
    try {
        let foods_unique_name :Array<String> = req.body.foods.map((item:any) => item.name)
        .filter((value : string, index :number, self :Array<String>) => self.indexOf(value) === index); 
  
        for(let food of foods_unique_name){
            let instance: any = await Food.count({
                where:{
                    name: food
                }      
            });
            (instance===1) ? count+=1 : recipe_foods_names_unavailable.push(food); 
        }

        (count === foods_unique_name.length) ? next() : next(`Gli ingredienti: ${recipe_foods_names_unavailable} non sono presenti in catalogo!`)
    } catch(error){
        console.log(error);
        next(error);
    }
}