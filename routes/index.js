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
var habbo = new habbo();
core.construct();
var siteVars = {
    title: 'Express + EJS',
    hotelname: core.vars.hotelname,
};
/* GET home page. */
router.get('/', function(req, res, next)
{
    if (req.session.name === undefined)
    {
        siteVars.error = null;
        res.render('index', siteVars);
    }
    else
    {
        res.redirect('/client');
    }
});
router.post('/', function(req, res)
{
    var username = req.body.log_username;
    var password = core.hash(req.body.log_password);
    habbo.loginUser(username, password, function(rows)
    {
        if (rows === null)
        {
            res.status(200);
            console.log('190');
            siteVars.error = 'Oeps! Kloppen je gegevens wel?';
            res.render('index', siteVars);
        }
        else
        {
            res.status(200);
            req.session.name = username;
            res.redirect('/client');
        }
    });
});
module.exports = router;