var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');

/* GET home page. */
router.post('/', function (req, res, next) {
    var url = req.body.url;
    var closed = false;
    console.log(url);
    if(!url) {
       return next();
    }
    var filename = null;
    const ls = spawn('/usr/local/bin/youtube-dl', ['-o', appRoot+'/public/videos/%(title)s.%(ext)s', '--sub-lang', 'en,zh-Hans', '--write-sub', '--write-auto-sub', url]);
    
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
	console.log(typeof(data));
        //let result = data.toString().match(/[download] (?:Destination: )?\/root\/myapp\/public\/videos\/(.+)/)
        let result = data.toString().match(/\[download\] (?:Destination: )?\/root\/myapp\/public\/videos\/(.+\.(?:mp3|mp4|flv|mpeg|mkv|webm|ogg|vob|gif|avi|mov|wmv|rm|rmvb|asf|m4p|mpv|mpg|m4v|))/)
        if(result && !closed) {
                closed = true;
		console.log('got: ', result[1]);
                filename = result[1];
                res.render('link', { fname: filename });
	}
    });
    
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.log('filename: ', filename);
        if(filename && !closed) {
           res.render('link', { fname: filename }); 
        } 
    });
    

});

module.exports = router;

