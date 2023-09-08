const router = require('express').Router();
const { route } = require('.');
var path = require('path');
var multer = require('multer');
const fs = require('fs');           // gestione filesystem

const jwtool = require("../libraries/JWTools");
const Resizer = require("../libraries/Resizer");
const orariTool = require("../libraries/orariTool");


// importo i miei modelli
const Menu = require('../model/Menu');
const Orari = require('../model/Orari');
const { NULL } = require('mysql/lib/protocol/constants/types');
const User = require('../model/User');
const { truncate } = require('fs');


router.post('/update', jwtool.autorization, async (req, res) => {
    const orariObjInput = req.body;

    // cerco l'orario dell'utente
    var myOrario = await Orari.findOne({user_id: req.user_id});
    if(!myOrario) {
        const userTemp = await User.findOne({_id: req.user_id});
        const newOrario = new Orari({
            user_id: userTemp._id,
            enable: false,
            menu_id: userTemp.menu_id,
        });
        myOrario = await newOrario.save();
    }

    if( orariTool.checkOrari(orariObjInput) == true ) {
        myOrario.orariObjString = JSON.stringify(orariObjInput);
        myOrario.save();
    } else {
        return res.status(404).json({error: true, message: "Invalid Data!"});
    }

    return res.status(200).json({error:false, message: "OK"});
});


router.get('/enable', jwtool.autorization, async (req, res) => {
    try {
        var myOrario = await Orari.findOne({user_id: req.user_id});
        if(!myOrario) { return res.status(404).json({error: true, message: "Resouce not found!"}); }
        myOrario.enable = !myOrario.enable;
        myOrario.save();
        return res.status(200).json({error: false, message: "OK!", enable: myOrario.enable, object: myOrario});
    } catch(e) {
        return res.status(404).json( {error: true, message: "Error n.1!"} );
    }
});


router.get('/info/:idOrari', async (req, res) => {
    const idOrari = req.params.idOrari;

    if(!idOrari) { return res.status(404).json({error: true, message: "Field required!"}); }

    try {
        var myOrario = await Orari.findOne({_id: idOrari});
        if(!myOrario) { return res.status(404).json({error: true, message: "Resouce not found!"}); }
        // info pubbliche
        var orari = {
            enable: myOrario.enable,
            orariObjString: myOrario.orariObjString,
        }
        return res.status(200).json({error: false, message: "OK!", object: orari });
    } catch(e) {
        return res.status(404).json( {error: true, message: "Error n.1!"} );
    }

});


module.exports = router;