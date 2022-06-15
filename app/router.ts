require('dotenv').config({path : '../.env'})
import * as Midd from "./middleware/midd_route"
import { Order } from "./model/Order";
const express = require('express')
const app = express()



app.use(express.json());


//Rotta per la creazione dell'evento
app.post('/create-order', Midd.create_order_midd, async (req: any, res: any) => {
  await Order.create(req.body);
  res.json(req.body);
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

app.get('/create-recipe', function (req, res) {
    res.send('Hello World')
  })

app.listen(3000)