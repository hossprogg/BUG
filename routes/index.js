const express = require('express')
const router = express.Router()

//rendering the page of the localhost
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router

