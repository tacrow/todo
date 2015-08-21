var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'todolist' 
});

/* 全体のTodo取得 */
router.get('/', function(req, res, next) {
  var sql = 'SELECT * FROM todo ORDER BY id DESC';
  
  connection.query(sql, function(err, rows) {
                       res.json(rows);
                    });
});

/* IDごとのTodo取得 */
router.get('/:id', function(req, res, next) {
//     res.json({ 'url': 'GET /:id' });
   var sql = 'SELECT * FROM todo WHERE id = ?';
   
   var data = [req.params.id];
  
   connection.query(sql, data, function(err, rows) {
                       res.json(rows);
                    });
});
           
/* Todoの新規追加 */
router.post('/', function(req, res, next) {
    
    var sql = 'INSERT INTO todo (memo, ' +
                'register_date, limit_date, priority) ' +
                'values (?, CURRENT_TIMESTAMP, ?, ?)';
    
    var data = [
        req.body.memo,
        req.body.limit_date,
        req.body.priority
    ]
    
    connection.query(sql, data, function(err, rows) {
                       console.log(err);
                       res.json({ "lastinsertID": rows.insertId });
                    });
});

/* Todoの更新 */
router.put('/:id', function(req, res, next) {
//     res.json({ 'url': 'PUT /:id' });
       var sql = 'update todo set memo=?, limit_date=?, priority=?, status_flag=? where id=?';
      
       var data = [
         req.body.memo,
         req.body.limit_date,
         req.body.priority,
         req.body.status_flag,
         req.params.id
       ]
       
       connection.query(sql, data, function(err, rows) {
                       res.json({ "updateID": req.params.id });
                    });
});

/* Todoの削除 */
router.delete('/:id', function(req, res, next) {
//     res.json({ 'url': 'DELETE /:id' });
       var sql = 'DELETE FROM todo WHERE id = ?';
       
       var data = [req.params.id];
  
       connection.query(sql, data, function(err, rows) {
                       res.json(rows);
                    });
});

module.exports = router;
