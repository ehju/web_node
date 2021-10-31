let template = {
  html: function (title, list, context, control) {
    return `<!DOCTYPE html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                <script src="https://cdn.ckeditor.com/ckeditor5/30.0.0/classic/ckeditor.js"></script>
                <link rel="stylesheet" href="/css/template.css">
            </head>
            <body>
              <div class="header"><h1><a href="/">WEB</a></h1></div>
              <div class="row">
                <div class="nav">
                  <div class="user">
                    <button><a href="/auth/login">login</a></button>
                  </div>
                  <div class="list">
                    ${list}
                  </div>
                </div>
                <div class="container">
                  <div class="blog">
                    <div class="mycontrol">${control}</div>
                    <div class="card">${context}</div>
                  </div>
                </div>
              </div>
            </body>
            </html>
            `;
  },
  list: function (flist) {
    let list = '<ul>';
    flist.forEach((element) => {
      list = list + `<li><a href="/page/${element.id}">${element.title}</a></li>`;
    });
    list = list + '</ul>';
    return list;
  },
};

module.exports = template;