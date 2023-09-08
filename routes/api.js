/**
 *  Questa pagina conterrà principalmente le api di sistema
 * Queste api sono progettate per collegare i dati
 * 
 * L'accesso non verrà regolato da queste api, 
 * ma da una interfaccia dedicata al login e alla registrazione
 */

const router = require('express').Router();
const { route } = require('.');
var path = require('path');
var multer = require('multer');
const fs = require('fs');           // gestione filesystem

const jwtool = require("../libraries/JWTools");
const Resizer = require("../libraries/Resizer");
const myTools = require("../libraries/myTools");


// importo i miei modelli
const Menu = require('../model/Menu');
const SubMenu = require('../model/SubMenu');
const Piatto = require('../model/Piatto');
const Prenotatore = require('../model/Prenotatore');
const { NULL } = require('mysql/lib/protocol/constants/types');
const User = require('../model/User');
const { truncate } = require('fs');


router.get('/', (req, res) => {
    res.send("Api page");
});



// ritorna ALL Menu dato un menu id
// aggiungiamo il meccanismo di cache per adesso solo qui
router.get('/menu/getMenuFromId/:_id', async (req, res) => {

    try {
        const findMenu = await Menu.findOne({ _id: req.params._id });
        if (findMenu) {
            if(findMenu.modified_flag == true) {
                // con questa procedura risparmio molte chiamate
                // procedura di assemblaggio del menu!
                let returnMenu = {
                    name: findMenu.name,
                    categorie: [],
                }
                
                // con questo ciclo aggiungo le info di ogni submenu
                for (let i = 0; i < findMenu.submenu.length; i++) {
                    let tempSubM = await SubMenu.findOne({ _id: findMenu.submenu[i] });
                    if(tempSubM != undefined) {
                        let tempJ = {
                            name: tempSubM.name,
                            piatti: [],
                        };
                        // con questo ciclo aggiungo le info di ogni piatto
                        for (let j = 0; j < tempSubM.piatti.length; j++) {
                            let tempPiatto = await Piatto.findOne({ _id: tempSubM.piatti[j] });
    
                            if(tempPiatto) {
                                let tempPiattoJ = {
                                    name: tempPiatto.name,
                                    price: tempPiatto.price,
                                    description: tempPiatto.description
                                };
                                tempJ.piatti.push(tempPiattoJ);
                            }
                        }
                        returnMenu.categorie.push(tempJ);
                    } /*else {
                        // non è stato trovato nessun submenu con quell'id
                        // togliamo quell'id dalla lista degli id
                        const index_to_remove = findMenu.submenu.indexOf(findMenu.submenu[i]);
                        if (index_to_remove > -1) { 
                            // rimuovi l'elemento solo se lo hai trovato
                            findMenu.submenu.splice(index_to_remove, 1);
                            // il secondo parametro dice di rimuovere un solo elemento!
                        }
                    }*/
                }
                //console.log("Assemblo menu");
                //console.log(returnMenu);
                // qui salvo il menu e lo metto in cache
                findMenu.cached_menu = returnMenu;
                findMenu.modified_flag = false;
                findMenu.save();
                return res.status(200).json(returnMenu);
                // fine procedura assemblaggio menu
            } else {
                //console.log("Mando il menu della cache!");
                //console.log(findMenu.cached_menu);
                return res.status(200).json(findMenu.cached_menu);
            }
        } else {
            return res.status(404).json("{error: 'Menu not found'}");
        }
    } catch (e) {
        console.log("!ERROR ==> /api/getMenuFromId dice: " + e);
        return res.status(404).json({error: 'Menu not found'});
    }

});

