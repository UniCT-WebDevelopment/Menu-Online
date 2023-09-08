const mongoose = require('mongoose');

const subMenuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    piatti: [{
        // lista dei piatti appartenenti al sottomenu
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Piatto'
    }],
    owner_id: {
        // questo campo conterrà l'id del proprietario, USER
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null,
    },
}, {timestamps: true});

const SubMenu = mongoose.model('SubMenu', subMenuSchema, 'SubMenu');
module.exports = SubMenu;