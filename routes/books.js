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
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch {
    renderNewPage(res, book, true)
  }
})

async function renderNewPage(res,book,hasError = false){//const book = new Book() dont know why he have deleted it 
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

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router