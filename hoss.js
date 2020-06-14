
//how MVC works
//for each route file he hes a folder with the same name that contains all of view that gonna be handled with
// like authors.js refer to author folder that contains new and index2 ...

/* if(process.env.NODE_URL !== 'production')
  require('dotenv').load() 
 *///gonna load all the variable from .env file when it comes to production

 //.git ingnore things that we wanna not include in our git repo : .env (sensitive infos)
const express = require('express')//fazett <%-body %>
const expressLayouts = require('express-ejs-layouts')

//remember that chaining creating a constt 
//and assign a requirement to it and  next using it inside off the page 
//and don t remember to exxxport it so it works 
const indexRouter = require('./routes/index')
const authoRouter = require('./routes/authors')
const bookrouter  = require('./routes/books')
const bodyparser = require('body-parser')
const app = express()

//view : our server rendred views 
/* here telling express to use view engine */
app.set('view engine', 'ejs')//injecting dinamic content : sending variables to that route and using em and cycling through obj with js code 
//fazett el partial and including it 
app.set('views', __dirname + '/views')//from where our views are coming from
app.set('layout', 'layouts/layout')// what our layout files r going to be => 
//idea of layout is that it groups other files and no need to duplicate em 

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
app.use(expressLayouts)
app.use(express.static('public'))//where our pubic( stylesheet , images ..) file gonna be 
app.use(bodyparser.urlencoded({limit : '10mb' , extended : false}))

const mongoose = require('mongoose')
const db = require('./config/key').MongoURI;
//app.engine('ejs', require('ejs-locals'));????

//connect to mongo : first version 
mongoose.connect(db,{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(()=>console.log('al hamdu leleh'))
.catch(err => console.log(err));

/**  mongodb connection second version  ***/
//const mongoose = require('mongoose')
//mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser : true })
//const db = mongoose.conection
// db.on('error',error=>console.error(error)) => an event handler 
//db.once('open',()=>console.log('error')) once we connecte to the DB for the first time


// any route from those gonna be  prepended with that 'path' in the left
app.use('/', indexRouter)
app.use('/authors', authoRouter) 
app.use('/books' , bookrouter)

app.listen(process.env.PORT  || 3010)
// process.env.PORT is that the server gonna tell us for each port gonna listen 