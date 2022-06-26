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
require('dotenv').config({ path: './../.env' });
var ws_1 = require("ws");
var factoryMessages_1 = require("./factory/factoryMessages");
var Order_1 = require("./model/Order");
var Recipe_foods_1 = require("./model/Recipe_foods");
//PER DOCKER
var wss = new ws_1.WebSocketServer("ws://WebsocketServer:".concat(process.env.WS_PORT));
//PER DEV
//const wss = new WebSocketServer({port: process.env.WS_PORT});
var recived;
var weight;
var infoIngredients = [];
var count = 0;
var factory = new factoryMessages_1.MessageFactory();
function getChargingInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var err_per, quantityFoodToTake, quantityMin, quantityMax, generalMin, generalMax, recipeFoods, order, _i, infoIngredients_1, food;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    err_per = Number(process.env.ERROR_PERCENTAGE);
                    generalMin = 0, generalMax = 0;
                    return [4 /*yield*/, Order_1.Order.findOne({ where: { id: recived.id_order }, raw: true, plain: true })];
                case 1:
                    order = _a.sent();
                    if (!(order.status == "CREATO")) return [3 /*break*/, 4];
                    return [4 /*yield*/, Recipe_foods_1.Recipe_foods.findAll({ where: { recipe_id: order.recipe_id }, raw: true })];
                case 2:
                    recipeFoods = _a.sent();
                    infoIngredients = recipeFoods.map(function (food) {
                        quantityFoodToTake = (Number(order.quantity) * food.rate) / 100;
                        quantityMin = quantityFoodToTake - (quantityFoodToTake * err_per) / 100;
                        quantityMax = quantityFoodToTake + (quantityFoodToTake * err_per) / 100;
                        generalMin = generalMin + quantityMin;
                        generalMax = generalMax + quantityMax;
                        return ({ food_id: food.food_id, sort: food.sort, generalMin: generalMin, generalMax: generalMax });
                    });
                    console.log("\nOrdine ".concat(order.id, " \nDi seguito vengono riportati l'id degli alimenti all'interno della ricetta ordinata con id: ").concat(order.recipe_id, " corredati di quantit\u00E0 minima e massima da rispettare"));
                    for (_i = 0, infoIngredients_1 = infoIngredients; _i < infoIngredients_1.length; _i++) {
                        food = infoIngredients_1[_i];
                        console.log("id: ".concat(food.food_id, " , quantit\u00E0 minima: ").concat(Math.round(food.generalMin * 100) / 100, " Kg, quantit\u00E0 massima: ").concat(Math.round(food.generalMax * 100) / 100, " Kg "));
                    }
                    return [4 /*yield*/, Order_1.Order.update({ status: "IN ESECUZIONE" }, { where: { id: recived.id_order } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
;
function checkSorting() {
    return __awaiter(this, void 0, void 0, function () {
        var order, food_sorting, roundFood;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Order_1.Order.findOne({ where: { id: recived.id_order }, raw: true, plain: true })];
                case 1:
                    order = _a.sent();
                    if (!(order.status === "IN ESECUZIONE")) return [3 /*break*/, 5];
                    food_sorting = infoIngredients.map(function (food) {
                        return ({ food_id: food.food_id, sort: food.sort });
                    });
                    count++;
                    roundFood = food_sorting.find(function (food) { return food.sort === count; });
                    if (!(roundFood.food_id === recived.id_alimento)) return [3 /*break*/, 2];
                    return [2 /*return*/, true];
                case 2:
                    count = 0; //in caso di fallimento dell'ordine riazzeriamo il count per le future richieste provenienti dal client in quanto non riavviando il server count viene mantenuto all'ultimo valore
                    return [4 /*yield*/, Order_1.Order.update({ status: "FALLITO" }, { where: { id: recived.id_order } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, false];
                case 4: return [3 /*break*/, 6];
                case 5: return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function checkQuantity() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(weight >= infoIngredients[count - 1].generalMin && weight <= infoIngredients[count - 1].generalMax)) return [3 /*break*/, 1];
                    return [2 /*return*/, true];
                case 1:
                    count = 0;
                    return [4 /*yield*/, Order_1.Order.update({ status: "FALLITO" }, { where: { id: recived.id_order } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, false];
            }
        });
    });
}
function completeOrder() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //Cambia lo status dell'ordine in COMPLETATO nel momento in cui il Client_1 comunica di aver terminato tutte le operazioni di carico
                    count = 0;
                    return [4 /*yield*/, Order_1.Order.update({ status: "COMPLETATO" }, { where: { id: recived.id_order } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
wss.on('connection', function connection(ws) {
    factory.getMessageResponse(factoryMessages_1.MsgEnum.connectionEstablished, ws);
    ws.on('message', function message(data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        recived = JSON.parse(data);
                        _a = recived.operation;
                        switch (_a) {
                            case 0: return [3 /*break*/, 1];
                            case 1: return [3 /*break*/, 3];
                            case 2: return [3 /*break*/, 5];
                            case 3: return [3 /*break*/, 7];
                            case 4: return [3 /*break*/, 8];
                            case 5: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, getChargingInfo()];
                    case 2:
                        ((_b.sent()) === true) ? factory.getMessageResponse(factoryMessages_1.MsgEnum.getChargingInfoOK, ws, recived, infoIngredients.length) :
                            factory.getMessageResponse(factoryMessages_1.MsgEnum.getChargingInfoFAIL, ws, recived);
                        return [3 /*break*/, 11];
                    case 3: return [4 /*yield*/, checkSorting()];
                    case 4:
                        ((_b.sent()) === true) ? factory.getMessageResponse(factoryMessages_1.MsgEnum.checkSortingOK, ws, recived, infoIngredients.length) :
                            factory.getMessageResponse(factoryMessages_1.MsgEnum.checkSortingFAIL, ws, recived);
                        return [3 /*break*/, 11];
                    case 5: return [4 /*yield*/, checkQuantity()];
                    case 6:
                        ((_b.sent()) === true) ? factory.getMessageResponse(factoryMessages_1.MsgEnum.checkQuantityOK, ws, recived, infoIngredients.length) :
                            factory.getMessageResponse(factoryMessages_1.MsgEnum.checkQuantityFAIL, ws, recived);
                        return [3 /*break*/, 11];
                    case 7:
                        weight = recived.weight;
                        factory.getMessageResponse(factoryMessages_1.MsgEnum.communicateWeight, ws, recived);
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, completeOrder()];
                    case 9:
                        _b.sent();
                        factory.getMessageResponse(factoryMessages_1.MsgEnum.completeOrderOK, ws, recived);
                        return [3 /*break*/, 11];
                    case 10:
                        factory.getMessageResponse(factoryMessages_1.MsgEnum.completeOrderFAIL, ws, recived);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    });
    ws.on('close', function close() {
        console.log("Client disconnesso");
    });
});
