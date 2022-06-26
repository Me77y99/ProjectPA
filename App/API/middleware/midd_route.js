"use strict";
exports.__esModule = true;
exports.update_storage = exports.order_status = exports.check_availability_all = exports.check_availability = exports.create_recipe = exports.create_order = void 0;
var midd_functions_general = require("./midd_functions_Generics");
var midd_functions_foods = require("./midd_functions_Foods");
var midd_functions_orders = require("./midd_functions_Orders");
var midd_functions_recipes = require("./midd_functions_Recipes");
var midd_functions_roles = require("./midd_functions_Roles");
//In questo file vengono generati gli elenchi dei middlewares che verranno utilizzati dalle rispettive rotte
//al fine di eseguire i controlli di conformità sulla request effettuata dal client e successivamente sull'input
//contenuto nel body della request.
//Per semplicità è stata creata questa variabile d'appoggio contenente quelle funzioni middleware che utilizzate
//da tutte le rotte.
var header_midd = [
    midd_functions_general.verifyHeaderAuthorization,
    midd_functions_general.verifyHeaderContentType,
    midd_functions_general.verifyToken,
    midd_functions_general.verifyJWT,
    midd_functions_general.verifyJSON
];
//FUNZIONI MIDDLEWARE PER LA CREAZIONE DI UN ORDINE
exports.create_order = [
    header_midd,
    midd_functions_roles.verifyUser,
    midd_functions_orders.verifyRecipe,
    midd_functions_orders.verifyFoodAvailabilityByRate
];
//FUNZIONI MIDDLEWARE PER LA CREAZIONE DI UNA RICETTA
exports.create_recipe = [
    header_midd,
    midd_functions_roles.verifyAdmin,
    midd_functions_recipes.verifyExistingRecipe,
    midd_functions_recipes.verifyRateSum,
    midd_functions_recipes.verifyFoodsUnique,
    midd_functions_foods.verifyFoodsInDB
];
//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLA GIACENZA DEGLI ALIMENTI, SPECIFICATI DALL'UTENTE, IN MAGAZZINO
exports.check_availability = [
    header_midd,
    midd_functions_roles.verifyUser,
    midd_functions_foods.verifyFoodsInDB
];
//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLA GIACENZA DI TUTTI GLI ALIMENTI IN MAGAZZINO
exports.check_availability_all = [
    header_midd,
    midd_functions_roles.verifyUser
];
//FUNZIONI MIDDLEWARE PER LA VISUALIZZAZIONE DELLO STATUS DI UN ORDINE
exports.order_status = [
    header_midd,
    midd_functions_orders.verifyExistingOrder,
    midd_functions_orders.verifyAdminOrItsUser
];
//FUNZIONI MIDDLEWARE PER LA MODIFICA DELLA GIACENZA DI UN ALIMENTO IN MAGAZZINO
exports.update_storage = [
    header_midd,
    midd_functions_roles.verifyUser,
    midd_functions_foods.verifyFoodInDB,
    midd_functions_foods.verifyFoodAvailabilityInStorage
];
