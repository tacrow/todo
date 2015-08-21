var mysql      = require('mysql');
var async      = require('async');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'todolist' 
});

async.waterfall([
    function(callback) {
        console.log("start");
        callback(null);
    },
    function(callback) {
        var sql = 'SELECT * FROM todo ORDER BY id DESC';
        connection.query(sql, function(err, rows) {
                          console.log(rows);
                          callback(null);
                        });
    },
    function(callback) {
        var sql = 'SELECT * FROM todo LIMIT 1, 1;';
        connection.query(sql, function(err, rows) {
                          console.log(rows);
                          callback(null, rows[0].id);
                        });
    },
    function(arg1, callback) {
      console.log(arg1 + 10);
      callback(null);
    }
], function (err, result) {
    console.log("end");
});

