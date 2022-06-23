export interface  Message {
    status ? : number;
    recived ? : any;
    num_Ingredients ? : number;
    getMsg():Object;
}

export class connectionEstablished implements Message {
    status: number;
    constructor(){
        this.status = 1;
    }
    getMsg():Object {
        return {status: this.status, message: `Connessione Stabilita!`};
    }
}

export class getChargingInfoOK implements Message {
    status: number;
    recived: any;
    num_Ingredients: number;
    constructor(recived: any, num_Ingredients: number){
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    getMsg():Object {
        return {status: this.status, num_Ingredients: this.num_Ingredients, message: `Ordine ${this.recived.id_order} preso in carico!`};
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
        return {status: this.status, message: `Ordine ${this.recived.id_order} è già stato preso in carico precedentemente!`};
    }
}

export class checkSortingOK implements Message {
    status: number;
    recived: any;
    num_Ingredients: number;
    constructor(recived: any, num_Ingredients: number){
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    getMsg():Object {
        return {status: this.status, num_Ingredients: this.num_Ingredients, message: `Sei entrato nella zona dell'alimento con id: ${this.recived.id_alimento}!`};
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
        return {status: this.status, message: `Sei entrato nella zona di carico sbagliato ferma tutto, l'ordine è fallito!`};
    }
}

export class checkQuantityOK implements Message {
    status: number;
    recived: any;
    num_Ingredients: number;
    constructor(recived: any, num_Ingredients: number){
        this.status = 1;
        this.num_Ingredients = num_Ingredients;
        this.recived = recived;
    }
    public getMsg():Object {
        return {status: this.status, num_Ingredients: this.num_Ingredients, message: `Sei uscito dalla zona di carico dell'alimento: ${this.recived.id_alimento}! La bilancia restituisce un peso conforme!`};
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
        return {status: this.status, message: `Sei uscito dalla zona di carico dell'alimento: ${this.recived.id_alimento}! La bilancia restituisce un peso non conforme! L'ordine è fallito!`};
    }
}

export class communicateWeight implements Message {
    recived: any;
    constructor(recived: any){
        this.recived = recived;
    }
    public getMsg():Object {
        return {message: `Hai caricato ${this.recived.weight} kg!`};
    }
}

export class completeOrder implements Message {
    status: number;
    constructor(){
        this.status = 1;
    }
    public getMsg():Object {
        return {status: this.status, message: `Ordine Completato!`};
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
    completeOrder
}

export class MessageFactory {
    async getMessageResponse(Message_type: MsgEnum , ws: any, recived ? : any, num_Ingredients ? : number) {
        await ws.send(JSON.stringify(this.getMessage(Message_type, recived, num_Ingredients).getMsg()))
    }
    constructor(){}
    getMessage (type:MsgEnum, recived ? : any, num_Ingredients ? : number):Message{
        let retval:Message = null;
        switch (type){
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
            case MsgEnum.checkQuantityFAIL :
                retval = new checkQuantityFAIL(recived);
                break;
            case MsgEnum.communicateWeight:
                retval = new communicateWeight(recived);
                break;
            case MsgEnum.completeOrder:
                retval = new completeOrder();
                break;

        }
        return retval;
    }
}



