import * as midd_functions_general from "./midd_functions_Generics";
import * as midd_functions_foods from "./midd_functions_Foods";
import * as midd_functions_orders from "./midd_functions_Orders";
import * as midd_functions_recipes from "./midd_functions_Recipes";
import * as midd_functions_roles from "./midd_functions_Roles";

//In questo file vengono generati gli elenchi dei middlewares che verranno utilizzati dalle rispettive rotte
//al fine di eseguire i controlli di conformità sulla request effettuata dal client e successivamente sull'input
//contenuto nel body della request.

//Per semplicità è stata creata questa variabile d'appoggio contenente quelle funzioni middleware che utilizzate
//da tutte le rotte.
const header_midd = [
    midd_functions_general.verifyHeaderAuthorization,
    midd_functions_general.verifyHeaderContentType,
    midd_functions_general.verifyToken,
    midd_functions_general.verifyJWT,
    midd_functions_general.verifyJSON
];

//FUNZIONI MIDDLEWARE PER LA CREAZIONE DI UN ORDINE
export const create_order = [
    header_midd,
    midd_functions_roles.verifyUser,
    midd_functions_orders.verifyRecipe,
    midd_functions_orders.verifyFoodAvailabilityByRate
];

//FUNZIONI MIDDLEWARE PER LA CREAZIONE DI UNA RICETTA
export const create_recipe = [
    header_midd,
    midd_functions_roles.verifyAdmin,
    midd_functions_recipes.verifyExistingRecipe,
    midd_functions_recipes.verifyRateSum,
    midd_functions_recipes.verifyFoodsUnique,
    midd_functions_foods.verifyFoodsInDB
];

//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLA GIACENZA DEGLI ALIMENTI, SPECIFICATI DALL'UTENTE, IN MAGAZZINO
export const check_availability = [
  header_midd,
  midd_functions_roles.verifyUser,
  midd_functions_foods.verifyFoodsInDB
];

//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLA GIACENZA DI TUTTI GLI ALIMENTI IN MAGAZZINO
export const check_availability_all = [
  header_midd,
  midd_functions_roles.verifyUser
];

//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLO STATUS DI UN ORDINE
export const order_status = [
   header_midd,
   midd_functions_orders.verifyExistingOrder,
   midd_functions_orders.verifyAdminOrItsUser
];

//FUNZIONI MIDDLEWARE PER LA MODIFICA DELLA GIACENZA DI UN ALIMENTO IN MAGAZZINO
export const update_storage = [
   header_midd,
   midd_functions_roles.verifyUser,
   midd_functions_foods.verifyFoodInDB,
   midd_functions_foods.verifyFoodAvailabilityInStorage
];