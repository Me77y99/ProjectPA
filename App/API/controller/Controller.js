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
exports.updateStorage = exports.orderState = exports.createRecipe = exports.createOrder = exports.checkAvailabilityAll = exports.checkAvailability = void 0;
var Order_1 = require("../model/Order");
var Recipe_1 = require("../model/Recipe");
var Food_1 = require("../model/Food");
var Recipe_foods_1 = require("../model/Recipe_foods");
//CONTROLLER DI VISUALIZZAZIONE GIACENZA DEGLI ALIMENTI, RICHIESTI DALL'UTENTE, IN MAGAZZINO
//La funzione crea un array di stringhe contenente tutti i nomi degli alimenti richiesti dall'utente,
//processando la lista nel body della request inizialmente con map per renderli tutti in maiuscolo e
//successivamente con filter per evitare di fare interrogazioni identiche in caso di presenza di alimenti
//duplicati nella lista di alimenti fornita dall'utente; infine tramite un ciclo for viene popolato
//un array di stringhe con tutti i gli alimenti richiesti e la rispettiva giacenza in magazzino.
function checkAvailability(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var foods_unique_names, foods_and_quantity, _i, foods_unique_names_1, food, food_found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foods_unique_names = req.body.foods.map(function (item) { return item.name.toUpperCase(); })
                        .filter(function (value, index, self) { return self.indexOf(value) === index; });
                    foods_and_quantity = [];
                    _i = 0, foods_unique_names_1 = foods_unique_names;
                    _a.label = 1;
                case 1:
                    if (!(_i < foods_unique_names_1.length)) return [3 /*break*/, 4];
                    food = foods_unique_names_1[_i];
                    return [4 /*yield*/, Food_1.Food.findOne({
                            where: { name: food }
                        })];
                case 2:
                    food_found = _a.sent();
                    foods_and_quantity.push("".concat(food_found.name, ", disponibilit\u00E0: ").concat(food_found.dataValues.quantity));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    res.status(201).send(foods_and_quantity);
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkAvailability = checkAvailability;
//CONTROLLER DI VISUALIZZAZIONE GIACENZA DI TUTTI GLI ALIMENTI IN MAGAZZINO
function checkAvailabilityAll(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var foods, foods_and_quantity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Food_1.Food.findAll()];
                case 1:
                    foods = _a.sent();
                    foods_and_quantity = foods.map(function (food) { return "".concat(food.name, ", disponibilit\u00E0: ").concat(food.dataValues.quantity); });
                    res.status(201).send(foods_and_quantity);
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkAvailabilityAll = checkAvailabilityAll;
//CONTROLLER DI CREAZIONE DI UN ORDINE
//La funzione prende dalla request tutte le informazioni necessarie
//per la creazione di un ordine, il cui stato viene impostato a CREATO
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Order_1.Order.create({
                        user_id: req.user.id,
                        recipe_id: req.body.recipe_id,
                        quantity: req.body.quantity,
                        status: "CREATO"
                    })];
                case 1:
                    _a.sent();
                    res.status(201).send("Ordine creato correttamente");
                    return [2 /*return*/];
            }
        });
    });
}
exports.createOrder = createOrder;
//CONTROLLER DI CREAZIONE DI UNA RICETTA
//La funzione prende dalla request tutte le informazioni necessarie
//per la creazione di una ricetta (record di tipo Recipe contenente id e nome della ricetta).
//Effettuata la creazione della ricetta procede tramite il ciclo for alla creazione dei record di tipo Recipe_foods
//che saranno necessari per verificare la corretta esecuzione di un ordine in cui è stata richiesta quella ricetta.
//(i record di tipo Recipe_foods contengono: id_ricetta, id_alimento, valore di ordinamento e rate percentuale)
function createRecipe(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var recipe, _i, _a, ingredient, food;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Recipe_1.Recipe.create({
                        name: req.body.name
                    })];
                case 1:
                    recipe = _b.sent();
                    _i = 0, _a = req.body.foods;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    ingredient = _a[_i];
                    return [4 /*yield*/, Food_1.Food.findOne({ where: { name: ingredient.name } })];
                case 3:
                    food = (_b.sent());
                    return [4 /*yield*/, Recipe_foods_1.Recipe_foods.create({
                            recipe_id: recipe.dataValues.id,
                            food_id: food.dataValues.id,
                            sort: req.body.foods.indexOf(ingredient) + 1,
                            rate: ingredient.rate
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    res.status(201).send("Ricetta ".concat(recipe.dataValues.name, " creata correttamente"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createRecipe = createRecipe;
//CONTROLLER DI VISUALIZZAZIONE STATUS ORDINE
function orderState(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.status(201).send("Lo status dell'ordine \u00E8: ".concat(req.orderStatus));
            return [2 /*return*/];
        });
    });
}
exports.orderState = orderState;
//CONTROLLER DI MODIFICA DELLA GIACENZA DI UN ALIMENTO IN MAGAZZINO
function updateStorage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var foodUpdated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Food_1.Food.increment({ quantity: Number(req.body.quantity) }, { where: { name: req.body.name } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Food_1.Food.findOne({ where: { name: req.body.name } })];
                case 2:
                    foodUpdated = _a.sent();
                    return [4 /*yield*/, res.status(201).send("La quantit\u00E0 dell'alimento ".concat(req.body.name, " \u00E8 stata modificata di ").concat(req.body.quantity, "kg ed attualmente \u00E8 ").concat(foodUpdated.dataValues.quantity, "kg"))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateStorage = updateStorage;
