const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const qs = require('qs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');

app.get('/', (req, res) => {
  fs.readdir('./data', (error, flist) => {
    var title = 'Welcome';
    var context = 'Hello, Node.js';
    var list = template.list(flist);
    var html = template.html(
      title,
      list,
      `<h2>${title}</h2><p>${context}</p>`,
      `<button><a href="/create">new post</a></button>`
    );
    res.send(html);
  });
});

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', (error, flist) => {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, context) => {
      var list = template.list(flist);
      var title = req.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedContext = sanitizeHtml(context, { allowedTags: ['h1', 'h2', 'a'] });
      var html = template.html(
        title,
        list,
        `<h2>${sanitizedTitle}</h2> <p>${sanitizedContext}</p>`,
        `<button><a href="/create">new post</a></button>
                 <button><a href="/update/${title}">update</a></button>
                 <form action="/delete_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                 </form>`
      );
      res.send(html);
    });
  });
});

app.get('/create', (req, res) => {
  fs.readdir('./data', (error, flist) => {
    var title = 'WEB - create';
    var list = template.list(flist);
    var html = template.html(
      title,
      list,
      `
    <form action="/create_process" method="post">
        <p><input type ="text" name="title"></p>
        <p>
            <textarea name="description"></textarea>        
        </p>
        <p><input type="submit"> </p>
    </form>`,
      `<button><a href="/create">new post</a></button>`
    );
    res.send(html);
  });
});

// create process
app.post('/create_process', (req, res) => {
  var body = '';
  req.on('data', (data) => {
    body = body + data;
  });
  req.on('end', () => {
    //정보 수신 끝
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, function (err) {
      if (err) {
        console.log(err);
        res.writeHead(302, { Location: `/` });
      } else {
        res.writeHead(302, { Location: `/page/${title}` });
        res.end();
      }
    });
  });
});

//update
app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', (error, flist) => {
    var title = req.params.pageId;
    var list = template.list(flist);
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, context) => {
      var html = template.html(
        title,
        list,
        `
            <form action="/update_process" method="post">
            <input type ="hidden" name="id" value=${title}>
            <p><input type ="text" name="title" value=${title}></p>
            <p>
                <textarea name="description" >${context}</textarea>        
            </p>
            <p><input type="submit"> </p>
        </form>`,
        `<button><a href="/create">new post</a></button>`
      );
      res.send(html);
    });
  });
});

// create process
app.post('/update_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    //정보 수신 끝
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, function (err) {
        res.writeHead(302, { Location: `/page/${title}` });
        res.end();
      });
    });
  });
});

app.post('/delete_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
      res.writeHead(302, { Location: `/` });
      res.end('done');
    });
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
