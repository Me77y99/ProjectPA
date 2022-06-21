import { Observable } from 'rxjs';
import {WebSocketServer} from 'ws';
import * as http from 'http';
import { ConnectionDb } from '../connection';
import { Order } from '../model/Order';
import { Recipe_foods } from '../model/Recipe_foods';
import { Sequelize } from 'sequelize';
require('dotenv').config({path : './../../.env'})

async function getRecipe(){
    let order : any = await Order.findOne({where:{id: 1}});
    let recipeFoods : Array<any> = await Recipe_foods.findAll({where: {recipe_id: order.recipe_id}});
    console.log(recipeFoods);
};

const wss = new WebSocketServer({port: process.env.WS_PORT});
let recived: any;

wss.on('connection', function connection(ws: any) {
    ws.on('message', async function message(data) {
    recived = JSON.parse(data);
    getRecipe();
  });
});

