"use strict";
exports.__esModule = true;
exports.verifyJSON = exports.verifyJWT = exports.verifyToken = exports.verifyHeaderContentType = exports.verifyHeaderAuthorization = void 0;
var factoryError_1 = require("../factory/factoryError");
var jwt = require('jsonwebtoken');
require('dotenv').config({ path: './../../.env' });
var factory = new factoryError_1.ErrorFactory();
//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DELL'HEADER AUTHORIZATION NELLA REQUEST
function verifyHeaderAuthorization(req, res, next) {
    req.headers.authorization ? next() : next(factory.getErrorResponse(factoryError_1.ErrEnum.HeaderAuthEmpty, res));
}
exports.verifyHeaderAuthorization = verifyHeaderAuthorization;
//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DELL'HEADER CONTENT-TYPE NELLA REQUEST
function verifyHeaderContentType(req, res, next) {
    req.headers["content-type"] == "application/json" ? next() : next(factory.getErrorResponse(factoryError_1.ErrEnum.BadHeaderContentType, res));
}
exports.verifyHeaderContentType = verifyHeaderContentType;
//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DEL TOKEN JWT ALL'INTERO DELL'HEADER AITHORIZATION ED ESTRAZIONE DEL TOKEN JWT IN APPOSITO ATTRIBUTO DELLA REQUEST
function verifyToken(req, res, next) {
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        var bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(factory.getErrorResponse(factoryError_1.ErrEnum.UndefinedToken, res));
    }
}
exports.verifyToken = verifyToken;
//FUNZIONE MIDDLEWARE PER DECODIFICARE IL TOKEN JWT E INSERIRLO IN APPOSITO ATTRIBUTO DELLA REQUEST
function verifyJWT(req, res, next) {
    var decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    if (decoded !== null)
        req.user = decoded;
    next();
}
exports.verifyJWT = verifyJWT;
//FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL BODY DELLA REQUEST SIA UN TESTO IN FORMATO JSON
function verifyJSON(req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    next();
}
exports.verifyJSON = verifyJSON;
