/**
 *  Questa pagina conterrà principalmente il menu
 * 
 *  /menu/:url (dove url è l'url dell'attività che ha scelto)
 */

const router = require('express').Router();
const { route } = require('.');


// importo i miei modelli
const Menu = require('../model/Menu');
const SubMenu = require('../model/SubMenu');
const Piatto = require('../model/Piatto');
const Prenotatore = require('../model/Prenotatore');
const Orari = require('../model/Orari');


const { find } = require('../model/Menu');
const { NULL } = require('mysql/lib/protocol/constants/types');


router.get('/', (req, res) => {
    res.send("Menu");
});


router.get('/:url', async (req, res) => {
    // menu personalizzato di ogni attività
    const findMenu = await Menu.findOne({url: req.params.url});
    const prenotatore = await Prenotatore.findOne({menu_id: findMenu._id});
    const orari = await Orari.findOne({menu_id: findMenu._id});

    if(findMenu){
        if(prenotatore && orari) {
            res.render('pages/menu', {
                menu: findMenu,
                prenotatore_present: true, prenotatore: prenotatore,
                orari_present: true, orari: orari,
                title: findMenu.name
            });
        } else {
            res.render('pages/menu', {
                menu: findMenu, 
                prenotatore_present: false, prenotatore: prenotatore,
                orari_present: false, orari: orari,
                title: findMenu.name
            });
        }
        
    }else {
        res.status(404).redirect("/home");
    }

});


module.exports = router;