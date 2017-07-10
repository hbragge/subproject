var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    nano = require('nano')('http://192.168.33.10:5984')
    routes = require('./routes/index'),
    users = require('./routes/users');

nano.db.create('subproject')
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("index");
});

app.listen(process.env.PORT, function(){
   console.log("subproject has started");
});
