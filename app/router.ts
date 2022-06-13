const express = require('express')
const midd = require('./middleware/middleware.ts')
const app = express()


app.use(express.json());


app.use(midd.myLogger);
/*app.use(midd.requestTime);
app.use(midd.checkToken);
app.use(midd.verifyAndAuthenticate);
app.use(midd.logErrors);
app.use(midd.errorHandler);*/

//Rotta per la creazione dell'evento
app.post('/create-event', function (req: any, res: any) {
  console.log(req);
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