const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true 
    },
    description : {
        type : String,
    },
    publishDate : {
        type : Date,//famma type date yaani remember it 
        required : true 
    },
    pageCount : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date, 
        required : true,
        default : Date.now //this will insert the actual date by default 
    },
    CoverImage : {
        type : Buffer,
        required : true 
    },
    CoverImageType : {
        type: String,
        required: true 
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : true ,
        ref : 'Author'//this clname has to match the name set for the model
        }
    })

    bookSchema.virtual('coverImagePath').get(function() {
      if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
      }
    })

// Author is the name of the model(database table )with the authorschema as a schema
// the same cycle here need to export it and then require it to the routing page in which u need it 
module.exports = mongoose.model('Book',bookSchema)
