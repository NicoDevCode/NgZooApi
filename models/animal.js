let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AnimalSchema = Schema({
    name: String,
    description: String,
    año: Number,
    image: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Animal', AnimalSchema)