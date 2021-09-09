const Schema = require('mongoose').Schema
const Model = require('mongoose').model

const artistSchema = new Schema({
    artist_name:{
        type:String,
        trim:true,
        required:true
    },
    artist_description:{
        type:String,
        trim:true,
        required:true
    },
    artist_name_ar:{
        type:String,
        trim:true,
    },
    artist_description_ar:{
        type:String,
        trim:true,
    },
    artist_image:{
        type:String,
        trim:true,
        required:true
    },
    artist_arts:[{
        type:Schema.Types.ObjectId,
        ref:'Art'
    }]
})


module.exports = ArtistModel = Model('Artist',artistSchema)