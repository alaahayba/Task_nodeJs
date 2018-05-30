var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var UsersModel = require("../models/users")
var bcrypt = require('bcrypt');

var router = express.Router()

//************************************** Add new user *****************************//


router.post("/register",bodyParser.json(),function(request,response)
{
  let checkValid=UsersModel.isValidData(request.body)
  if(checkValid.error){
      response.json(checkValid);
  }
  else { //data is valid then save it
    UsersModel.register({
      first_name:request.body.first_name,
      last_name:request.body.last_name,
      countryCode:request.body.countryCode,
      Phone_number:request.body.Phone_number,
      gender:request.body.gender,
      birthDate:request.body.birthDate,
      // avatarPath:request.body.avatarPath,
      email:request.body.email,
      password:bcrypt.hashSync(request.body.password, 10)//10 saltRounds


    },function(err,doc){ //call back function that will executed after saving

    if(!err)
    {
      let msg = {
          statusCode: response.statusCode,
          message: "new user account is added successfully",
          accountData: doc
        }
        response.json(msg);
    }
    else
        response.json("An error occure while saving new account in database error is "+ err);
    });

  }


});

module.exports = router;
