/*
Factory per la comunicazione di eventuali errori commessi nel processo di esecuzione di un ordine e conseguente cambio di status. 
Preliminarmente è stata definita l'interfaccia Message da cui tutti i tipi di comunicazioni ereditano.
Ogni classe effettuerà l'override di attribuiti e metodi.
*/
export interface  Message {
    status ? : number;
    recived ? : any;
    ingredients ? : any;
    getMsg():Object;
}

export class connectionEstablished implements Message {
    status: number;
    constructor(){
        this.status = 1;
    }
    getMsg():Object {
        return {status: this.status, message: `Connessione Stabilita!\n`};
    }
}

export class getChargingInfoOK implements Message {
    status: number;
    recived: any;
    ingredients: any;
    constructor(recived: any, ingredients: any){
        this.status = 1;
        this.ingredients = ingredients;
        this.recived = recived;
    }
    getMsg():Object {
        return {status: this.status, ingredients: this.ingredients, message: `Ordine ${this.recived.id_order} preso in carico!\n`};
    }
}

export class getChargingInfoFAIL implements Message {
    status: number;
    recived: any;
    constructor(recived: any){
        this.status = 0;
        this.recived = recived;
    }
    getMsg():Object {
        return {status: this.status, message: `Ordine ${this.recived.id_order} è già stato preso in carico precedentemente!\n`};
    }
}

export class checkSortingOK implements Message {
    status: number;
    recived: any;
    ingredients: any;
    constructor(recived: any, ingredients: any){
        this.status = 1;
        this.ingredients = ingredients;
        this.recived = recived;
    }
    getMsg():Object {
        return {status: this.status, ingredients: this.ingredients, message: `Sei entrato nella zona dell'alimento con id: ${this.recived.id_alimento}!\n`};
    }
}

export class checkSortingFAIL implements Message {
    status: number;
    recived: any;
    constructor(recived: any){
        this.status = 0;
        this.recived = recived;
    }
    public getMsg():Object {
        return {status: this.status, message: `Sei entrato nella zona di carico sbagliata!\n`};
    }
}

export class checkQuantityOK implements Message {
    status: number;
    recived: any;
    ingredients: any;
    constructor(recived: any, ingredients: any){
        this.status = 1;
        this.ingredients = ingredients;
        this.recived = recived;
    }
    public getMsg():Object {
        return {status: this.status, ingredients: this.ingredients, message: `Sei uscito dalla zona di carico dell'alimento: ${this.recived.id_alimento}! La bilancia restituisce un peso conforme!\n`};
    }
}

export class checkQuantityFAIL implements Message {
    status: number;
    recived: any;
    constructor(recived: any){
        this.status = 0;
        this.recived = recived;
    }
    public getMsg():Object {
        return {status: this.status, message: `Sei uscito dalla zona di carico dell'alimento: ${this.recived.id_alimento}! La bilancia restituisce un peso non conforme!\n`};
    }
}

export class communicateWeight implements Message {
    recived: any;
    constructor(recived: any){
        this.recived = recived;
    }
    public getMsg():Object {
        return {message: `Hai caricato ${this.recived.weight} kg! Timestamp: ${Date.now()}`};
    }
}

export class completeOrderOK implements Message {
    recived: any;
    constructor(recived: any){
        this.recived = recived;
    }
    public getMsg():Object {
        return {message: `ORDINE ${this.recived.id_order} COMPLETATO\n`};
    }
}

export class completeOrderFAIL implements Message {
    recived: any;
    constructor(recived: any){
        this.recived = recived;
    }
    public getMsg():Object {
        return {message: `ORDINE ${this.recived.id_order} FALLITO\n`};
    }
}

export enum MsgEnum {
    connectionEstablished,
    getChargingInfoOK,
    getChargingInfoFAIL,
    checkSortingOK,
    checkSortingFAIL,
    checkQuantityOK,
    checkQuantityFAIL,
    communicateWeight,
    completeOrderOK,
    completeOrderFAIL
}

/* 
Definizione della classe che ci permetterà di istanziare la factory esternamente.
Il metodo getMessage() in base al tipo di messaggio ritorna l'istanza della classe specifica.
Il metodo getMessageResponse() ritorna la risposta che verrà lanciata al client che ha inviato il messaggio al server al cui interno
verranno inoltrati lo status del'ordine per conesntire o negare l'esecuzione dell'azione successiva da parte del client ed altri eventuali
dati aggiuntivi a seconda della comunicazione inoltrata inizialmente dal client.
*/
export class MessageFactory {
    async getMessageResponse(Message_type: MsgEnum , ws: any, recived ? : any, ingredients ? : any) {
        await ws.send(JSON.stringify(this.getMessage(Message_type, recived, ingredients).getMsg()))
    }
    constructor(){}
    getMessage (type:MsgEnum, recived ? : any, ingredients ? : any):Message{
        let retval:Message = null;
        switch (type){
            case MsgEnum.connectionEstablished:
                retval = new connectionEstablished();
                break;
            case MsgEnum.getChargingInfoOK:
                retval = new getChargingInfoOK(recived, ingredients);
                break;
            case MsgEnum.getChargingInfoFAIL:
                retval = new getChargingInfoFAIL(recived);
                break;
            case MsgEnum.checkSortingOK:
                retval = new checkSortingOK(recived, ingredients);
                break;
            case MsgEnum.checkSortingFAIL:
                retval = new checkSortingFAIL(recived);
                break;
            case MsgEnum.checkQuantityOK:
                retval = new checkQuantityOK(recived, ingredients);
                break;
            case MsgEnum.checkQuantityFAIL :
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
    }
}



