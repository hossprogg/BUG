const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    }

})

module.exports = mongoose.model('Author',authorSchema)
//  Author is the name of the model(database table )with the authorschema as a schema
// the same cycle here need to export it and then require it to the routing page in which u need it 