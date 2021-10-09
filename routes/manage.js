const express = require('express');
let router = express.Router();
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const path = require('path');
let template = require('../lib/template.js');


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
  fs.writeFile(`data/${title}`, description, 'utf8',(err) => {
    res.redirect(`/page/${title}`);
  });
});

//update
router.get('/update/:pageId', (req, res) => {
  let title = req.params.pageId;
  let list = template.list(req.list);
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, context) => {
    let html = template.html(
      title,
      list,
      `
            <form action="/manage/update_process" method="post">
            <input type ="hidden" name="id" value=${title}>
            <p><input type ="text" name="title" value=${title}></p>
            <textarea id="editor" name="description" >${context}</textarea>        
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

// create process
router.post('/update_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let title = post.title;
  let description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, (error) => {
    fs.writeFile(`data/${title}`, description,'utf8', (err) => {
      res.redirect(`/page/${title}`);
    });
  });
});

router.post('/delete_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, (error) => {
    res.redirect('/');
  });
});

module.exports = router;
