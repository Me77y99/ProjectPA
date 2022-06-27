/*
Factory per le risposte di errore nelle API. 
Preliminarmente è stata definita l'interfaccia Error da cui tutti i tipi di risposte ereditano.
Ogni classe effettuerà l'override dei suoi attribuiti e metodi.
*/
export interface  Error {
    error_code:number;
    getMsg():string;
}

export class HeaderAuthEmpty implements Error {
    error_code: number;
    constructor(){this.error_code = 401;}
    public getMsg():string {
        return "Il campo autorizzazione è vuoto";
    }
}

export class BadHeaderContentType implements Error {
    error_code: number;
    constructor(){this.error_code = 415;}
    public getMsg():string {
        return "Il content-type della richiesta non è corretto";
    }
}

export class UndefinedToken implements Error {
    error_code: number;
    constructor(){this.error_code = 403;}
    public getMsg():string {
        return "Token non definito";
    }
}

export class BadTokenJWT implements Error {
    error_code: number;
    constructor(){this.error_code = 401;}
    public getMsg():string {
        return "Token JWT non corretto";
    }
}

export enum ErrEnum {
    None,
    HeaderAuthEmpty,
    BadHeaderContentType,
    UndefinedToken,
    BadTokenJWT
}

/* 
Definizione della classe che ci permetterà di istanziare la factory esternamente.
Il metodo getError() in base al tipo di errore ritorna l'istanza della classe specifica.
Il metodo getErrorResponse() ritorna la risposta che verrà lanciata al client delle API dove
in status verrà inoltrato l'attributo error_code specifico; mentre nella send andrà il messaggio
estrapolato tramite il getMsg()
*/

export class ErrorFactory {
    getErrorResponse(error_type: ErrEnum , res: any) {
        return res.status(this.getError(error_type).error_code)
        .send(this.getError(error_type).getMsg())
    }
    constructor(){}
    getError (type:ErrEnum):Error{
        let retval:Error = null;
        switch (type){
            case ErrEnum.HeaderAuthEmpty :
                retval = new HeaderAuthEmpty();
                break;    
            case ErrEnum.BadHeaderContentType :
                retval = new BadHeaderContentType();
                break;  
            case ErrEnum.UndefinedToken :
                retval = new UndefinedToken();
                break;
            case ErrEnum.BadTokenJWT :
                retval = new BadTokenJWT();
                break;             
        }
        return retval;
    }
}



