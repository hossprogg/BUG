const express = require('express')
const router = express.Router()
/* const path = require('path')
const multer = require('multer') */
//const fs = require('fs')
const Book  = require('../models /bookmodel')
//const uploadpath =  path.join('public', Book.CoverImageBasePath)//why here /pblic and there /
const Author = require('../models /authmod')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

//AUTHOR ROUTES
//prepended => authors/
router.get('/', async (req, res) => {
  //build this query from our request.query params
  let query = Book.find()//query object that we can query from and execute later // let => cause we gonna reassign it
  if (req.query.title && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const  book =  await query.exec()
  res.render('indexB',{
    book : book ,
    searchOptionss  : req.query 
  })
} catch{
  res.redirect('/')
}
})

//AUTHOR ROUTES
//prepended => authors/new

router.get('/newB', async(req, res) => {
    renderNewPage(res,new Book())
})
//
//

//creat author route
//AUTHOR ROUTES

/* router.post('/', async (req, res) => {//multer gonna add single file as the name 'cover' then we will set it with our filename 
  const book = new Book({
    title : req.body.title,

    author : req.body.author,
    publishDate : new Date(req.body.publishDate),//new date even it s a date cause it make it appropriate ot store into the data abse
    pageCount : req.body.pageCount,
    description : req.body.description
  })
  saveCover(book,req.body.cover)//cause our filename input is 'cover'

  try{
    const newBook = await book.save() 
    res.redirect(`books`)
  }catch{
    rendernewpage(res,book,true)
  }
}) */

router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)
  try {
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
  }catch{
    renderNewPage(res, book, true)
  }
})

/* router.get('/:id',async(req,res)=>{
  try{
    const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('showB',{book : book})
  }catch{
    res.redirect('/')
  }
})
 */

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('showB', { book: book })
  }catch {
    res.redirect('/')
  }
})

//Edit author

router.put('/:id', async (req, res) => {
  let book 
  try {
    const book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover && req.body.cover != ''){
      saveCover(book,req.body.cover)
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  }
  catch(err){
    if (book){
      Console.log(err)
      rendereditPage(res, book, true)
    }else{
      res.redirect('/')
    }
  }
})

router.delete('/:id',async (req,res)=>{
  let book 
  try{
    book = await Book.findById(req.params.id)
    await book.remove()//removing next redirecting to the home pages to see changes
    res.redirect('/books')
  }catch{
    if(book){
      res.render('showB',{
        book : book,
        errorMessage : 'couldn t remove this book'
      })
    }else{
      res.redirect('/')//to the home page
    }
  } 
})

async function renderNewPage(res,book,hasError = false){
  renderformPage(res ,book ,'newB' ,hasError)
}

async function rendereditPage(res,book,hasError = false){
  renderformPage(res ,book ,'editB', hasError)
}

async function renderformPage(res,book,form,hasError = false){ //const book = new Book() dont know why he have deleted it 
  try {
  const authors = await Author.find({})
  const params = {
    authors : authors,
    book : book
  }
     if (hasError) 
      if(form == 'edit'){
        params.errorMessage = 'Error Creating Book'
        res.render('newB',params) 
      }
      else {
        params.errorMessage = 'Error Updating Book'
        res.render('editB',params) 
      }
  
  res.render(`${form}`,params)
  } catch{
    res.redirect('/books')
    }
  //in redirectt we have to put a full url so we preceed it with that '/'
  }

router.get('/:id/edit',async(req,res)=>{
  try{
    const book = await Book.findById(req.params.id)
    rendereditPage(res,book)
  }catch(err){
    console.log(err)
    res.redirect('/')
  }
})

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)//remember that long json object returned 
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.CoverImage = new Buffer.from(cover.data, 'base64')
    book.CoverImageType = cover.type
  }
}
module.exports = router