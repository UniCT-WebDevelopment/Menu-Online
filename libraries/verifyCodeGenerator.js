const crypto = require('crypto');
const randomstring = require('randomstring');


function verifyCodeGenerator() {
    let hash = crypto.createHash('md5').update(randomstring.generate(16)).digest("hex");
    return hash;
}

module.exports = {verifyCodeGenerator};
