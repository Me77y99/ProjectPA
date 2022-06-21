import { ErrorFactory , ErrEnum } from "../factory/factoryError";
const jwt = require('jsonwebtoken');
require('dotenv').config({path : './../../../.env'})

let factory:ErrorFactory  = new ErrorFactory();




//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DELL'HEADER AUTHORIZATION NELLA REQUEST
export function verifyHeaderAuthorization (req: any, res:any, next: any): void{
    req.headers.authorization ? next() : next(factory.getErrorResponse(ErrEnum.HeaderAuthEmpty , res));
}

//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DELL'HEADER CONTENT-TYPE NELLA REQUEST
export function verifyHeaderContentType(req: any, res:any, next: any): void{
    req.headers["content-type"] == "application/json" ? next() : next(factory.getErrorResponse(ErrEnum.BadHeaderContentType , res));
}

//FUNZIONE MIDDLEWARE PER VERIFICARE LA PRESENZA DEL TOKEN JWT ALL'INTERO DELL'HEADER AITHORIZATION ED ESTRAZIONE DEL TOKEN JWT IN APPOSITO ATTRIBUTO DELLA REQUEST
export function verifyToken(req: any, res:any, next: any): void{
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1]; 
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(factory.getErrorResponse(ErrEnum.UndefinedToken , res));
    }
}

//FUNZIONE MIDDLEWARE PER DECODIFICARE IL TOKEN JWT E INSERIRLO IN APPOSITO ATTRIBUTO DELLA REQUEST
export function verifyJWT(req: any, res:any, next: any): void{
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    if(decoded !== null)
        req.user = decoded;
    next();
}

//FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL BODY DELLA REQUEST SIA UN TESTO IN FORMATO JSON
export function verifyJSON(req: any, res:any, next: any): void{
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
}