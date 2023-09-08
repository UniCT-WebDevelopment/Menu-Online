const router = require('express').Router();
const { route } = require('.');
var path = require('path');
var multer = require('multer');
const fs = require('fs');           // gestione filesystem

const jwtool = require("../libraries/JWTools");
const Resizer = require("../libraries/Resizer");
const orariTool = require("../libraries/orariTool");


// importo i miei modelli
const Prenotatore = require('../model/Prenotatore');
const { NULL } = require('mysql/lib/protocol/constants/types');
const User = require('../model/User');
const { truncate } = require('fs');




router.get('/change_enable', jwtool.autorization, async (req, res) => {
    // funzione che cambia lo stato del prenotatore
    const prenotatore = await Prenotatore.findOne({user_id: req.user_id});
    if(prenotatore) {
        prenotatore.enable = !prenotatore.enable;
        await prenotatore.save();
        return res.redirect("/account/prenotazioni?error=false&function=change_enable&result=true");
    }else {
        return res.redirect("/account/prenotazioni?error=true&function=change_enable&result=false");
    }
});

router.get('/call', jwtool.autorization, async (req, res) => {
    // funzione che cambia lo stato della chiamata
    const prenotatore = await Prenotatore.findOne({user_id: req.user_id});
    if(prenotatore) {
        prenotatore.call = !prenotatore.call;
        await prenotatore.save();
        return res.redirect("/account/prenotazioni?error=false&function=call&result=true");
    }else {
        return res.redirect("/account/prenotazioni?error=true&function=call&result=false");
    }
});

router.post('/call', jwtool.autorization, async (req, res) => {
    const number = req.body.newNumber;
    if(!number) {
        return res.redirect("/account/prenotazioni?error=true&function=callPOST&result=false&message=missingField");
    }

    const prenotatore = await Prenotatore.findOne({user_id: req.user_id});
    prenotatore.call_number = number;
    await prenotatore.save();
    return res.redirect("/account/prenotazioni?error=false&function=callPOST&result=true");
});

router.get('/whatsapp', jwtool.autorization, async (req, res) => {
    // funzione che cambia lo stato della chiamata
    const prenotatore = await Prenotatore.findOne({user_id: req.user_id});
    if(prenotatore) {
        prenotatore.whatsapp = !prenotatore.whatsapp;
        await prenotatore.save();
        return res.redirect("/account/prenotazioni?error=false&function=whatsapp&result=true");
    }else {
        return res.redirect("/account/prenotazioni?error=true&function=whatsapp&result=false");
    }
});


router.post('/whatsapp', jwtool.autorization, async (req, res) => {
    const number = req.body.newNumber;
    if(!number) {
        return res.redirect("/account/prenotazioni?error=true&function=whatsappPOST&result=false&message=missingField");
    }

    const prenotatore = await Prenotatore.findOne({user_id: req.user_id});
    prenotatore.whatsapp_number = number;
    await prenotatore.save();
    return res.redirect("/account/prenotazioni?error=false&function=whatsappPOST&result=true");
});





module.exports = router;