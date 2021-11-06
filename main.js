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
let authRouter = require('./routes/auth');
let db = require('./lib/db.js');
let sessInfo = require('./lib/session.js');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

let getList = (req, res, next) => {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    req.list = topics;
    next();
  });
};
let cspOptions = {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", 'https://cdn.ckeditor.com/ckeditor5/30.0.0/classic/ckeditor.js', "'unsafe-inline'"]
      //"script-src" : [ "'self'", "'sha256-1Xi5yztaMBBRD9kw29rAo7bsHS3yVOyWXhhI/z+QfUA='"]
    },
  }
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: cspOptions
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: sessInfo.secret, //required option 서버에 안올라가야함.
  resave: sessInfo.resave,   // session data가 바뀌기 전까지 저장소에 저장하지않음 true :session이 바뀌건 말건 저장소에 저장
  saveUninitialized: sessInfo.saveUninitialized, // session 이 필요하기 전까지는 session을 구동하지않음 
  store : new FileStore()
}));
app.get('*', getList);

app.use('/manage', manageRouter);
app.use('/auth', authRouter);

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
        `<a class="btn-style post-btn-style" href="/manage/create">new post</a>
                 <a class="btn-style post-btn-style" href="/manage/update/${filteredId}">update</a>
                 <form action="/manage/delete_process" method="post" style="display:inline;">
                     <input type="hidden" name="id" value="${filteredId}">
                     <input class="btn-style post-btn-style" type="submit" value="delete">
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