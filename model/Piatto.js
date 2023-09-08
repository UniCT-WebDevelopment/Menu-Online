const mongoose = require('mongoose');
mongoose instanceof mongoose.Mongoose;

const piattoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    price: {
        type: String,
        max: 8,
        required: true
    },
    description: {
        type: String,
        max: 200,
        required: false,
        default: ""
    },
    owner_id: {
        // questo campo conterrà l'id del proprietario, USER
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null,
    },
}, {timestamps: true});

const Piatto = mongoose.model('Piatto', piattoSchema, 'Piatto');
module.exports = Piatto;