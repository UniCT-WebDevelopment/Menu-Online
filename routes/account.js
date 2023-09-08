/*
    Questa pagina conterrà le route per la gestione account
    Accesso e registrazione saranno fatti da auth
    Il prefisso di queste rotte sarà /account
*/

const { route } = require('.');

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const jwtool = require("../libraries/JWTools");

dotenv.config();


const Menu = require('../model/Menu');
const SubMenu = require('../model/SubMenu');
const Piatto = require('../model/Piatto');
const User = require('../model/User');
const Prenotatore = require('../model/Prenotatore');
const Orari = require('../model/Orari');



router.get('/', jwtool.autorization, async (req, res) => {
    
    // TEORICAMENTE non ho bisogno di controllare che l'account esiste 
    // perché se ha il token allora è sicuro che esiste
    const user = await User.findOne({_id: req.user_id});


    // però comunque controllo il suo menu_id
    if(user.menu_id) {
        // qui l'utente ha il menu
        const menu = await Menu.findOne({_id: user.menu_id});

        //OWNER CONTROL
        if(menu.owner_id == null) {
            menu.owner_id = user._id;
            await menu.save();
        }
        // OWNER CONTROL END

        return res.render('area_clienti/account', { user: user, have_menu: true, menu: menu });
    }

    // qui l'utente non ha ancora creato il menu
    return res.render('area_clienti/account', { user: user, have_menu: false, menu: null });
});


/**
 * /account/prenotazioni
 * questa rotta ritorna la pagine di gestione delle prenotazioni
 */
router.get('/prenotazioni', jwtool.autorization, async (req, res) => {
    
    // TEORICAMENTE non ho bisogno di controllare che l'account esiste 
    // perché se ha il token allora è sicuro che esiste
    const user = await User.findOne({_id: req.user_id});

    // cerco il prenotatore
    let prenotatore = await Prenotatore.findOne({user_id: user._id});
    
    if(!prenotatore && user.menu_id) {
        //se non presente lo creo
        // ma soltanto se ha il menù
        const newPrenotatore = new Prenotatore({
            user_id: user._id,
            enable: false,
            menu_id: user.menu_id,
        });
        prenotatore = await newPrenotatore.save();
    }

    // però comunque controllo il suo menu_id
    if(user.menu_id) {
        const menu = await Menu.findOne({_id: user.menu_id});
        return res.render('area_clienti/prenotazioni', { user: user, have_menu: true, menu: menu, prenotatore: prenotatore, });
    }
    
    return res.redirect("/account");
});




/**
 * /account/orari
 * questa rotta ritorna la pagina per gestirre gli orari di apertura
 */
router.get('/orari', jwtool.autorization, async (req, res) => {
    
    // TEORICAMENTE non ho bisogno di controllare che l'account esiste 
    // perché se ha il token allora è sicuro che esiste
    const user = await User.findOne({_id: req.user_id}); // ma mi serve

    // cerco gli orari
    let orari = await Orari.findOne({user_id: user._id});
    
    if(!orari  && user.menu_id) {
        //se non presente lo creo
        // ma soltanto se ha già il menù
        const newOrari = new Orari({
            user_id: user._id,
            enable: false,
            menu_id: user.menu_id,
        });
        orari = await newOrari.save();
    }

    // però comunque controllo il suo menu_id
    if(user.menu_id) {
        const menu = await Menu.findOne({_id: user.menu_id});
        return res.render('area_clienti/orari', { user: user, have_menu: true, menu: menu, orari: orari });
    }
    
    return res.redirect("/account");
});




module.exports = router;