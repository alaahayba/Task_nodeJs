const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const UsersModel = require("../models/users")
const bcrypt = require('bcrypt');
const fs = require('fs')
const fileUpload = require('express-fileupload');
const path = require('path');
var router = express.Router()
router.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

//************************************** Add new user *****************************//

router.post("/register",function(request,response)
{
  let checkValid=UsersModel.isValidData(request.body,request.files)
  if(JSON.stringify(checkValid.errors) != '{}'){
      response.json({"errors":checkValid.errors});
  }
  else { //data is valid then save it
    UsersModel.register({
      first_name:request.body.first_name,
      last_name:request.body.last_name,
      countryCode:request.body.countryCode,
      Phone_number:request.body.Phone_number,
      gender:request.body.gender,
      birthDate:request.body.birthDate,
      avatarPath:path.join("public","images",request.files.picture.md5),
      email:request.body.email,
      password:bcrypt.hashSync(request.body.password, 10)//10 saltRounds

    },function(err,doc){
    //................call back function that will executed after saving
    if(!err) {
      let dirPath=__dirname.replace('/controllers', '/public/images/');
      request.files.picture.mv(dirPath+request.files.picture.md5, function(err) {
         if (err)
           response.status(500).send(err);
        else{
          response.statusCode=201;
          let msg = {
              statusCode:response.statusCode,
              message: "new user account is added successfully",
              accountData: doc
            }
            response.json(msg);
          }
      });
    }

    else
        response.json("An error occure while saving new account in database error is "+ err);
    });

  }


});

module.exports = router;
