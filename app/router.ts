require('dotenv').config({path : '../.env'})
import * as Contr from "./controller/Controller";
import * as Midd from "./middleware/midd_route"
import { Order } from "./model/Order";
import { Recipe } from "./model/Recipe";
const express = require('express')
const app = express()



app.use(express.json());


//Rotta per la creazione dell'evento
app.post('/create-order', Midd.create_order_midd, async (req: any, res: any) => {
  res.json(req.user);
})

//Rotta per la creazione di una ricetta
app.post('/create-recipe', Midd.create_recipe, function (req:any, res:any) {
  Contr.createRecipe(req.body,res);
})

app.get('/update-storage', function (req, res) {
    res.send('Hello World')
  })

app.get('/check-availability', function (req, res) {
  res.send('Hello World')
})

app.get('/order-state', function (req, res) {
    res.send('Hello World')
  })



app.listen(3000)