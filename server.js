var http = require('http');
var url  = require('url');
var path = require('path');
var fs   = require('fs');
var Parse = require('parse/node').Parse;
var mime = require('mime');
var server = http.createServer(router).listen(process.env.PORT || 5000);
Parse.initialize("D7copRkkZPKmIbFvELzkaxwGAp95DRSyvbOJa7Z5", "rl4dixTWclxNLVMXWPkxliUN9vU9A6mEMM4lMKpc");


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
    //send back a list of todos
    // var toDo = new Parse.Object("ToDo");
    var parseQuery = new Parse.Query("ToDo");
    parseQuery.find({
      success: function(toDoList){
          res.setHeader('Content-Type', mime.lookup('json'));
        res.end(JSON.stringify(toDoList));
      },
      error: function(toDoList, error) {
        // error is an instance of Parse.Error.
        console.log('Error encountered while getting Parse objects: ' + error.message);
      }
    });

  } else if (req.method === "POST"){

    var body = "";
    req.on('data', function (chunk) {
      body += chunk;
    });

    var today = new Date();

    req.on('end', function () {
      var toDo = new Parse.Object("ToDo");
      toDo.set('Description', body);
      toDo.set('Done', false);
      toDo.set('DueDate',today )
      toDo.save(null, {
        success: function(toDo) {
          // Execute any logic that should take place after the object is saved.
          console.log('New object created with objectId: ' + toDo.id);
        },
        error: function(toDo, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          console.log('Failed to create new object, with error code: ' + error.message);
        }
      });
    });

    res.end();
  }
}