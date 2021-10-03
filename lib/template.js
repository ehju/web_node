var template = {
  html: function (title, list, context, control) {
    return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <nav>
                ${list}
            </nav>
            
            ${control}
            ${context}
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