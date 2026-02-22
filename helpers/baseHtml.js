function baseHtml({ title, navHtml, bodyHtml, extraHead = '' }) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <link rel="stylesheet" href="/styles.css" />
      ${extraHead}
    </head>
    <body>
      ${navHtml || ''}
      <main class="container">
        ${bodyHtml || ''}
      </main>
    </body>
  </html>
  `;
}

module.exports = baseHtml;