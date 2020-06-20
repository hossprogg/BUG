const mongoose = require('mongoose')
const Book = require('./bookmodel')

const authorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    }
})


authorSchema.pre('remove',function(next){//when u use this. u can t use arrow function
    Book.find({author : this.id},(err,books)=>{
        if(err){
            next(err)
        }
        else if ( books.length > 0 ){
            next(new Error('this author has books still'))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model('Author',authorSchema)
// Author is the name of the model(database table )with the authorschema as a schema
// the same cycle here need to export it and then require it to the routing page in which u need it 