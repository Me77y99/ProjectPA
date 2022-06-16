import { Order } from "../model/Order";



export class Controller {
    async createOrder(req: any){
        


        await Order.create(req.body);

    }
}