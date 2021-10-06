var template = {
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
            <header><h1><a href="/">WEB</a></h1></header>
            <nav>
                ${list}
            </nav>
            <div class="container">
              <div class="mycontrol">${control}</div>
              <div class="blog">${context}</div>
            </div>
            </body>
            </html>
            `;
  },
  list: function (flist) {
    var list = '<ul>';
    flist.forEach((element) => {
      list = list + `<li><a href="/page/${element}">${element}</a></li>`;
    });
    list = list + '</ul>';
    return list;
  },
};

module.exports = template;