// ritorna ALL Menu dato un menu id
router.get('/menu/getMenuFromId/advancedMode/:_id', jwtool.autorization, async (req, res) => {

    try {
        const findMenu = await Menu.findOne({ _id: req.params._id, owner_id: req.user_id, });
        const user = await User.findOne({_id: req.user_id});

        if (findMenu && user && user.menu_id == req.params._id) {
            let returnMenu = {
                _id: findMenu._id,
                name: findMenu.name,
                categorie: []
            }

            // con questo ciclo aggiungo le info di ogni submenu
            for (let i = 0; i < findMenu.submenu.length; i++) {

                let tempSubM = await SubMenu.findOne({ _id: findMenu.submenu[i] });
                if(tempSubM) {
                    // OWNER ID ADD
                    if(tempSubM.owner_id == null) {
                        tempSubM.owner_id = user._id;
                        await tempSubM.save();
                    }
                    // END OWNER

                    let tempJ = {
                        _id: tempSubM._id,
                        name: tempSubM.name,
                        piatti: [],
                    };
                    // con questo ciclo aggiungo le info di ogni piatto
                    for (let j = 0; j < tempSubM.piatti.length; j++) {
                        let tempPiatto = await Piatto.findOne({ _id: tempSubM.piatti[j] });
                        if(tempPiatto) {
                            if(tempPiatto.owner_id == null) {
                                tempPiatto.owner_id = user._id;
                                await tempPiatto.save();
                            }
                            // END OWNER
                            let tempPiattoJ = {
                                _id: tempPiatto._id,
                                name: tempPiatto.name,
                                price: tempPiatto.price,
                                description: tempPiatto.description
                            };
                            tempJ.piatti.push(tempPiattoJ);
                        }
                    }

                    returnMenu.categorie.push(tempJ);
                }
                
            }
            res.status(200).json(returnMenu);

        } else {
            res.status(404).json("{error: 'Menu not found'}");
        }
    } catch (e) {
        console.log("!ERROR ==> Api (getMenuFromId) say:" + e);
        res.status(404).json("{error: 'Menu not found'}");
    }

});


