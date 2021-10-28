const express = require('express');
let router = express.Router();
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const path = require('path');
let template = require('../lib/template.js');
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'nodejs',
  password: 'jspass',
  database: 'opentutorials',
});
db.connect();

router.get('/create', (req, res) => {
  let title = 'WEB - create';
  let list = template.list(req.list);
  let html = template.html(
    title,
    list,
    `
    <form action="/manage/create_process" method="post">
        <p><input type ="text" name="title"></p>
        <textarea id="editor" name="description" ></textarea>
        <p><input type="submit"> </p>
    </form>
    <script>
        ClassicEditor
        .create( document.querySelector( '#editor' ) )
        .catch( error => {
            console.error( error );
        } );
    </script>`,
    `<button><a href="/manage/create">new post</a></button>`
  );
  res.send(html);
});

// create process
router.post('/create_process', (req, res) => {
  let post = req.body;
  let title = post.title;
  let description = post.description;
  db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
    [title, description,1],
    function(error, result){
      if(error){
        throw error;
      }
      res.redirect(`/page/${result.insertId}`);
    }
  );
});

//update
router.get('/update/:pageId', (req, res) => {
  //let title = req.params.pageId;
  let list = template.list(req.list);
  let filteredId = path.parse(req.params.pageId).base;
  db.query(`SELECT * FROM topic WHERE id=?`, [filteredId],function(err,topic){
    console.log(topic);
    let html = template.html(
      topic.title,
      list,
      `
            <form action="/manage/update_process" method="post">
            <input type ="hidden" name="id" value=${topic[0].id}>
            <p><input type ="text" name="title" value=${topic[0].title}></p>
            <textarea id="editor" name="description" >${topic[0].description}</textarea>        
            <p><input type="submit"> </p>
        </form>
        <script>
        ClassicEditor
        .create( document.querySelector( '#editor' ) )
        .catch( error => {
            console.error( error );
        } );
    </script>`,
      `<button><a href="/manage/create">new post</a></button>`
    );
    res.send(html);
  });
});

// update process
router.post('/update_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let title = post.title;
  let description = post.description;
  db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,
    [title, description,id],
    function(error, result){
      if(error){
        throw error;
      }
      res.redirect(`/page/${id}`);
    }
  );
});

router.post('/delete_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let filteredId = path.parse(id).base;
  db.query(`DELETE FROM topic WHERE id = ?`, [id], function(error,result){
    if(error){
      throw error;
    }
    res.redirect('/');
  });

});

module.exports = router;
