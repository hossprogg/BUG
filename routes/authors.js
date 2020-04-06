const express = require('express')
const router = express.Router()
const Author = require('../models /authmod')

//AUTHOR ROUTES
router.get('/', (req, res) => {
  res.render('index2')
})


//AUTHOR ROUTES
router.get('/new', (req, res) => {
    res.render('new',{ author : new Author() })
  })

//creat author route
//AUTHOR ROUTES

router.post('/',async (req, res) => {
    const author = new Author({ 
      name : req.body.name
    })
    //3awed tfarrej fazzet mayhebech l user ydakhel huwa sinon yehlek l idvid2  
   try{
      const newAuthor = await author.save()
      res.render(`authors`)
   }
   catch{
    res.render('new',{
      author : author,
      errorMessage : 'error creating author'
    })
   }
    
  })


module.exports = router