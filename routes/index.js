const router = require('express').Router();

// rotta disponibile per una eventuale homepage
router.get('/', (req, res) => {
    res.redirect('/account');
});

module.exports = router;