const express = require('express')
const router = express.Router()
const Author = require('../models /authmod')

//AUTHOR ROUTES
//prepended => authors/
router.get('/', async (req, res) => {
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name,'i')
  }
  try{
    const authors = await Author.find(searchOptions)//it has many option in it instead of this 
    res.render('/index',{
      authors : authors , 
      searchOptions : req.query
    })
  }
    catch{
      res.redirect('/')
    }
})

//AUTHOR ROUTES
//prepended => authors/new
router.get('/new', (req, res) => {
    res.render('new',{ author : new Author() })// this doesn t creat anything actually but it create a model that we can use to save ,delete update ....) later and is gonna be sent to our ejs file 
  })

//creat author route
//AUTHOR ROUTES

router.post('/',async (req, res) => {
    const author = new Author({ 
      name : req.body.name // cause already we have put an object under which gonna be the data
    })
// obliging him to enter exactly that field istead of entering something else that could alter anyting in the database 
    try{
      // we have created it below next heree we gonna save it 
      const newAuthor = await author.save()// w8 for it to be completed cause everthing in mongodb is done asynchronously 
   res.redirect(`authors`)//here we have used '/' and not `/`
   }catch{
    res.render('new',{
      author : author,
      errorMessage : 'error creating author'//displays it when it s defined else it gonna be indefined 
    })
   }
    
  })


module.exports = router