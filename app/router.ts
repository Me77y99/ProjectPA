require('dotenv').config({path : '../.env'})
import * as Contr from "./controller/Controller";
import * as Midd from "./middleware/midd_route"
const express = require('express')
const app = express()

app.use(express.json());

//ROTTA PER VISUALIZZARE LA GIACENZA DEGLI ALIMENTI, SPECIFICATI DALL'UTENTE, IN MAGAZZINO
app.get('/check-availability', Midd.check_availability,  function (req: any, res: any) {
  Contr.checkAvailability(req,res);
})

//ROTTA PER VISUALIZZARE LA GIACENZA DI TUTTI GLI ALIMENTI IN MAGAZZINO
app.get('/check-availability-all', Midd.check_availability_all, function (req: any, res: any) {
  Contr.checkAvailabilityAll(req,res);
})

//ROTTA PER VISUALIZZARE LO STATUS DI UN ORDINE
app.get('/order-state', Midd.order_status, function (req: any, res: any) {
  Contr.orderState(req,res);
})

//ROTTA PER LA CREAZIONE DI UN ORDINE
app.post('/create-order', Midd.create_order, async (req: any, res: any) => {
  Contr.createOrder(req,res);
})

//ROTTA PER LA CREAZIONE DI UNA RICETTA
app.post('/create-recipe', Midd.create_recipe, function (req: any, res: any) {
  Contr.createRecipe(req,res);
})

//ROTTA PER LA MODIFICA DELLA QUANTITÀ DI UN ALIMENTO IN MAGAZZINO
app.post('/update-storage', Midd.update_storage, function (req: any, res: any) {
  Contr.updateStorage(req,res);
  })

app.listen(3000)