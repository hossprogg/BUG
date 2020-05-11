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
    fileFilter : (req,file,callback) =>{
      callback(null,imageMimeTypes.includes(file.mimetype))// this to fix the images types
    }
})

//AUTHOR ROUTES
//prepended => authors/
router.get('/', async (req, res) => {
  try{
    const  books =  await Book.find({})
  res,render('indexB',{
    book : book ,
    searchOptions  : req.query 
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

router.post('/',(upload.single('cover')),async (req, res) => {//multer gonna add file as the name cover i suggest check it please 
 const filename =  req.file  != null ? req.file.filename : null
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
    if (book.CoverImageName != null){
      removeBookCover(book.CoverImageName)
    }
    rendernewpage(res,book,true)
  }
})

function removeBookCover(filename){
  fs.unlink(path.join(upload , filename),err=>{
    if (err) console.error(err)
  })
}

async function rendernewpage(res,book,hasError){
const authors = await Author.find({})
//const book = new Book() dont know why he have deleted it 
try {
const params = {
  authors : authors,
  book : book 
}
if (hasError)
  params.errorMessage = 'Error Creating Book'

  res.render('newB',params)
}catch{
res.redirect('/books')
}
}

module.exports = router