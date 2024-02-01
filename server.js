const http = require('http');
const fs = require('fs');
const fetch = require('node-fetch');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  const indexPath = './dist/index.html';

  fs.readFile(indexPath, 'utf8', (err, htmlString) => {
    if (err) {
      console.error(`Error reading ${indexPath}:`, err);
      res.end('Error reading index.html');
      return;
    }

    const regex = /<script type="text\/javascript">(.*?)<\/script>/s;
    const match = htmlString.match(regex);
    let content;

    if (match) {
      const scriptCode = match[1].trim();
      eval(scriptCode); // get bslist var here
      const stations = bslist.filter((item) => ['CHTK', 'CHR2', 'GRD2', 'CHEM'].includes(item[0]));
      content = `<ul>${stations
        .map(
          (item) =>
            `<li>${item[3]}</li><li>Назва станції - ${item[0]}</li><li>Доступність - ${item[5]}</li>`
        )
        .join('</ul><ul>')}</ul>`;
    } else {
      content = 'no data';
    }

    res.end(`<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Strange things</title>
                  </head>
                  <body><button onclick="location.reload();">Refresh</button>${content}</body>
                </html>`);
  });
});

// Use the process.env.PORT or 3000 if not defined
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
