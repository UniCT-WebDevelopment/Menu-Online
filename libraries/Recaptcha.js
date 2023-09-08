const fetch = require('node-fetch');

async function VerifyRecaptcha(req, res, next) {

    const recaptcha_response = req.body["g-recaptcha-response"];
    const validateRecaptcha = await fetch(
        'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.RECAPTCHA_PRIVATE_KEY + '&response=' + recaptcha_response,
        {
            method: "POST",
        }
    ).then(_res => _res.json());

    if(validateRecaptcha.success === true) { return next(); } 
    else { return res.redirect("/auth?google-recaptcha=invalid"); }

}

module.exports = {VerifyRecaptcha}