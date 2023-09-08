// il tool dei cookie jwt


const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


function generateAccessToken(data) {
    // scadenza 1800s = 30min
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '4800s' });
}

function autorization(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.redirect("/auth?token=not_found");
    }
    try {
        // proviamo a verificare il token
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user_id = data.user_id;
        return next();
    } catch {
        // se è sbagliato vuol dire che non era valido
        return res.redirect("/auth?token=not_valid");
    }
}

module.exports = {generateAccessToken, autorization}