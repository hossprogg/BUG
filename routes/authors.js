const express = require('express')
const router = express.Router()
const Author = require('../models /authmod')
const Book = require('../models /bookmodel')
//AUTHOR ROUTES
//prepended => authors/
router.get('/', async (req, res) => {
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name,'i')
  }
  try{
    const authors = await Author.find(searchOptions)//it has many option in it instead of this 
    res.render('index',{
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
router.get('/new', (req, res) => {//this should allways eb defined befor the one fo if 
    res.render('new',{ author : new Author()})// this doesn t creat anything actually but it create a model that we can use to delete update ....) and it can be sent to our ejs file 
  })

//creat author route
//AUTHOR ROUTES

router.post('/',async (req, res) => {
    const author = new Author({ 

      name : req.body.name// here is we r accessing the name property in the form :body.name
      //check his rq here of explecitly passing him the contact name 
    })
    // <% this jus gonna be run on the sever and not showed to the client %>
    try{
      // we have created it below next heree we gonna save it 
      const newAuthor = await author.save()// w8 for it to be completed cause everthing in mongodb is done asynchronously 
   res.redirect(`authors`)//
   //res.redirect(`authors/${new}`)//

   }catch{
    res.render('new',{
      author : author,//repopulation of the fields that we ve already intered 
      errorMessage : 'error creating author'//displays it when it s set(add condition locals.errormessages in the ejs file) else it gonna be indefined 
    })
   }
  
  })

  router.get('/:id',async(req,res)=>{
    try {
      const author  = await Author.findById(req.params.id)
      const book = await Book.find({author : author.id}).limit(6).exec()
      res.render('show',{
        author : author,
        booksByAuthor : book
      })
    }catch(err){
      console.log(err)
      res.redirect('/')
    }
  })

  router.get('/:id/edit',async (req,res)=>{
    try{
      const author = await Author.findById(req.params.id)

      res.render('edit', {author : author})
    }catch{
      res.redirect('/authors')
    }
  })

  router.put('/:id',async (req,res)=>{
    let author
    try{
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)//edit next take him to that page of the edited author
    }
    catch{
      if(author == null){//handling the first error 
        res.redirect('/')
      }else{
        res.render('authors/edit',{
          author : author,
          errorMessage : 'error editing the author'
        })
      }
    }
  })

  router.delete('/:id',async (req,res)=>{
    let author
    try{
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')//edit next take him to that page of the edited author
    }
    catch{
      if(author == null){//handling the first error 
        res.redirect('/')
      }else{
        res.redirect(`/authors/${author.id}`)
      }
    }
  })

module.exports = router