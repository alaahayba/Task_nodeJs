var express = require("express");
var server = express();
var fs = require("fs");
var path = require('path');
var mongoose = require("mongoose")
// var requestChecker  =  require('./middleWare/AuthMiddleWare.js')


server.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});

mongoose.connect("mongodb://localhost:27017/cognitev");


fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
    require('./models/'+filename);
});

// server.use(requestChecker)
var contactRouter = require("./controllers/users");
server.use("/users",contactRouter);


server.listen(9000,function(){
  console.log("Server is listening in port 9000 ");
});
