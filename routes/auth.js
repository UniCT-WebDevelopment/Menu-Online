//Questa route permette all'utente di registrarsi e di loggarsi


// Libraries
const router = require('express').Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');


// my libraries 
const jwtool = require("../libraries/JWTools");
const vcg = require("../libraries/verifyCodeGenerator");
const recaptcha = require("../libraries/Recaptcha");


// Models
const User = require('../model/User');
const Menu = require('../model/Menu');


dotenv.config();


// login route functions
router.get('/', (req, res) => {
    return res.render('pages/auth', 
        {
            title: "Area Clienti", 
            recaptcha_public_key: process.env.RECAPTCHA_PUBLIC_KEY,
        }
    );
});

router.post('/login', recaptcha.VerifyRecaptcha, async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) { return res.redirect("/auth?error=true&login=invalidField"); }


    // cerco la corrispondenza email e password
    const user = await User.findOne({email: email}, (err, user) => {
        if (err) { return res.redirect("/auth?error=true&login=userNotFound"); }

        try {
            user.comparePassword(password, function(err, isMatch) {
                if (err || isMatch === false) {
                    // se c'è un errore o la password è sbagliata
                    return res.redirect("/auth?error=true&login=passwordError");
                } else {
                    if(user.verified) {
                        // la password erano uguali
                        const user_token = jwtool.generateAccessToken({ user_id: user._id });

                        return res.cookie("access_token", user_token, {
                                httpOnly: true,
                            })
                            .redirect("/account?login=ok"); // ci siamo
                    }
                    else { return res.redirect("/auth?error=true&login=usernotverified"); }
                    
                }
                // isMatch è un boolean
            });
        } catch(e) {
            return res.redirect("/auth?error=true&login=userNotFound");
        }
        
    }).clone();

});



// LOGOUT
router.get('/logout', jwtool.autorization, (req, res) => {
    return res
        .clearCookie("access_token")
        .redirect("/auth?logout=ok");
});



// REGISTRAZIONE
router.get('/registrazione', (req, res) => {
    return res.render('pages/registrazione', 
        {
            title: "Registrazione",
            recaptcha_public_key: process.env.RECAPTCHA_PUBLIC_KEY,
        }
    );
});


router.post('/registrazione', recaptcha.VerifyRecaptcha, async (req, res) => {
    const email = req.body.email;
    const pswd = req.body.password;
    const pswd2 = req.body.confirm_password;

    if(!email || !pswd || !pswd2) {
        return res.redirect("/auth?error=true&registration=invalidField");
    }

    try {
        const registred = await User.findOne({ email: email });

        if (registred) {
            // utente già registrato
            return res.redirect("/auth?registrazione=mail_presente");
        } else {
            if (pswd == pswd2) {
                let tempCode = vcg.verifyCodeGenerator();
                // Creo un nuovo user
                const newUser = new User({
                    email: email,
                    password: pswd,
                    verify_code: tempCode, // qui inserisco il codice di verifica
                });
                const savedUser = await newUser.save();

                // stampo il link di verifica nella console
                console.log("Nuovo user registrato con successo! localhost/api/account/verifyMail/" + tempCode);

                return res.redirect("/auth?registrazione=ok");
            } else {
                return res.redirect("/auth?registrazione=pswd_diverse");
            }

        }
    } catch (e) {
        console.log("ERROR! auth module (post /registrazione):" + e);
        res.status(500).send("ERROR FIELDs!");
    }

});


module.exports = router;