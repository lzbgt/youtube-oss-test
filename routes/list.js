var express = require('express');
var router = express.Router();
const fs = require('fs');
const { spawn } = require('child_process');

/* GET home page. */
router.get('/', function (req, res, next) {
  var files = [];
  fs.readdir(appRoot+'/public/videos/', function(err, items) {
    for (var i=0; i<items.length; i++) {
        if(/.*(?:mp4|mpg|ogg|webm|wmv|avi)$/.test(items[i]))
              files.push(items[i]);
    }
    
    res.render('list', { files: files});  
  });        

});

module.exports = router;

