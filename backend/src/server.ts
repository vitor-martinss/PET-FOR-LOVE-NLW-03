import express from 'express'
import path from 'path'
import 'express-async-errors'
import cors from 'cors'


import './database/connection'
import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

//Rota = conjunto
//Recurso = usuario
// Metodos HTTP = get, post, put, delete
//Parâmetros

// GET = buscar uma informação (lista, item)
// POST = criando uma informação
// PUT = editando uma informação
// DELETE = deletando uma informação

// Query Params: http:///localhost:9000/users?search=diego
// Route Params: http:///localhost:9000/users/1 (identificar um recurso)
// Body: http:///localhost:9000/users (identificar um recurso)

// Driver nativo, Query builder(knex - write queries in js), ORM (Object Relational Mapping)

app.listen(9000)