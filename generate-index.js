const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs/promises');

if (!process.env.NETLIFY) {
  // Only run the server if not in Netlify build environment
  const generateHTML = async () => {
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
          <title>ДАНІ ПРО СТАНЦІЇ</title>
        </head>
        <body>
          <button onclick="refreshData();">Refresh</button>
          <div id="content">${content}</div>
          <script>
            function refreshData() {
              // Fetch updated data from the server
              fetch('/update-data')
                .then(response => response.json())
                .then(data => {
                  // Generate new HTML content with updated data
                  const newContent = data.length
                    ? '<ul>' + data.map(item => '<li>' + item[3] + '</li><li>Назва станції - ' + item[0] + '</li><li>Доступність - ' + item[5] + '</li>').join('</ul><ul>') + '</ul>'
                    : 'no data';

                  // Update the content in the DOM
                  document.getElementById('content').innerHTML = newContent;
                });
            }
          </script>
        </body>
      </html>`;

    await fs.writeFile('dist/index.html', htmlContent, 'utf-8');
    console.log('index.html generated successfully.');
  };

  generateHTML();
} else {
  console.log('Running in Netlify build environment. Server will not be started.');
}
