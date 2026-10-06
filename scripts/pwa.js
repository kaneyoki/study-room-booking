const fs = require('fs');
const f = 'dist/index.html';
let h = fs.readFileSync(f, 'utf8');
if (!h.includes('rel="manifest"')) {
  h = h.replace(
    '</head>',
    '<link rel="manifest" href="/manifest.json"/><meta name="theme-color" content="#2563eb"/></head>'
  );
  fs.writeFileSync(f, h);
}
console.log('Da chen manifest vao dist/index.html');