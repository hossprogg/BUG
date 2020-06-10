const express = require('express')
const router = express.Router()
const Book = require('../models /bookmodel')

//rendering the page of the localhost
router.get('/', async(req, res) => {
  let books
try{
  books = await Book.find({}).sort({createdAt : 'desc'}).limit(10).exec()
}catch{
  books=[]//if we get an error initialize it
}
 res.render('dashboard',{bookk : books})

})
module.exports = router