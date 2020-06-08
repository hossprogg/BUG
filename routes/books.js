const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const Book  = require('../models /bookmodel')
const uploadpath =  path.join('public', Book.CoverImageBasePath)
const Author = require('../models /authmod')
const imageMimeTypes  = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest : uploadpath,
    fileFilter : (req,file,callback) =>{//filters shich files our server can accept
      callback(null,imageMimeTypes.includes(file.mimetype))// this to fix the images types
    }
})

//AUTHOR ROUTES
//prepended => authors/
router.get('/', async (req, res) => {
  //build this query from our request.query params
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try{
    const  book =  await Book.find({})
  res.render('indexB',{
    book : book ,
    searchOptionss  : req.query 
  })
}catch{
  res.redirect('/')
}
})

//AUTHOR ROUTES
//prepended => authors/new

router.get('/newB', async(req, res) => {
    rendernewpage(res,new Book())
})

//creat author route
//AUTHOR ROUTES

router.post('/',upload.single('cover'), async (req, res) => {//multer gonna add single file as the name 'cover' then we will set it with our filename 
 const filename =  req.file != null ? req.file.filename : null//if we dont upload a file it s gonna be set to null and it will throw an error to demande the filename
  const book = new Book({
    title : req.body.title,
    author : req.body.author,
    publishDate : new Date(req.body.publishDate),//new date even it s a date cause it make it appropriate ot store into the data abse
    pageCount : req.body.pageCount,
    CoverImageName : filename,
    description : req.body.description 
  })  
  try{
    const newBook = await book.save() 
     res.redirect(`books`)
  }catch{
    if (book.CoverImageName){
      removeBookCover(book.CoverImageName)
    }//even it s an error it added that book cover  our folder which we dont want it 
  // and the conditional statement is because if it s null we dont have anything to deletete
  /* pay attention to such things in the web  */
    rendernewpage(res,book,true)
  }
})

function removeBookCover(filename){
  fs.unlink(path.join(uploadpath, filename),err=>{
    if (err) console.error(err)//in console cause we don t wanna send this msg type tp the user 
  })
}

async function rendernewpage(res,book,hasError = false){//const book = new Book() dont know why he have deleted it 
try {
const authors = await Author.find({})
const params = {
  authors : authors,
  book : book
}
  if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('newB',params)
} catch{
    res.redirect('/books')
  }//isn t set already app.use(/books) so we just need to put /book
}

module.exports = router