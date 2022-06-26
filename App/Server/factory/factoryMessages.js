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
exports.MessageFactory = exports.MsgEnum = exports.completeOrderFAIL = exports.completeOrderOK = exports.communicateWeight = exports.checkQuantityFAIL = exports.checkQuantityOK = exports.checkSortingFAIL = exports.checkSortingOK = exports.getChargingInfoFAIL = exports.getChargingInfoOK = exports.connectionEstablished = void 0;
var connectionEstablished = /** @class */ (function () {
    function connectionEstablished() {
        this.status = 1;
    }
    connectionEstablished.prototype.getMsg = function () {
        return { status: this.status, message: "Connessione Stabilita!\n" };
    };
    return connectionEstablished;
}());
exports.connectionEstablished = connectionEstablished;
var getChargingInfoOK = /** @class */ (function () {
    function getChargingInfoOK(recived, num_Ingredients) {
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    getChargingInfoOK.prototype.getMsg = function () {
        return { status: this.status, num_Ingredients: this.num_Ingredients, message: "Ordine ".concat(this.recived.id_order, " preso in carico!\n") };
    };
    return getChargingInfoOK;
}());
exports.getChargingInfoOK = getChargingInfoOK;
var getChargingInfoFAIL = /** @class */ (function () {
    function getChargingInfoFAIL(recived) {
        this.status = 0;
        this.recived = recived;
    }
    getChargingInfoFAIL.prototype.getMsg = function () {
        return { status: this.status, message: "Ordine ".concat(this.recived.id_order, " \u00E8 gi\u00E0 stato preso in carico precedentemente!\n") };
    };
    return getChargingInfoFAIL;
}());
exports.getChargingInfoFAIL = getChargingInfoFAIL;
var checkSortingOK = /** @class */ (function () {
    function checkSortingOK(recived, num_Ingredients) {
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    checkSortingOK.prototype.getMsg = function () {
        return { status: this.status, num_Ingredients: this.num_Ingredients, message: "Sei entrato nella zona dell'alimento con id: ".concat(this.recived.id_alimento, "!\n") };
    };
    return checkSortingOK;
}());
exports.checkSortingOK = checkSortingOK;
var checkSortingFAIL = /** @class */ (function () {
    function checkSortingFAIL(recived) {
        this.status = 0;
        this.recived = recived;
    }
    checkSortingFAIL.prototype.getMsg = function () {
        return { status: this.status, message: "Sei entrato nella zona di carico sbagliata!\n" };
    };
    return checkSortingFAIL;
}());
exports.checkSortingFAIL = checkSortingFAIL;
var checkQuantityOK = /** @class */ (function () {
    function checkQuantityOK(recived, num_Ingredients) {
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    checkQuantityOK.prototype.getMsg = function () {
        return { status: this.status, num_Ingredients: this.num_Ingredients, message: "Sei uscito dalla zona di carico dell'alimento: ".concat(this.recived.id_alimento, "! La bilancia restituisce un peso conforme!\n") };
    };
    return checkQuantityOK;
}());
exports.checkQuantityOK = checkQuantityOK;
var checkQuantityFAIL = /** @class */ (function () {
    function checkQuantityFAIL(recived) {
        this.status = 0;
        this.recived = recived;
    }
    checkQuantityFAIL.prototype.getMsg = function () {
        return { status: this.status, message: "Sei uscito dalla zona di carico dell'alimento: ".concat(this.recived.id_alimento, "! La bilancia restituisce un peso non conforme!\n") };
    };
    return checkQuantityFAIL;
}());
exports.checkQuantityFAIL = checkQuantityFAIL;
var communicateWeight = /** @class */ (function () {
    function communicateWeight(recived) {
        this.recived = recived;
    }
    communicateWeight.prototype.getMsg = function () {
        return { message: "Hai caricato ".concat(this.recived.weight, " kg! Timestamp: ").concat(Date.now()) };
    };
    return communicateWeight;
}());
exports.communicateWeight = communicateWeight;
var completeOrderOK = /** @class */ (function () {
    function completeOrderOK(recived) {
        this.recived = recived;
    }
    completeOrderOK.prototype.getMsg = function () {
        return { message: "ORDINE ".concat(this.recived.id_order, " COMPLETATO\n") };
    };
    return completeOrderOK;
}());
exports.completeOrderOK = completeOrderOK;
var completeOrderFAIL = /** @class */ (function () {
    function completeOrderFAIL(recived) {
        this.recived = recived;
    }
    completeOrderFAIL.prototype.getMsg = function () {
        return { message: "ORDINE ".concat(this.recived.id_order, " FALLITO\n") };
    };
    return completeOrderFAIL;
}());
exports.completeOrderFAIL = completeOrderFAIL;
var MsgEnum;
(function (MsgEnum) {
    MsgEnum[MsgEnum["connectionEstablished"] = 0] = "connectionEstablished";
    MsgEnum[MsgEnum["getChargingInfoOK"] = 1] = "getChargingInfoOK";
    MsgEnum[MsgEnum["getChargingInfoFAIL"] = 2] = "getChargingInfoFAIL";
    MsgEnum[MsgEnum["checkSortingOK"] = 3] = "checkSortingOK";
    MsgEnum[MsgEnum["checkSortingFAIL"] = 4] = "checkSortingFAIL";
    MsgEnum[MsgEnum["checkQuantityOK"] = 5] = "checkQuantityOK";
    MsgEnum[MsgEnum["checkQuantityFAIL"] = 6] = "checkQuantityFAIL";
    MsgEnum[MsgEnum["communicateWeight"] = 7] = "communicateWeight";
    MsgEnum[MsgEnum["completeOrderOK"] = 8] = "completeOrderOK";
    MsgEnum[MsgEnum["completeOrderFAIL"] = 9] = "completeOrderFAIL";
})(MsgEnum = exports.MsgEnum || (exports.MsgEnum = {}));
var MessageFactory = /** @class */ (function () {
    function MessageFactory() {
    }
    MessageFactory.prototype.getMessageResponse = function (Message_type, ws, recived, num_Ingredients) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ws.send(JSON.stringify(this.getMessage(Message_type, recived, num_Ingredients).getMsg()))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MessageFactory.prototype.getMessage = function (type, recived, num_Ingredients) {
        var retval = null;
        switch (type) {
            case MsgEnum.connectionEstablished:
                retval = new connectionEstablished();
                break;
            case MsgEnum.getChargingInfoOK:
                retval = new getChargingInfoOK(recived, num_Ingredients);
                break;
            case MsgEnum.getChargingInfoFAIL:
                retval = new getChargingInfoFAIL(recived);
                break;
            case MsgEnum.checkSortingOK:
                retval = new checkSortingOK(recived, num_Ingredients);
                break;
            case MsgEnum.checkSortingFAIL:
                retval = new checkSortingFAIL(recived);
                break;
            case MsgEnum.checkQuantityOK:
                retval = new checkQuantityOK(recived, num_Ingredients);
                break;
            case MsgEnum.checkQuantityFAIL:
                retval = new checkQuantityFAIL(recived);
                break;
            case MsgEnum.communicateWeight:
                retval = new communicateWeight(recived);
                break;
            case MsgEnum.completeOrderOK:
                retval = new completeOrderOK(recived);
                break;
            case MsgEnum.completeOrderFAIL:
                retval = new completeOrderFAIL(recived);
                break;
        }
        return retval;
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;
