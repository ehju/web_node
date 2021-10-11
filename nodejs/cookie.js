var http = require('http');
http.createServer(function(request, response){
  //response.setHeader('Content-Type', 'text/html');
  //response.setHeader('X-Foo', 'bar');
  //response.writeHead(200, { 'Content-Type': 'text/plain' });
  //response.end('ok');
  //response.writeHead(200,{
  //  'Set-Cookie':['yummy_cookie=choco','tasty_cookie=strawberry']
  //});
  response.end('Cookie!!');
}).listen(5000);