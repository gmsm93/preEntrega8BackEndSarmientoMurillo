import express from "express"
import prdRouter from './router/prd.router.js'
import handlebars from 'express-handlebars'
import mongoose from "mongoose"
import __dirname from "./utils.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import bodyParser from "body-parser"
import viewsRouter from './router/views.router.js'
import sessionRouter from './router/session.router.js'

// Inicializamos variables
const app=express()
const mongoURL = "mongodb+srv://r2:L53I9bfZi00L9BkV@clusterr2.028npj6.mongodb.net/?retryWrites=true&w=majority"
const mongoDBName = 'ClusterR2'

// configurar el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views' )
app.set('view engine','handlebars')

// traer info post como JSON
app.use(express.json)
app.use(express.urlencoded({extended:true}))

// carpeta publica
app.use(express.static(__dirname + '/public'))

// configuracion de rutas
app.get('/health', (req, res) => res.send('ok'))
app.use('/product', prdRouter)

// Configuracion de la sesion
app.use(session({
  store: MongoStore.create({
      mongoUrl,
      dbName: mongoDB,
      ttl: 100
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use('/', viewsRouter)
app.use('/api/session', sessionRouter)
app.get('/health', (req, res) => res.send('OK'))

// Conectar Mongo DB
mongoose.connect(mongoURL, { dbName: mongoDBName })
  .then(() => {
    console.log('Conexión a la base de datos exitosa')
    app.listen(8080, () => console.log(`Listening ...`))
  })
  .catch((err) => {
    console.error('Error de conexión a la base de datos:', err);
  });
