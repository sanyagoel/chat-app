const express = require('express');
const router = express.Router();
const homer = require('../controller/controller1');


router.get('/',homer.home);

router.post('/chatroom',homer.posth);

module.exports = router;

