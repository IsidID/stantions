const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs/promises');

const server = http.createServer((req, res) => {
  // Handle the new route for updating data
  if (req.url === '/update-data') {
    fetchData()
      .then((data) => {
        // Send the updated data in JSON format
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error fetching data: ${error.message}`);
      });
  } else {
    // Handle other routes (e.g., serving static files)
    // ...

    // For example, you can still serve the HTML file
    fs.readFile('dist/index.html', 'utf-8')
      .then((content) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error serving HTML file: ${error.message}`);
      });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});

const fetchData = async () => {
  const response = await fetch('https://net.tnt-tpi.com/page');
  const htmlString = await response.text();
  const regex = /<script type="text\/javascript">(.*?)<\/script>/s;
  const match = htmlString.match(regex);

  if (match) {
    const scriptCode = match[1].trim();
    eval(scriptCode); // get bslist var here
    return bslist.filter((item) => ['CHTK', 'CHR2', 'GRD2', 'CHEM'].includes(item[0]));
  } else {
    return [];
  }
};
