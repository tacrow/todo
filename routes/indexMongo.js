var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();
var todos;

mongodb.MongoClient.connect("mongodb://localhost:27017/todolist", function(err, database) {
  todos = database.collection("todo");
});

/* 全体のTodo取得 */
router.get('/', function(req, res, next) {
      todos.find().toArray(function(err, rows) {
          res.json(rows);
      });
});

/* IDごとのTodo取得 */
router.get('/:id', function(req, res, next) {
  try {
      todos.findOne({_id: mongodb.ObjectID(req.params.id)}, function(err, rows) {
          res.json(rows);
      });
  }
  catch(error) {
      console.log(error);
      res.send(error);
  }
});

/* Todoの新規追加 */
router.post('/', function(req, res, next) {
    var json = req.body;
    todos.save(json, function() {
      res.json({});
    });
});

/* Todoの更新 */
router.put('/:id', function(req, res, next) {
    var json = req.body;
    var id = req.params.id;
    try {
      json._id = mongodb.ObjectID(id);
      todos.save(json, function() {
        res.json({});
      });
    }
    catch(error) {
      console.log(error);
      res.send(error);
    }

});

/* Todoの削除 */
router.delete('/:id', function(req, res, next) {
  try {
    todos.remove({_id: mongodb.ObjectID(req.params.id)}, function() {
      res.json({"_id": mongodb.ObjectID(req.params.id)});
    });
  }
  catch(error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
