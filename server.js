# 2. Create a clean server.js file that forces port 80
cat << 'EOF' > server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
});

server.listen(80, () => {
    console.log('Server actively listening on port 80');
});
EOF

# 3. Start it with PM2
pm2 start server.js --name "shop-site"
pm2 save
