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
var webSocket_1 = require("rxjs/webSocket");
require('dotenv').config({ path: './../.env' });
global.WebSocket = require('ws');
//PER DOCKER
var Client_1 = (0, webSocket_1.webSocket)("ws://WebsocketServer:".concat(process.env.WS_PORT)); //Operatore
var Client_2 = (0, webSocket_1.webSocket)("ws://WebsocketServer:".concat(process.env.WS_PORT)); //Bilancia a bordo macchina 
/*
//PER DEV
const Client_1 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Operatore
const Client_2 = webSocket(`ws://localhost:${process.env.WS_PORT}`); //Bilancia a bordo macchina
*/
var check1, check2;
var weight = 0;
/*
I seguenti blocchi Client1.subscribe e Client2.subscribe, permettono ai due client di instaurare un canale
di comunicazione con il server in funzione (nel caso di sviluppo in locale sulla porta in env.WS_PORT; nel caso di
docker nel container chiamato WebsocketServer)
*/
Client_1.subscribe({
    // Next viene chiamato ogni volta che il client riceve un messaggio dal Server.
    next: function (msg) {
        check1 = JSON.parse(JSON.stringify(msg));
        console.log("\nOperatore: " + check1.message);
    },
    // Error viene chiamato se in un qualsiasi momento l'API Websocket riscontra un qualche errore.
    error: function (err) { return console.log(err); },
    //Complete viene chimato al momento della chiusura del canale di comunicazione con il server (per qualsiasi ragione)
    complete: function () { return console.log('Client_1 (Operatore) connessione terminata'); }
});
Client_2.subscribe({
    next: function (msg) {
        check2 = JSON.parse(JSON.stringify(msg));
        console.log("Bilancia: " + check2.message);
    },
    error: function (err) { return console.log(err); },
    complete: function () { return console.log('Client_2 (Bilancia) connessione terminata'); }
});
//operation legenda: 0 - Ordine preso in carico; 1 - ingresso zona di carico; 2 - uscita zona di carico; 3 - pesa dell'alimento ; 4 - ordine completato ; 5 - ordine fallito
/*

*/
function communicateToServerToGetChargingInfo(ingredients, id_order, add_weight) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Client_1.next({ operation: 0, id_order: id_order });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(communicateToServerToCheckSorting(ingredients, id_order, add_weight)); }, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function communicateToServerToCheckSorting(ingredients, id_order, add_weight) {
    return __awaiter(this, void 0, void 0, function () {
        var intervalID, ingredientsInRecipe, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ingredientsInRecipe = ingredients;
                    _loop_1 = function (i) {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    intervalID = setInterval(function () { (Client_2.next({ operation: 3, weight: weight })); }, 1000);
                                    //ENTRA
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(Client_1.next({ operation: 1, id_order: id_order, id_alimento: ingredientsInRecipe[i] })); }, 3000); })];
                                case 1:
                                    //ENTRA
                                    _b.sent();
                                    clearInterval(intervalID);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(communicateToServerToCheckQuantity(intervalID, ingredientsInRecipe[i], id_order, add_weight)); }, 1000); })];
                                case 2:
                                    _b.sent(); //permette di attendere il cambio di check1.status in caso di fallimento dell'ordine causa sorting
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < check1.num_Ingredients && check1.status == 1)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, new Promise(function (resolve) { return resolve(communicateToServerToCompletingOrder(id_order)); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function communicateToServerToCheckQuantity(intervalID, ingredient, id_order, add_weight) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(check1.status == 1)) return [3 /*break*/, 3];
                    intervalID = setInterval(function () { (weight = (weight + add_weight), Client_2.next({ operation: 3, weight: weight })); }, 1000);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(Client_1.next({ operation: 2, id_order: id_order, id_alimento: ingredient })); }, 6000); })];
                case 1:
                    _a.sent();
                    //ESCE
                    clearInterval(intervalID);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve({}); }, 1000); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    clearInterval(intervalID);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function communicateToServerToCompletingOrder(id_order) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (check1.status == 1) {
                Client_1.next({ operation: 4, id_order: id_order });
                weight = 0;
            }
            else {
                Client_1.next({ operation: 5, id_order: id_order });
                weight = 0;
            }
            return [2 /*return*/];
        });
    });
}
function disconnection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Client_1.unsubscribe();
            Client_2.unsubscribe();
            return [2 /*return*/];
        });
    });
}
/*
  L'esecuzione delle seguenti righe permette di simulare il processo di gestione di 3 ordini
  consequenziali, permettendoci di effettuare una simulazione del comportamento del server
  rispetto ai dati inviatigli dal client.
  (la prima riga simula un ordine fallito )
*/
communicateToServerToGetChargingInfo([4, 2, 5], 3, 4).then(//sort sbagliato, ORDINE FALLITO 
function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(communicateToServerToGetChargingInfo([2, 5, 3, 4, 1], 2, 4)); }, 1000); }).then(//sort giusto e quantità giuste, ORDINE COMPLETATO   
                function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(communicateToServerToGetChargingInfo([2, 5], 4, 17)); }, 1000); }).then(//sort giusto ma quantità sbagliate, ORDINE FALLITO 
                                function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { resolve(disconnection()); }, 1000); })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
