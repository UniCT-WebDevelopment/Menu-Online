const mongoose = require('mongoose');

const bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
    // nome del menu, per esempio menu della pizzeria ciao
    email: {
        type: String,
        required: true,
        unique: true,
        min: 8,
        max: 150
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    menu_id: {
        // menu dell'utente
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: false,
        default: null,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verify_code: {
        type: String,
        default: null,
        max: 150,
        required: false,
        unique: false,
    }
}, {timestamps: true});

// codice eseguito nel presalvataggio
userSchema.pre('save', function(next) {
    var user = this;

    // se non modifico non devo fare nulla
    if (!user.isModified('password')) return next();

    // genero il salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash della password con il nostro nuovo salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // riscriviamo sulla vecchia password la nuova password
            user.password = hash;
            next();
        });
    });
});

// metodo sicuro per comparare le password
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


const User = mongoose.model('User', userSchema, 'User');
module.exports = User;