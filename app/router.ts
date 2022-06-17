require('dotenv').config({path : '../.env'})
import * as Contr from "./controller/Controller";
import * as Midd from "./middleware/midd_route"
const express = require('express')
const app = express()

app.use(express.json());

//Rotta per la creazione dell'evento
app.post('/create-order', Midd.create_order_midd, async (req: any, res: any) => {
  Contr.createOrder(req,res);
})

//Rotta per la creazione di una ricetta
app.post('/create-recipe', Midd.create_recipe, function (req: any, res: any) {
  Contr.createRecipe(req.body,res);
})

app.post('/update-storage', Midd.update_storage, function (req: any, res: any) {
  Contr.updateStorage(req,res);
  })

app.get('/check-availability', function (req, res) {
  res.send('Hello World')
})

app.get('/order-state', Midd.order_status, function (req: any, res: any) {
  Contr.orderState(req,res);
})



app.listen(3000)