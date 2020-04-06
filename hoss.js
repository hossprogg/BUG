
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
const authoRouter = require('./routes/authors')
const bodyparser = require('body-parser')
const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyparser.urlencoded({limit : '10mb' , extended : false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/authors', authoRouter) 


app.listen(process.env.PORT || 3000)