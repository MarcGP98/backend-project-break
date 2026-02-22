const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/login', auth.showLogin);
router.post('/login', auth.doLogin);
router.get('/logout', auth.logout);

module.exports = router;