const mongoose = require('mongoose');

const prenotatoreSchema = mongoose.Schema({
    enable: {
        // indica se il prenotatore è attivo oppure no
        type: Boolean,
        required: true,
        default: false
    },
    call: {
        // indica se il pulsante chiamata è attivo oppure no
        type: Boolean,
        required: true,
        default: false
    },
    call_number: {
        type: String,
        required: false,
        min: 5,
        max: 100
    },
    whatsapp:{
        // indica se il tasto whatsapp è attivo oppure no
        type: Boolean,
        required: true,
        default: false
    },
    whatsapp_number: {
        type: String,
        required: false,
        min: 5,
        max: 100
    },
    user_id: {
        // collegamento con l'user_id dell'utente a cui appartiene
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null,
    },
    menu_id: {
        // collegamento con l'user_id dell'utente a cui appartiene
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
    },
}, {timestamps: true});

const Prenotatore = mongoose.model('Prenotatore', prenotatoreSchema, 'Prenotatore');
module.exports = Prenotatore;