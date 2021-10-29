var http = require('http');
var cookie = require('cookie');
http.createServer(function(request, response){
  //console.log(request.headers.cookie);
  var cookies = {};
  if(request.headers.cookie !==undefined){
    cookies= cookie.parse(request.headers.cookie);
  }
  console.log(cookies);
  //response.setHeader('Content-Type', 'text/html');
  //response.setHeader('X-Foo', 'bar');
  //response.writeHead(200, { 'Content-Type': 'text/plain' });
  //response.end('ok');
  response.writeHead(200,{
    'Set-Cookie':[
      'yummy_cookie=choco',
      'tasty_cookie=strawberry',
      `Permanent=cookies; Max-Age=${60*60*24*30}`,
      'Secure=Secure; Secure',
      'HttpOnly=HttpOnly; HttpOnly',
      'Path=Path; Path=/cookie',
      'Domain=Domain; Domain=.goorm.io'
    ]
  });
  response.end('Cookie!!');
}).listen(5000);