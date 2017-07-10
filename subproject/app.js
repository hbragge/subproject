var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    nano = require('nano')('http://192.168.33.10:5984')
    routes = require('./routes/index'),
    users = require('./routes/users');

nano.db.create('subproject');
var sp = nano.use('subproject');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    var _rows = [];
    sp.list( function(err, body) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.stringify(body.rows));

        body.rows.forEach(function(doc, index) {
            sp.get(doc.id, function(err, content) {
                console.log(JSON.stringify(content));
                _rows.push({
                    id: doc.id,
                    happy: content.happy ? 'ON' : 'OFF'
                });
                if (index === body.rows.length - 1){
                    console.log(_rows);
                    res.render("index", {rows: _rows});
                }
            });
        });
        console.log(_rows);
    });
});

app.get("/add", function(req, res) {
    console.log('step 0');
    var name = req.query.name
    var happy = req.query.happy === "on" ? true : false;
    sp.insert({ happy: happy }, name, function(err, body, header) {
        console.log('step 1');
        if (err) {
            console.log("ERROR:: insert ", err.message);
            return;
        }
        console.log("inserted rabbit " + name + " " + happy);
    });
});

app.listen(process.env.PORT, function(){
   console.log("subproject has started");
});
