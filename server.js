const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs/promises');

const generateHTML = async () => {
  try {
    const htmlString = await fetch('https://net.tnt-tpi.com/page').then((response) => response.text());
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

    const htmlContent = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Strange things</title>
        </head>
        <body><button onclick="location.reload();">Refresh</button>${content}</body>
      </html>`;

    await fs.writeFile('dist/index.html', htmlContent, 'utf-8');
    console.log('index.html generated successfully.');
  } catch (error) {
    console.error('Error generating index.html:', error);
  }
};

if (!process.env.NETLIFY) {
  // Only run the server if not in Netlify build environment
  const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    // Generate index.html before responding to requests
    await generateHTML();

    // Read and send the generated index.html
    const indexContent = await fs.readFile('dist/index.html', 'utf-8');
    res.end(indexContent);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
  });
} else {
  console.log('Running in Netlify build environment. Server will not be started.');
}
