
const express = require('express')
const app = express()
var path    = require("path");
var fs = require('fs');
// app.set('view engine', 'jade');
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
var AV = require('./crawler/av/module_detail');


app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public/components'));
app.use('/', express.static(__dirname + '/public/fonts'));
app.use('/', express.static(__dirname + '/public/images'));
app.use('/', express.static(__dirname + '/public/scripts'));
app.use('/', express.static(__dirname + '/public/styles'));
app.use('/', express.static(__dirname + '/public/views'));

app.get('/',function(req,res){
    res.render('home.html');
    //__dirname : It will resolve to your project folder.
});

var usersFilePath = path.join(__dirname, '/av/cars_model_id.json');

app.get('/brendCard', function (req, res) {
    var readable = fs.createReadStream(usersFilePath);
    readable.pipe(res);
})

app.get('/api/crawlersParams', function (req, res) {
    var p = AV.module_detail(req.query);
    console.log(AV.results_module());
    res.send(p);
})


app.listen(4000, function () {
    console.log('Example app listening on port 3000!')
})



// var ABW = require('./crawler/abw/index');
// var kufar = require('./crawler/kufar/index');
// var fs = require ('fs');


// AV();
// ABW();
// kufar();
