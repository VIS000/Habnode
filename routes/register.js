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
var language = core.lang;
siteVars = {
    hotelname: core.vars.hotelname,
    error: null
};
/* GET home page. */
router.get('/', function(req, res, next)
{
    if (req.session.name === undefined)
    {
        res.render('register', siteVars);
    }
    else
    {
        res.redirect('/client');
    }
});
router.post('/', function(req, res)
{
    var username = req.body.reg_username;
    var password = core.hash(req.body.reg_password);
    var password_rep = core.hash(req.body.reg_password_rep);
    var email = req.body.reg_email;

    function Register(callback)
    {
        if (req.body.reg_password.length < 3)
        {
            siteVars.error = language.reg_err.pwLength;
            callback(false);
        }
        else
        {
            if (password !== password_rep)
            {
                siteVars.error = language.reg_err.pwRepeat;
                callback(false);
            }
            else
            {
                habbo.isEmail(email, function(allowed)
                {
                    if (allowed)
                    {
                        habbo.isAllowedUsername(username,
                            function(allowed)
                            {
                                if (allowed)
                                {
                                    habbo.userExists(
                                        username,
                                        function(
                                            exists)
                                        {
                                            if (
                                                exists
                                            )
                                            {
                                                siteVars
                                                    .error =
                                                    language
                                                    .reg_err
                                                    .userExists;
                                                callback
                                                    (
                                                        false
                                                    );
                                            }
                                            else
                                            {
                                                habbo
                                                    .addUser(
                                                        username,
                                                        password,
                                                        email,
                                                        function(
                                                            sucsess
                                                        )
                                                        {
                                                            if (
                                                                sucsess
                                                            )
                                                            {
                                                                callback
                                                                    (
                                                                        true
                                                                    );
                                                            }
                                                            else
                                                            {
                                                                res
                                                                    .status(
                                                                        500
                                                                    );
                                                            }
                                                        }
                                                    );
                                            }
                                        });
                                }
                                else
                                {
                                    siteVars.error =
                                        language.reg_err
                                        .userAllowed;
                                    callback(false);
                                }
                            });
                    }
                    else
                    {
                        siteVars.error = language.reg_err.emailAllowed;
                        callback(false);
                    }
                });
            }
        }
    }
    Register(function(sucsess)
    {
        if (sucsess)
        {
            req.session.name = username;
            res.redirect('/client');
        }
        else
        {
            res.render('register', siteVars);
        }
    });
});
module.exports = router;