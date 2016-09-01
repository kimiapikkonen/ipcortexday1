const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

function handler(req, res){
  if(req.url === '/'){
    res.writeHead(200);
    res.end('hello world\n') 
  }
  
  if(req.url.indexOf('.') > -1){
    var resource = fs.readFileSync(__dirname + '/public' + req.url)
    var type = req.url.split('.')[1];
    res.writeHead(200, {'Content-type': 'text/' + type});
    res.end(resource)
  }
}

https.createServer(options, handler).listen(8000);
