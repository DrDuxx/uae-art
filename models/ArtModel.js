const Schema = require("mongoose").Schema;
const Model = require("mongoose").model;

const artSchema = new Schema({
  art_name: {
    type: String,
    trim: true,
    required: true,
  },
  art_description: {
    type: String,
    trim: true,
    // required:true
  },
  art_year: {
    type: String,
    trim: true,
    required: true,
  },
  art_medium: {
    type: String,
    trim: true,
    required: true,
  },
  art_dimensions: {
    type: String,
    trim: true,
    required: true,
  },
  art_origin: {
    type: String,
    trim: true,
    // required: true,
  },
  art_image: {
    type: String,
    trim: true,
    required: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
});

module.exports = ArtModel = Model("Art", artSchema);