// GET PROFILE IMAGE
router.get('/menu/getProfileImage/:_id', async (req, res) => {

    try {
        const menu = await Menu.findOne({ _id: req.params._id });

        if (menu) {
            const path_img = path.resolve("public/images/logo/" + menu.profile_image);
            
            // verifichiamo che esiste il file nel filesystem
            if(!fs.existsSync(path_img)) {
                return res.status(404).json({error: "Image not exist in the server"}); 
            }
            return res.sendFile(path_img);
        } else {
            return res.status(404).json({ error: "Menu not found" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "There is an error" });
    }

});



// ROTTA PROTETTA
// per il caricamento dell'immagine del menu
const upload_middleware = multer({
    limits: {
        // limiti di memoria
        fileSize: 1 * 1024 * 512,
    }
});

// Upload Immagine di Profilo
router.post('/menu/uploadImage', [jwtool.autorization, upload_middleware.single('profile_image')], async (req, res) => {
    const imagePath = path.join(path.resolve('./'), '/public/images/logo');  // dove salviamo l'immagine
    const fileUpload = new Resizer(imagePath);
    if (!req.file) {
        // non ci hanno fornito una immagina
        return res.redirect("/account?imageUpload=notImage&error=true");
    }

    // se presente elimino l'immagine di prima e salvo il nome di quella nuova
    const myUser = await User.findOne({_id: req.user_id});
    if(!myUser.menu_id) {
        // controllo che l'utente ha un menu
        return res.redirect("/account?imageUpload=notHaveMenu&error=true");
    }

    // OK, ha un menu
    const filename = await fileUpload.save(req.file.buffer);    // salvo l'immagine e ottengo il nome
    
    let myMenu = await Menu.findOne({_id: myUser.menu_id});
    if(myMenu.profile_image) {
        try {
            fs.unlinkSync(path.join(path.resolve('./'), '/public/images/logo/') + myMenu.profile_image);
        } catch (err) {
            console.log(err);
            return res.redirect("/account?imageUpload=errorOnDelete&error=true");
        }
    }

    //let ci_siamo = false;
    myMenu.profile_image = filename;
    myMenu.save();
    return res.redirect("/account?uploadImage=OK&error=false");
        
});

// Upload Copertina
router.post('/menu/uploadCopertina', [jwtool.autorization, upload_middleware.single('copertina_image')], async (req, res) => {
    const imagePath = path.join(path.resolve('./'), '/public/images/copertine');  // path salviamo le copertina
    const fileUpload = new Resizer(imagePath);
    if (!req.file) {
        // non ci hanno fornito una immagina
        return res.redirect("/account?uploadCopertina=notImage&error=true");
    }

    // se presente elimino l'immagine di prima e salvo il nome di quella nuova
    const myUser = await User.findOne({_id: req.user_id});
    if(!myUser.menu_id) {
        // controllo che l'utente ha un menu
        return res.redirect("/account?uploadCopertina=notHaveMenu&error=true");
    }

    // OK, ha un menu
    const filename = await fileUpload.save(req.file.buffer);    // salvo l'immagine e ottengo il nome
    
    let myMenu = await Menu.findOne({_id: myUser.menu_id});
    if(myMenu.copertina_image) {
        try {
            fs.unlinkSync(path.join(path.resolve('./'), '/public/images/copertine/') + myMenu.copertina_image);
        } catch (err) {
            console.log(err);
            return res.redirect("/account?uploadCopertina=errorOnDelete&error=true");
        }
    }

    //let ci_siamo = false;
    myMenu.copertina_image = filename;
    myMenu.save();
    return res.redirect("/account?uploadCopertina=OK&error=false");
        
});




// per creare un menu l'utente deve essere registrato
router.post('/menu/createMenu', jwtool.autorization, async (req, res) => {
    // verifico che non abbia gia il menu
    const user = User.findOne({ _id: req.user_id });
    if (user.menu_id) {
        // ha gia il menu
        return res.redirect('/account?createMenu=gia_presente');
    }

    // 1) prendo i parametri passati per post
    const url = req.body.url;
    const name = req.body.name;
    if(!url || !name) {
        return res.redirect("/account?createMenu=invalidField");
    }

    // 2) creo il nuovo menu
    const new_menu = new Menu({
        name: name,
        url: url,   // unique
        // OWNER CONTROL
        owner_id: user._id,
    });

    new_menu.save((err, result) => {
        // verifico che l'user non è presente grazie all'unique dello schema
        if(err) {
            return res.redirect("/account?createMenu=urlBusy");
        } else {
            // 3) update dell'id del menu nell'user
            const updateUserMenuId = User.findOneAndUpdate(
                { _id: req.user_id },
                { menu_id: result._id },
                { upsert: true },
                function (err, doc) {
                    if (err) { return res.redirect("/account?createMenu=error2"); } 
                    else {return res.redirect("/account?createMenu=ok"); }
                }
            );
        }
    });
});


router.post('/menu/nameUpdate', jwtool.autorization, async (req, res) => {

    const newName = req.body.name;
    if(!newName) {
        return res.redirect("/account?error=true&nameUpdate=missingField");
    }

    const myMenu = await Menu.findOne({ 
        _id: req.body.menu_id,
        // OWNER CONTROL
        owner_id: req.user_id
    });

    if(!myMenu) {
        return res.redirect("/account?error=true&nameUpdate=error");
    } else {
        myMenu.name = newName;
        myMenu.save();
    }
    
    return res.redirect("/account?error=false&nameUpdate=OK");
});



// GESTIONE SUBMENU
router.post('/menu/createSubMenu', jwtool.autorization, async (req, res) => {
    const menuId = req.body.menu_id;
    const subMenuName = req.body.name;

    if(!subMenuName || !menuId) {
        return res.redirect("/account?error=true&createSubMenu=requiredValue");
    }


    // aggiungiamo la chiave del nuovo submenu nella lista presente nel menu di appartenenza
    const menuExists = await Menu.findOne({
        _id: menuId, 
        // OWNER CONTROL
        owner_id: req.user_id,
    });

    if(menuExists._id) {

        const newSubMenu = await new SubMenu({
            name: subMenuName,
            // OWNER CONTROL
            owner_id: req.user_id,
        });
        newSubMenu.save();

        // aggiungo il mio submenu al menu
        menuExists.submenu.push(newSubMenu._id);
        menuExists.modified_flag = true;
        menuExists.save();
        return res.redirect("/account?error=false&createSubMenu=OK");
    }else {
        res.redirect("/account?error=true&createSubMenu=error&e=menu_not_found");
    }
});

router.get('/menu/deleteSubMenu/:subMenu_id', jwtool.autorization, async (req, res) => {
    const subMenu_id = req.params.subMenu_id;
    const menu_id = req.query.menu_id;

    // DA FARE
    // eliminare tutti i piatti quando si elimina un SubMenu
    const mySubMenu = await SubMenu.findOne({_id: subMenu_id, owner_id: req.user_id});
    for(let i = 0; i < mySubMenu.piatti.length; i++) {
        const tempDlt = await Piatto.findOneAndDelete(
            {_id: mySubMenu.piatti[i]._id},
            {},
            (err, doc) => {
                if(err) {return console.log(err);}
            }
        ).clone();
    }
    
    try {
        // rimuovo il submenu
        await SubMenu.findOneAndDelete(
            {_id: subMenu_id, owner_id: req.user_id,}
        ).clone();
    } catch (e) {
        console.log(e);
        return res.redirect("/account?error=true&deleteSubMenu=error1");
    }

    try {
        const deleteFromMenu = await Menu.findOneAndUpdate(
            {_id: menu_id}, 
            { $pull: { 'submenu': subMenu_id } },
            {upsert: true},
            (err, doc) => {
                if(err) { console.log(err);}
            }
        ).clone();

        if(deleteFromMenu._id) {
            deleteFromMenu.modified_flag = true;
            deleteFromMenu.save();
            return res.redirect("/account?error=false&deleteSubMenu=OK");
        } else { 
            return res.redirect("/account?error=true&deleteSubMenu=error3"); 
        }
    } catch(e) {
        console.log(e);
        return res.redirect("/account?error=true&deleteSubMenu=error2");
    }

});

router.get('/menu/upSubMenu/:subMenu_id', jwtool.autorization, async (req, res) => {
    const subMenu_id = req.params.subMenu_id;
    const menu_id = req.query.menu_id;

    if(!menu_id && !subMenu_id) { return res.redirect("/account?error=true&upSubMenu=fieldRequired"); }

    const menu = await Menu.findOne({_id: menu_id, owner_id: req.user_id});
    if(menu) {
        const subMenuIndex = menu.submenu.indexOf(subMenu_id);

        if(!subMenuIndex || subMenuIndex == 0) {
            return res.redirect("/account?error=true&upSubMenu=indexNotValid")
        }

        myTools.array_move(menu.submenu, subMenuIndex, subMenuIndex-1 );
        menu.modified_flag = true;
        await menu.save();
        return res.redirect("/account?error=false&upSubMenu=OK");
    } else { 
        return res.redirect("/account?error=true&upSubMenu=menuNotFound"); 
    }

});
// END GESTIONE SUBMENU



// CREAZIONE E RIMOZIONE PIATTO
router.post('/menu/createPiatto', jwtool.autorization, async (req, res) => {
    const SubMenuId = req.body.submenu_id;
    const menuId = req.body.menu_id;
    const piattoName = req.body.name;
    const piattoPrice = req.body.prezzo;
    const piattoDescription = req.body.descrizione;

    if(!SubMenuId || !menuId || !piattoName || !piattoPrice || !piattoDescription) {
        return res.redirect("/account?error=true&createPiatto=missingField");
    }
    

    // dobbiamo aggiungere la chiave del nuovo submenu nella lista presente nel menu di appartenenza
    const subMenuExists = await SubMenu.findOne({_id: SubMenuId, owner_id: req.user_id });

    // modificare anche il flag MODIFIED
    const menu = await Menu.findOne({_id: menuId, owner_id: req.user_id });

    if(subMenuExists != null && menu != null) {

        // creo il piatto
        const newPiatto = new Piatto({
            name: piattoName,
            price: piattoPrice,
            description: piattoDescription,
            // OWNER CONTROL
            owner_id: req.user_id,
        });
        newPiatto.save();
        // fine creazione piatto

        // inserisco il piatto nel submenu di riferimento
        subMenuExists.piatti.push(newPiatto._id);
        subMenuExists.save();
        
        // modifico il flag MODIFIED del menu!
        menu.modified_flag = true;
        menu.save();
        return res.redirect("/account?error=false&createPiatto=OK");

    }else {
        //res.status(404).send("Non ho trovato nessun SUBMENU con questo id!");
        return res.redirect("/account?error=true&createPiatto=noSubMenuFound");
    }
});

router.get('/menu/deletePiatto/:piatto_id', jwtool.autorization, async (req, res) => {
    const submenu_id = req.query.submenu_id;
    const piatto_id = req.params.piatto_id;
    const menu_id = req.query.menu_id;

    if(!submenu_id || !menu_id) { return res.redirect("/account?error=true&deletePiatto=missingField"); }

    const toDLTPiatto = await Piatto.findOne( {_id: piatto_id, owner_id: req.user_id} );
    
    
    if(toDLTPiatto) {
        const subMenuFrom = await SubMenu.findOne( { _id: submenu_id, owner_id: req.user_id } );

        if(subMenuFrom) {
            const menu = await Menu.findOne({_id: menu_id, owner_id: req.user_id });
            if(menu) {
                // elimino la voce del piatto dalla lista dei piatti del submenu
                subMenuFrom.piatti.pull(toDLTPiatto._id);
                await subMenuFrom.save();

                // elimino il documento Piatto dal Database
                await toDLTPiatto.delete();

                // aggiorno il flag di cache del Menu
                menu.modified_flag = true;
                await menu.save();

                return res.redirect("/account?error=false&deletePiatto=OK");
            }else {
                return res.redirect("/account?error=true&deletePiatto=menuNotFound");
            }
             
        } else {
            return res.redirect("/account?error=true&deletePiatto=submenuNotFound"); 
        }

    } else {
        // il piatto che l'utente voleva eliminare non è stato trovato
        return res.redirect("/account?error=true&deletePiatto=piattoNotFound");
    }

});

router.get('/menu/upPiatto/:piatto_id', jwtool.autorization, async (req, res) => {
    const submenu_id = req.query.submenu_id;
    const piatto_id = req.params.piatto_id;
    const menu_id = req.query.menu_id;

    if(!submenu_id || !menu_id || !piatto_id) { return res.redirect("/account?error=true&upPiatto=missingField"); }

    const toMovePiatto = await Piatto.findOne( {_id: piatto_id, owner_id: req.user_id} );
    
    if(toMovePiatto) {
        const subMenuFrom = await SubMenu.findOne( { _id: submenu_id, owner_id: req.user_id } );

        if(subMenuFrom) {
            const menu = await Menu.findOne({_id: menu_id, owner_id: req.user_id });
            if(menu) {
                // elimino la voce del piatto dalla lista dei piatti del submenu
                const indexPiatto = subMenuFrom.piatti.indexOf(toMovePiatto._id);
                
                if(!indexPiatto || indexPiatto == 0) {
                    return res.redirect("/account?error=true&upPiatto=indexNotValid")
                }

                myTools.array_move(subMenuFrom.piatti, indexPiatto, indexPiatto-1 );
                // salvo la lista modificata
                await subMenuFrom.save();
                // aggiorno il flag di cache del Menu
                menu.modified_flag = true;
                await menu.save();

                return res.redirect("/account?error=false&upPiatto=OK");
            }else {
                return res.redirect("/account?error=true&upPiatto=menuNotFound");
            }
             
        } else {
            return res.redirect("/account?error=true&upPiatto=submenuNotFound"); 
        }

    } else {
        // il piatto che l'utente voleva eliminare non è stato trovato
        return res.redirect("/account?error=true&upPiatto=piattoNotFound");
    }

});

router.post('/menu/editPiatto/:piatto_id', jwtool.autorization, async (req, res) => {
    /**
     * Questa rotta prevede che si possano cambiare tutte le caratteristiche del piatto
     * con una sola rotta
     */
    const piatto_id = req.params.piatto_id;
    const action = req.body.action;     
    const new_value = req.body.new_value;
    const menu_id = req.body.menu_id;
    /* Possibili azioni: 
        - price, per cambiare prezzo
        - name, per cambiare nome
        - description, per cambiare descrizione
    */

    if(!new_value || !action || !menu_id) {
        return res.redirect("/account?editPiatto=missingField&error=true");
    }

    const piatto = await Piatto.findOne({_id: piatto_id, owner_id: req.user_id});
    if(piatto) {
        if(action == "price") {
            // cambiamo il prezzo del piatto
            piatto.price = new_value;
            piatto.save();
            // Aggiorniamo il flag della modifica
            const menu = await Menu.findOne({_id: menu_id, owner_id: req.user_id});
            menu.modified_flag = true;
            menu.save();
            return res.redirect("/account?editPiatto=OK&error=false");
        } else {
            return res.redirect("/account?editPiatto=actionNotSupported&error=true");
        }
    } else {
        return res.redirect("/account?editPiatto=piattoNotFound&error=true");
    }
});



/***************************************/
// Random Menu Function
router.post('/menu/random-menu/changeActive', jwtool.autorization, async (req, res) => {
    const menu_id = req.body.menu_id;
    if(!menu_id) { return res.redirect("/account?random_menu_change_active=missingField&error=true"); }

    const menu = await Menu.findOne({ _id: menu_id, owner_id: req.user_id });
    if(menu == undefined) { return res.redirect("/account?random_menu_change_active=menuNotFound&error=true"); }
    menu.random_menu = !menu.random_menu;
    menu.save();
    return res.redirect("/account?random_menu_change_active=OK&error=false");
});

router.post('/menu/random-menu/changeSubmenu', jwtool.autorization, async (req, res) => {
    const menu_id = req.body.menu_id;
    const submenu_id = req.body.submenu_id;
    if(!menu_id || !submenu_id) { return res.redirect("/account?random_menu_change_submenu=missingField&error=true"); }

    const menu = await Menu.findOne({ _id: menu_id, owner_id: req.user_id });
    if(menu == undefined) { return res.redirect("/account?random_menu_change_submenu=menuNotFound&error=true"); }
    menu.random_submenu = submenu_id;
    menu.save();
    return res.redirect("/account?random_menu_change_submenu=OK&error=false");
});

// funzione che ritorna piatto random
router.get('/menu/random-menu/getRandomPiatto/:menu_id', async (req, res) => {
    const menu_id = req.params.menu_id;
    if(!menu_id) { return res.status(404).json({error: "Required Field"}); }

    const menu = await Menu.findOne({_id: menu_id});
    if(menu == undefined) { return res.status(404).json({error: "Menu not found"}); }
    if(menu.random_menu == false || !menu.random_submenu) { return res.status(404).json({error: "Function Not Available"}); }

    const submenu = await SubMenu.findOne({_id: menu.random_submenu});
    if(submenu == undefined) {
        // se il submenu non funziona, ovvero non viene trovato perchè eliminato
        // allora posso rimuoverlo da li menu.random_submenu
        // e metto menu.random_menu = false cosi nessuno può usare la funzione
        menu.random_submenu = null;
        menu.random_menu = false;
        menu.save();
        return res.status(404).json({error: "SubMenu not found"}); 
        // ritorna a funzionare se l'utente la sistema dall'interfaccia
    }
    if(submenu.piatti.length <= 0) { return res.status(404).json({error: "No Piatti in SubMenu"}); }

    // Ma se il submenu esiste possiamo estrarre un piatto random
    const random_index = Math.floor(Math.random() * submenu.piatti.length);
    
    const piatto_random = await Piatto.findOne({_id: submenu.piatti[random_index]});
    if(piatto_random == undefined) {
        //come correggo il piatto se il piatto non esiste?
        // only splice array when item is found
        // 2nd parameter means remove one item only
        submenu.piatti.splice(random_index, 1);
        submenu.save();
        return res.status(404).json({error: "Piatto not found"}); 
    }
    
    const piatto_json = {
        name: piatto_random.name,
        price: piatto_random.price,
        description: piatto_random.description,
    };
    return res.status(200).json(piatto_json);

});

// Random Menu Function END
/***************************************/



router.get('/menu/submenu/getName/:_id', jwtool.autorization, async (req, res) => {
    const submenu_id = req.params._id;
    if(!submenu_id) { return res.status(404).json({error: "Missing Field"}); }
    const submenu = await SubMenu.findOne({_id: submenu_id, owner_id: req.user_id});
    if(submenu == undefined) { return res.status(404).json({error: "Missing Submenu"}); }
    return res.status(200).json({name: submenu.name});
});


// VERIFICA MAIL
router.get('/account/verifyMail/:_code', async (req, res) => {
    const verify_code = req.params._code;
    if(!verify_code) return res.redirect("/auth?verifyMail=fail");

    const user = await User.findOne({verify_code: verify_code});
    if(user == undefined) {
        return res.redirect("/auth?verifyMail=error");
    }
    user.verified = true;
    user.verify_code = "";
    user.save();
    return res.redirect("/auth?verifyMail=ok");
});



/**
 * import api Prenotatore
 */
const apiPrenotatoreRoute = require('../routes/apiPrenotatore');
router.use('/prenotatore', apiPrenotatoreRoute);



/**
 * FUNZIONI MAPPA
 */
router.get('/mappa/change_enable/:menu_id', jwtool.autorization, async (req, res) => {
    // funzione che cambia lo stato della mappa
    try {
        const myMenu = await Menu.findOne({_id: req.params.menu_id, owner_id: req.user_id});
        if(myMenu) {
            myMenu.mappa = !myMenu.mappa;
            await myMenu.save();
            return res.redirect("/account?error=false&function=mappa&result=true");
        }else {
            return res.redirect("/account?error=true&function=mappa&result=false");
        }
    } catch(e) {
        return res.redirect("/account?error=true&function=mappa&result=false");
    }
});

router.post('/mappa/address/:menu_id', jwtool.autorization, async (req, res) => {
    try {
        const myMenu = await Menu.findOne({_id: req.params.menu_id, owner_id: req.user_id});
        if(myMenu) {
            if(req.body.new_address) {
                myMenu.mappa_address = req.body.new_address;
                await myMenu.save();
                return res.redirect("/account?error=false&function=mappa_address&result=true");
            } else {
                return res.redirect("/account?error=true&function=mappa_address&missingField=true");
            }
            
        }else {
            return res.redirect("/account?error=true&function=mappa_address&result=false");
        }
    } catch(e) {
        return res.redirect("/account?error=true&function=mappa_address&result=false");
    }
});

router.post('/mappa/iframe_link/:menu_id', jwtool.autorization, async (req, res) => {
    try {
        const myMenu = await Menu.findOne({_id: req.params.menu_id, owner_id: req.user_id });
        if(myMenu) {
            if(req.body.mappa_iframe_link) {
                myMenu.mappa_iframe_link = req.body.mappa_iframe_link;
                await myMenu.save();
                return res.redirect("/account?error=false&function=mappa_iframe_link&result=true");
            } else {
                return res.redirect("/account?error=true&function=mappa_iframe_link&missingField=true");
            }
            
        }else {
            return res.redirect("/account?error=true&function=mappa_iframe_link&result=false");
        }
    } catch(e) {
        return res.redirect("/account?error=true&function=mappa_iframe_link&result=false");
    }
});

router.post('/mappa/button_link/:menu_id', jwtool.autorization, async (req, res) => {
    try {
        const myMenu = await Menu.findOne({_id: req.params.menu_id, owner_id: req.user_id });
        if(myMenu) {
            if(req.body.mappa_button_link) {
                myMenu.mappa_button_link = req.body.mappa_button_link;
                await myMenu.save();
                return res.redirect("/account?error=false&function=mappa_button_link&result=true");
            } else {
                return res.redirect("/account?error=true&function=mappa_button_link&missingField=true");
            }
            
        }else {
            return res.redirect("/account?error=true&function=mappa_button_link&result=false");
        }
    } catch(e) {
        return res.redirect("/account?error=true&function=mappa_button_link&result=false");
    }
});
/**
 * FINE FUNZIONI MAPPA
 */




// importiamo api Orario
const apiOrariRoute = require('../routes/apiOrari');
router.use('/orari', apiOrariRoute);



module.exports = router;