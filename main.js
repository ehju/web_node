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
let manageRouter = require('./routes/manage');


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

app.use('/manage', manageRouter);
 
app.get('/', (req, res) => {
  let title = 'Welcome';
  let context = 'Hello, Node.js';
  let list = template.list(req.list);
  let html = template.html(
    title,
    list,
    `<h2>${title}</h2><p>${context}</p><img src="/images/coding.jpg" style="width:500px; margin:10px">`,
    `<button><a href="manage/create">new post</a></button>`
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
        `<button><a href="/manage/create">new post</a></button>
                 <button><a href="/manage/update/${title}">update</a></button>
                 <form action="/manage/delete_process" method="post" style="display:inline;">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                 </form>`
      );
      res.send(html);
    }
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