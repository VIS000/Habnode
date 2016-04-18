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
var core = require('./class.core');
core = new core();
var uuid = require('node-uuid');
var time = Date.now || function()
{
    return +new Date;
};
var habbo = function()
{
    this.loginUser = function(username, password, callback)
    {
        core.pool.getConnection(function(err, conn)
        {
            conn.prepare(
                'SELECT * FROM players WHERE password = ? and username = ?',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        statement.execute([password,
                            username], function(err,
                            rows)
                        {
                            console.log(rows);
                            if (rows[0] ===
                                undefined)
                            {
                                callback(null);
                            }
                            else
                            {
                                callback(rows);
                            }
                        });
                    }
                });
        });
    };
    this.isBanned = function(username, callback)
    {
        core.pool.getConnection(function(err, conn)
        {
            conn.prepare('SELECT * FROM bans WHERE data = ?',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        statement.execute([username],
                            function(err, rows)
                            {
                                if (rows === undefined)
                                {
                                    callback(false);
                                }
                                else
                                {
                                    callback(true);
                                }
                            });
                    }
                });
        });
    };
    this.userExists = function(username, callback)
    {
        core.pool.getConnection(function(err, conn)
        {
            conn.prepare(
                'SELECT id FROM players WHERE username = ?',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                        callback(false);
                    }
                    else
                    {
                        statement.execute([username],
                            function(err, rows)
                            {
                                if (rows[0] ===
                                    undefined)
                                {
                                    callback(false);
                                }
                                else
                                {
                                    callback(true);
                                }
                            });
                    }
                });
        });
    };
    this.isEmail = function(email, callback)
    {
        var regex = new RegExp(/[\w-]+@([\w-]+\.)+[\w-]+/);
        console.log(email);
        console.log(regex.test(email));
        if (regex.test(email))
        {
            callback(true);
        }
        else
        {
            callback(false);
        }
    };
    this.isAllowedUsername = function(username, callback)
    {
        var regex = new RegExp(/^[a-zA-Z0-9_]{3,14}$/);
        if (regex.test(username))
        {
            callback(true);
        }
        else
        {
            callback(false);
        }
    };
    this.addUser = function(username, password, email, callback)
    {
        core.pool.getConnection(function(err, conn)
        {
            conn.prepare(
                'INSERT INTO players (username, password, email, motto, reg_timestamp, figure) VALUES (?, ?, ?, ?, ?, ?)',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        statement.execute([username,
                            password, email,
              'Habnode v1.0', time(),
              'hr-110-42.ch-215-69.hd-180-30.cp-3128-62,s-0.lg-270-64.sh-300-64.cc-260-63'
              ], function(err)
                        {
                            if (err)
                            {
                                console.log(err);
                                callback(false);
                            }
                            else
                            {
                                callback(true);
                            }
                        });
                    }
                });
        });
    };
    this.clientLogin = function(username, callback)
    {
        var sso = uuid.v4();
        console.log(sso);
        core.pool.getConnection(function(err, conn)
        {
            conn.prepare(
                'UPDATE players SET auth_ticket = ? WHERE username = ?',
                function(err, statement)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        statement.execute([sso, username],
                            function(err)
                            {
                                if (err)
                                {
                                    console.log(err);
                                }
                                callback(sso);;
                            });
                    }
                });
        });
    };
};
module.exports = habbo;