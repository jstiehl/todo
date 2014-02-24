var http = require('http');
var url  = require('url');
var path = require('path');
var fs   = require('fs');

var mime = require('mime');

var server = http.createServer(router).listen(7357);

function router (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  if (pathname.slice(0, 4) === '/api') {
    apiHandler(req, res);
  } else {
    if (pathname[pathname.length - 1] === '/') 
      pathname += 'index.html';
    staticFileHandler(pathname, res);
  }
}

function staticFileHandler (pathname, res) {
  fs.readFile(__dirname + '/public_html' + pathname, function (err, data) {
    if (err) return errHandler(err, res);
    console.log('[200]: ' + pathname);
    res.setHeader('Content-Type', mime.lookup(path.extname(pathname)));
    res.end(data);
  });
}

function errHandler (err, res) {
  if (err.code === 'ENOENT') {
    res.statusCode = 404;
    res.end('File not found!');
    console.log('[404]: File not found: ' + err.path);
  } else {
    console.error(err);
  }
}

function apiHandler (req, res) {
  if (req.method === 'GET') {
    var pathname = url.parse(req.url).pathname
    if (pathname === '/api/data') {
      fs.readFile("data/data.json", {encoding: 'utf8'}, function(err,data){
        if(err) return errHandler(err,res);
        try {
        data = JSON.stringify(JSON.parse(data)); // this will check to make sure json file is formatted correctly
        } catch (err){
          data = "{\"name\":\"Error\", \"email\":[\"error@error.error\"]}";
        }
        res.setHeader('Content-Type', mime.lookup('json'));
        res.end(data);
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  } else if (req.method === "POST"){
    req.pipe(fs.createWriteStream('data/data.json'));
    res.end();
  }
}







