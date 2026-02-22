const express = require('express');
const router = express.Router();
const api = require('../controllers/apiProductController');

router.get('/products', api.getAll);
router.get('/products/:id', api.getById);
router.post('/products', api.create);
router.put('/products/:id', api.update);
router.delete('/products/:id', api.remove);

module.exports = router;