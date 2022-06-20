export interface  Error {
    error_code:number;
    getMsg():string;
}

export class GenericError implements Error {
    error_code: number;
    constructor(){this.error_code = 400;}
    getMsg():string {
        return "this is a generic error";
    }
}
export class Forbidden implements Error {
    error_code: number;
    constructor(){this.error_code = 400;}
    public getMsg():string {
        return "no rights...";
    }
}

export class BadRequest implements Error {
    error_code: number;
    constructor(){this.error_code = 400;}
    public getMsg():string {
        return "bad bad...fix and retry...";
    }
}

export class Unauthorized implements Error {
    error_code: number;
    constructor(){this.error_code = 400;}
    public getMsg():string {
        return "Richiesta non autorizzata";
    }
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
    constructor(){this.error_code = 401;}
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
    Generic,
    Forbidden,
    BadRequest,
    Unauthorized,
    HeaderAuthEmpty,
    BadHeaderContentType,
    UndefinedToken,
    BadTokenJWT
}

export class ErrorFactory {
    getErrorResponse(error_type: ErrEnum , res: any) {
        return res.status(this.getError(error_type).error_code)
        .send(this.getError(error_type).getMsg())
    }
    constructor(){}
    getError (type:ErrEnum):Error{
        let retval:Error = null;
        switch (type){
            case ErrEnum.Generic:
                retval = new GenericError();
                break;
            case ErrEnum.Forbidden:
                retval = new Forbidden();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break;
            case ErrEnum.Unauthorized :
                retval = new Unauthorized();
                break;
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



