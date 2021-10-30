const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const qs = require('qs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
let template = require('./lib/template.js');
let manageRouter = require('./routes/manage');
let db = require('./lib/db.js');
const session = require('express-session')

let getList = (req, res, next) => {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    req.list = topics;
    next();
  });
};

app.disable('x-powered-by');
app.use(helmet());
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
  db.query(`SELECT * FROM topic`,function(error,topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [filteredId],function(error2,topic){
      if(error2){
        throw error2;
      }
      let list = template.list(req.list);
      let title = topic[0].title;
      let dateStr=topic[0].created;
      let a=dateStr.split(" ");
      let d=a[0].split("-");
      let t=a[1].split(":");
      
      //let t=a[1].split(":");
      //let formatedDate = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
      //let dateFormat = `${date.getDate()}`
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedContext = sanitizeHtml(topic[0].description, {
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
        `<h2>${sanitizedTitle}</h2><h5>${topic[0].created} &nbsp by ${topic[0].name}</h5>  <p>${sanitizedContext}</p>`,
        `<button><a href="/manage/create">new post</a></button>
                 <button><a href="/manage/update/${filteredId}">update</a></button>
                 <form action="/manage/delete_process" method="post" style="display:inline;">
                     <input type="hidden" name="id" value="${filteredId}">
                     <input type="submit" value="delete">
                 </form>`
      );
      res.send(html);
    });
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