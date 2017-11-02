'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/users.controller');

router.post('/signUp', controller.signUp);
router.post('/login', controller.login);
router.get('/email_verify', controller.emailVerify);

module.exports = router;