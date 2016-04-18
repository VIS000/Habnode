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
var mysql = require('mysql2');
var crypto = require('crypto');
var config = require('./config');
var langPath = './languages/' + config.lang;
var lang = require(langPath);
var core = function()
{
    this.salt = "Kjeii@uf3$guys()7xP!";
    this.mysql = mysql;
    this.pool = mysql.createPool(
    {
        host: config.dbhost,
        user: config.dbuser,
        password: config.dbpass,
        database: config.dbname
    });
    this.httpsEnabled = config.https;
    this.lang = lang;
    this.construct = function()
    {
        this.dbConnect();
    };
    this.dbConnect = function()
    {
        console.log('Setting up mysql');
        console.log(this.pool);
    };
    this.hash = function(string)
    {
        return crypto.createHmac('sha256', this.salt)
            .update(string)
            .digest('hex');
    };
    this.getUsersOnline = function(callback)
    {
        console.log('SELECT * FROM server_status');
        this.pool.getConnection(function(err, conn)
        {
            if (err)
            {
                console.log(err);
            }
            conn.prepare('SELECT * FROM server_status',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        statement.execute([], function(err,
                            rows)
                        {
                            if (err)
                            {
                                var online =
                                    'Error';
                            }
                            else
                            {
                                callback(rows[0].active_players);
                            }
                        });
                    }
                });
            conn.release();
            return;
        });
    };
    this.vars = config;
};
module.exports = core;