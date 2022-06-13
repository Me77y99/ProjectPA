import * as Midd from "./middleware/midd_route";
const express = require('express')
const app = express()


app.use(express.json());

//Rotta per la creazione dell'evento
app.post('/create-order', Midd.create_order_midd, function (req: any, res: any) {
  res.send( `L'ordine ${req.body.ordine} è stato correttamente creato` );
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