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
exports.verifyFoodsInDB = exports.verifyFoodInDB = exports.verifyFoodAvailabilityInStorage = void 0;
var Food_1 = require("../model/Food");
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
function verifyFoodAvailabilityInStorage(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var quantity, food, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quantity = Number(req.body.quantity);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Food_1.Food.findOne({ where: { name: req.body.name } })];
                case 2:
                    food = _a.sent();
                    if (quantity < 0) {
                        if (Math.abs(quantity) <= food.dataValues.quantity) {
                            next();
                        }
                        else {
                            next("Attenzione! La quantità da ritirare eccede le giacenze in magazzino!");
                        }
                    }
                    else if (quantity > 0) {
                        next();
                    }
                    else if (quantity == 0) {
                        next("Inserire una quantità diversa da Zero!");
                    }
                    else {
                        next("Attenzione! È necessario inserire un numero per effettuare la modifica della giacenza");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.verifyFoodAvailabilityInStorage = verifyFoodAvailabilityInStorage;
/*
FUNZIONE MIDDLEWARE PER IL CONTROLLO DELLA PRESENZA DI UN DETERMINATO ALIMENTO ALL'INTERNO DEL DB
(caso con un solo alimento all'interno del body della request)

Questa funzione viene raggiunta dalla rotta /update-storage e controlla che l'alimento di cui è stata richiesta la modifica di giacenza
sia effettivamente presente nel DB.
*/
function verifyFoodInDB(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var food;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Food_1.Food.findOne({ where: { name: req.body.name } })];
                case 1:
                    food = _a.sent();
                    (food) ? next() : next("L'alimento richiesto non è presente in catalogo!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.verifyFoodInDB = verifyFoodInDB;
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
function verifyFoodsInDB(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var count, recipe_foods_names_unavailable, foods_unique_name, _i, foods_unique_name_1, food, instance, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = 0;
                    recipe_foods_names_unavailable = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    foods_unique_name = req.body.foods.map(function (item) { return item.name.toUpperCase(); })
                        .filter(function (value, index, self) { return self.indexOf(value) === index; });
                    _i = 0, foods_unique_name_1 = foods_unique_name;
                    _a.label = 2;
                case 2:
                    if (!(_i < foods_unique_name_1.length)) return [3 /*break*/, 5];
                    food = foods_unique_name_1[_i];
                    return [4 /*yield*/, Food_1.Food.count({
                            where: {
                                name: food
                            }
                        })];
                case 3:
                    instance = _a.sent();
                    (instance === 1) ? count += 1 : recipe_foods_names_unavailable.push(food);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    (count === foods_unique_name.length) ? next() : next("Gli ingredienti: ".concat(recipe_foods_names_unavailable, " non sono presenti in catalogo!"));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.log(error_2);
                    next(error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.verifyFoodsInDB = verifyFoodsInDB;
