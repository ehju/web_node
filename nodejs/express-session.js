//sample code from express session
var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()
//session middleware 사용
//req 객체의 property로 session 객체 추가
app.use(session({
  secret: 'keyboard cat', //required option 서버에 안올라가야함.
  resave: false,   // session data가 바뀌기 전까지 저장소에 저장하지않음 true :session이 바뀌건 말건 저장소에 저장
  saveUninitialized: true // session 이 필요하기 전까지는 session을 구동하지않음 
}))

app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})

app.get('/foo', function (req, res, next) {
  console.log(req.session);
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen(5000,function(){
  console.log(5000)
  
});

