const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const qs = require('qs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');
let template = require('./lib/template.js');
let getList = (req, res, next) => {
  fs.readdir('./data', (error, flist) => {
    req.list = flist;
    next();
  });
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', getList);

app.get('/', (req, res) => {
  let title = 'Welcome';
  let context = 'Hello, Node.js';
  let list = template.list(req.list);
  let html = template.html(
    title,
    list,
    `<h2>${title}</h2><p>${context}</p><img src="/images/coding.jpg" style="width:500px; margin:10px">`,
    `<button><a href="/create">new post</a></button>`
  );
  res.send(html);
});

app.get('/page/:pageId', (req, res, next) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, context) => {
    if (err) {
      next(err);
    } else {
      let list = template.list(req.list);
      let title = req.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedContext = sanitizeHtml(context, {
        allowedTags: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'strong',
          'em',
          'br',
          'li',
          'ol',
          'ul',
          'span',
          'blockquote',
        ],
      });
      let html = template.html(
        title,
        list,
        `<h2>${sanitizedTitle}</h2> <p>${sanitizedContext}</p>`,
        `<button><a href="/create">new post</a></button>
                 <button><a href="/update/${title}">update</a></button>
                 <form action="/delete_process" method="post" style="display:inline;">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                 </form>`
      );
      res.send(html);
    }
  });
});

app.get('/create', (req, res) => {
  let title = 'WEB - create';
  let list = template.list(req.list);
  let html = template.html(
    title,
    list,
    `
    <form action="/create_process" method="post">
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
    `<button><a href="/create">new post</a></button>`
  );
  res.send(html);
});

// create process
app.post('/create_process', (req, res) => {
  let post = req.body;
  let title = post.title;
  let description = post.description;
  fs.writeFile(`data/${title}`, description, function (err) {
    if (err) {
      console.log(err);
      res.redirect(`/`);
    } else {
      res.redirect(`/page/${title}`);
    }
  });
});

//update
app.get('/update/:pageId', (req, res) => {
  let title = req.params.pageId;
  let list = template.list(req.list);
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, context) => {
    let html = template.html(
      title,
      list,
      `
            <form action="/update_process" method="post">
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
      `<button><a href="/create">new post</a></button>`
    );
    res.send(html);
  });
});

// create process
app.post('/update_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let title = post.title;
  let description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, function (err) {
      res.redirect(`/page/${title}`);
    });
  });
});

app.post('/delete_process', (req, res) => {
  let post = req.body;
  let id = post.id;
  let filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});
app.use((req, res, next) => {
  res.status(404).send("Sorry. Can't find that page");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});