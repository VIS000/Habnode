/* 
 * _    _       _                     _
 *| |  | |     | |                   | |
 *| |__| | __ _| |__  _ __   ___   __| | ___
 *|  __  |/ _` | '_ \| '_ \ / _ \ / _` |/ _ \
 *| |  | | (_| | |_) | | | | (_) | (_| |  __/
 *|_|  |_|\__,_|_.__/|_| |_|\___/ \__,_|\___|
 *
 * HabNode v1.0 -VIS000 2016
 */
var express = require('express');
var core = require('../habbo/class.core');
var habbo = require('../habbo/class.habbo');
var router = express.Router();
core = new core();
habbo = new habbo();
core.construct();

/* GET home page. */

router.get('/', function(req, res, next) {
    if(req.session.name === undefined) {
        res.redirect('/');
    } else {
            habbo.clientLogin(req.session.name, function(sso) {
              res.render('client', {
              hotelname: core.vars.hotelname,
              username: req.session.name,
              sso_token: sso
            });
        });  
    }
});


module.exports = router;
