const express = require('express');
let router = express.Router();
const fs = require('fs');
const path = require('path');
let template = require('../lib/template.js');
let db = require('../lib/db.js');

router.get('/login', (req, res) => {
  let title = 'WEB - create';
  let list = template.list(req.list);
  let html = template.html(
    title,
    list,
    `<h5>아이디/비밀번호 로그인</h5>
    <form action="/auth/login_process" method="post">
        <input id="userId" name="userId" title="아이디 입력" placeholder="아이디 입력" class="input-text" type="text" value="" maxlength="20">
        <input id="userpswd" name="userpswd" title="비밀번호 입력" placeholder="비밀번호 입력" class="input-text" type="password" value="" maxlength="20">
        <p><input type="submit"> </p>
    </form>`,
    ""
  );
  res.send(html);
});

router.post('/login_process', (req, res) => {
  let post = req.body;
  let username = post.userId;
  res.send(`Welcome! ${username}`);
  //res.redirect(`/`);
});

module.exports = router;
