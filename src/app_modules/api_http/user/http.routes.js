'use strict';
const express = require('express');
const router = express.Router();

// define the home page route
router.post('/', require('./create'));

module.exports = router;
