const resetPassword = require("../controllers/resetPassword")
var express = require('express');
var router = express.Router();
//reset pwd routes
router.post("/", resetPassword.resetPasword)
router.post("/send", resetPassword.send)
module.exports = router;