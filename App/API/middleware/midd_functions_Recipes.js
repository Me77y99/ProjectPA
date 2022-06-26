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
exports.verifyFoodsUnique = exports.verifyRateSum = exports.verifyExistingRecipe = void 0;
var Recipe_1 = require("../model/Recipe");
/*
FUNZIONE MIDDLEWARE PER CONTROLLARE CHE LA RICETTA DI CUI SI È RICHIESTA LA CREAZIONE NON ABBIA LO STESSO NOME DI UNA RICETTA PRE-ESISTENTE

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica che nel DB non sia presente una ricetta con lo stesso nome di quella che si è richiesto di creare.
*/
function verifyExistingRecipe(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var recipe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Recipe_1.Recipe.findOne({ where: { name: req.body.name } })];
                case 1:
                    recipe = _a.sent();
                    (recipe) ? next("Esiste già una ricetta con lo stesso nome!") : next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.verifyExistingRecipe = verifyExistingRecipe;
/*
FUNZIONE MIDDLEWARE PER CONTROLLARE LA CONFORMITÀ DEI RATE NELLA RICETTA DA CREARE

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica che la somma dei rate, espressi negli ingredienti che compongono la ricetta, sia conforme, ovvero, uguale a 100.
*/
function verifyRateSum(req, res, next) {
    var totalRate = 0;
    for (var _i = 0, _a = req.body.foods; _i < _a.length; _i++) {
        var recipe_food = _a[_i];
        totalRate += Number(recipe_food.rate);
    }
    (totalRate === 100) ? next() : next("La somma delle percentuali degli ingredienti che compongono la ricetta non è uguale al 100%");
}
exports.verifyRateSum = verifyRateSum;
/*
FUNZIONE MIDDLEWARE PER CONTROLLARE LA PRESENZA DI ELEMENTI DUPLICATI NELL'ELENCO DEGLI INGREDIENTI DELLA RICETTA

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica all'interno dell'elenco degli ingredienti che compongono la ricetta non siano presenti alimenti con lo stesso nome.
Per fare questo viene popolato un array di stringhe prendendo l'elenco degli alimenti nel body della request e processandolo con
map per rendere tutti i nomi in maiuscolo, successivamente con una prima filter per conservare tutti gli elementi duplicati nell'elenco
e infine con una seconda filter per mantenere un elemento per elemento duplicato, nel caso in cui l'array finale contenga almeno un elemento
viene restituito il relativo errore.
*/
function verifyFoodsUnique(req, res, next) {
    var foods_repeated_names = req.body.foods.map(function (item) { return item.name.toUpperCase(); })
        .filter(function (value, index, self) { return self.indexOf(value) != index; }) // array con nomi ripetuti con possibilità doppioni
        .filter(function (value, index, self) { return self.indexOf(value) === index; }); // array con nomi ripetuti univoci
    (foods_repeated_names.length > 0) ? next("Nella ricetta i seguenti elementi sono ripetuti pi\u00F9 volte: ".concat(Array.from(foods_repeated_names))) : next();
}
exports.verifyFoodsUnique = verifyFoodsUnique;
