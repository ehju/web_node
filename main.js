const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
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
      var sanitizedContext = sanitizeHtml(context, { allowedTags: ['h1','h2','a'] });
      var html = template.html(
        title,
        list,
        `<h2>${sanitizedTitle}</h2> <p>${sanitizedContext}</p>`,
        `<button><a href="/create">new post</a></button>
                 <button><a href="/update?id=${title}">update</a></button>
                 <form action="delete_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                 </form>`
      );
      res.send(html);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template =require('./lib/template.js');
var path = require('path');
var sanitizeHtml =require('sanitize-html');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var folder = 'data';
    var title = queryData.id;
    var flist = fs.readdirSync(folder);
    if (pathname == '/') {
        if (queryData.id === undefined) {
            var title = 'Welcome';
            var context = 'Hello, Node.js';
            var list = template.list(flist);

            response.writeHead(200);
            var html = template.html(
                title,
                list,
                `<h2>${title}</h2><p>${context}</p>`,
                `<button><a href="/create">new post</a></button>`
            );
            response.end(html);
        } else if (flist.includes(queryData.id)) {
            var filteredId = path.parse(queryData.id).base;
            var context = fs.readFileSync(`data/${filteredId}`, 'utf8');
            var list = template.list(flist);
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedContext = sanitizeHtml(context, {allowedTags :['h1']});
            response.writeHead(200);
            var html = template.html(
                title,
                list,
                `<h2>${sanitizedTitle}</h2> <p>${sanitizedContext}</p>`,
                `<button><a href="/create">new post</a></button>
                 <button><a href="/update?id=${title}">update</a></button>
                 <form action="delete_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                 </form>`
            );
            response.end(html);
            //});
        } else {
            var context = 'No context';
            var list = template.list(flist);
            response.writeHead(200);
            var html = template.html(
                title,
                list,
                `<h2>${title}</h2><p>${context}</p>`,
                `<button><a href="/create">new post</a></button>`
            );
            response.end(html);
        }
    } else if (pathname === '/create') {
        var title = 'WEB - create';
        var list = template.list(flist);
        var html = template.html(
            title,
            list,
            `
    <form action="create_process" method="post">
        <p><input type ="text" name="title"></p>
        <p>
            <textarea name="description"></textarea>        
        </p>
        <p><input type="submit"> </p>
    </form>`,
            `<button><a href="/create">new post</a></button>`
        );
        response.end(html);
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            //정보 수신 끝
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, function (err) {
                if (err) {
                    console.log(err);
                    response.writeHead(302, { Location: `/` });
                } else {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                }
            });
        });
    } else if (pathname === '/update') {
        var title = queryData.id;
        var list = template.list(flist);
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, context) {
            var html = template.html(
                title,
                list,
                `
            <form action="update_process" method="post">
            <input type ="hidden" name="id" value=${title}>
            <p><input type ="text" name="title" value=${title}></p>
            <p>
                <textarea name="description" >${context}</textarea>        
            </p>
            <p><input type="submit"> </p>
        </form>`,
                `<button><a href="/create">new post</a></button>`
            );
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            //정보 수신 끝
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, description, function (err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function (error) {
                response.writeHead(302, { Location: `/` });
                response.end('done');
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);
//}
*/