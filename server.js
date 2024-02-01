const http = require('http');
const fetch = require('node-fetch');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  // Fetch data from external source
  fetch('https://net.tnt-tpi.com/page')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data, status: ${response.status}`);
      }
      return response.text();
    })
    .then((htmlString) => {
      // Parse HTML and extract necessary data
      const regex = /<script type="text\/javascript">(.*?)<\/script>/s;
      const match = htmlString.match(regex);
      let content;

      if (match) {
        const scriptCode = match[1].trim();
        eval(scriptCode); // get bslist var here

        // Filter stations based on specific criteria
        const stations = bslist.filter((item) => ['CHTK', 'CHR2', 'GRD2', 'CHEM'].includes(item[0]));

        // Generate HTML content
        content = `<ul>${stations.map((item) => `<li>${item[3]}</li><li>Назва станції - ${item[0]}</li><li>Доступність - ${item[5]}</li>`)
          .join('</ul><ul>')}</ul>`;
      } else {
        content = 'no data';
      }

      // Send HTML response to the client
      res.end(`<!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <title>Strange things</title>
                    </head>
                    <body><button onclick="location.reload();">Refresh</button>${content}</body>
                  </html>
      `);
    })
    .catch((error) => {
      // Handle errors during data fetching
      console.error('Error fetching data:', error);
      res.end('Error fetching data');
    });
});

// Use the process.env.PORT or 3000 if not defined
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
