"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.verifyRecipe = exports.verifyQuantityOrder = exports.verifyExistingOrder = exports.verifyFoodAvailabilityByRate = exports.verifyAdminOrItsUser = void 0;
var Food_1 = require("../model/Food");
var Order_1 = require("../model/Order");
var Recipe_1 = require("../model/Recipe");
var Recipe_foods_1 = require("../model/Recipe_foods");
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DEL RUOLO E DELL'ID DELL'UTENTE CHE RICHIEDE LA VISUALIZZAZIONE DELLO STATUS DI UN ORDINE

Questa funzione viene raggiunta dalla rotta /order-status

Verifica che il ruolo dell'utente che ha richiesto la visualizzazione dello status di un determinato ordine sia un admin o l'utente che ha
effettivamente creato l'ordine.
*/
function verifyAdminOrItsUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Order_1.Order.findOne({
                        where: {
                            id: Number(req.body.order_id)
                        }
                    })];
                case 1:
                    order = _a.sent();
                    req.orderStatus = order.dataValues.status;
                    (req.user.role === "admin" || Number(req.user.id) === order.dataValues.user_id) ? next() : next("Solo gli admin o l'utente che ha creato l'ordine possono visualizzarne lo status");
                    return [2 /*return*/];
            }
        });
    });
}
exports.verifyAdminOrItsUser = verifyAdminOrItsUser;
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA DISPONIBILITÀ DI ALIMENTI IN MAGAZZINO PER IL SODDISFACIMENTO DI UN ORDINE

Questa funzione viene raggiunta dalla rotta /create-order.

Controlla che le giacenze in magazzino di tutti gli alimenti richiesti per una determinata ricetta siano sufficienti per soddisfare
l'ordine che richiede una determinata quantità di quella ricetta.

Viene popolato un Array attraverso la funzione sequelize .findAll che trova tutte le occorrenze all'interno della tabella recipe_foods che contengono
l'id della ricetta richiesta nell'ordine, quindi conterrà i dati relativi a ciascun ingrediente della ricetta in particolare il Rate Percentuale.

Successivamente attraverso un ciclo for vengono controllati tutti gli ingredienti richiesti;
viene calcolata la quantità richiesta per soddisfare l'ordine e confrontata con la quantità in giacenza nel magazzino.

Nel caso in cui la giacenza di un determinato alimento non permetta di soddisfare l'ordine, questo alimento viene inserito nell'array foods_unavailable.
Se sono presenti alimenti con giacenza insufficiente questi vengono mostrati nell'errore.
*/
function verifyFoodAvailabilityByRate(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var foods_avaiable, foods_unavaiable, recipe_foods, _i, recipe_foods_1, recipe_food, required_quantity_of_food, food, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foods_avaiable = [];
                    foods_unavaiable = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, Recipe_foods_1.Recipe_foods.findAll({
                            attributes: { exclude: ['id'] },
                            where: {
                                recipe_id: req.body.recipe_id
                            }
                        })];
                case 2:
                    recipe_foods = _a.sent();
                    _i = 0, recipe_foods_1 = recipe_foods;
                    _a.label = 3;
                case 3:
                    if (!(_i < recipe_foods_1.length)) return [3 /*break*/, 6];
                    recipe_food = recipe_foods_1[_i];
                    required_quantity_of_food = (req.body.quantity * recipe_food.dataValues.rate) / 100;
                    return [4 /*yield*/, Food_1.Food.findOne({ where: { id: recipe_food.dataValues.food_id } })];
                case 4:
                    food = _a.sent();
                    (required_quantity_of_food < food.quantity) ? foods_avaiable.push(food.name) : foods_unavaiable.push(food.name);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    (foods_unavaiable.length > 0) ? next("Quantit\u00E0 insufficiente di: ".concat(foods_unavaiable)) : next();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.verifyFoodAvailabilityByRate = verifyFoodAvailabilityByRate;
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELL'EFFETTIVA ESISTENZA DELL'ORDINE DI CUI È STATO RICHIESTO LO STATUS

Questa funzione viene raggiunta dalla rotta /order-status

Controlla che all'interno del DB sia effettivamente presente l'ordine di cui è stato richiesto lo status
*/
function verifyExistingOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Order_1.Order.findOne({
                        where: {
                            id: Number(req.body.order_id)
                        }
                    })];
                case 1:
                    order = _a.sent();
                    (order) ? next() : next("L'ordine richiesto è inesistente!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.verifyExistingOrder = verifyExistingOrder;
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA QUANTITÀ DELL'ORDINE RICHIESTO

Questa funzione viene raggiunta dalla rotta /create-order.

Controlla che la quantità espressa nell'ordine sia un numero maggiore di zero.
*/
function verifyQuantityOrder(req, res, next) {
    (req.body.quantity > 0) ? next() : next("La quantità deve essere maggiore di 0");
}
exports.verifyQuantityOrder = verifyQuantityOrder;
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA PRESENZA NEL DB DELLA RICETTA RICHIESTA DA UN DETERMINATO ORDINE

Questa funzione viene raggiunta dalla rotta /create-order.

Verifica che la ricetta espressa all'interno del body della request sia presente all'interno del DB
*/
function verifyRecipe(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var recipe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Recipe_1.Recipe.findOne({
                        where: {
                            name: req.body.recipe_name
                        }
                    })];
                case 1:
                    recipe = _a.sent();
                    recipe ? (req.body.recipe_id = recipe.dataValues.id, next()) : next("La ricetta non è presente in catalogo");
                    return [2 /*return*/];
            }
        });
    });
}
exports.verifyRecipe = verifyRecipe;
