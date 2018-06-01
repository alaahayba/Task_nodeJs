const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const UsersModel = require("../models/users")
const bcrypt = require('bcrypt');
const fs = require('fs')
const fileUpload = require('express-fileupload');
const path = require('path');
const jwt = require("jsonwebtoken");
const config = require('./config');
const router = express.Router()
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
      Phone_number:request.body.phone_number,
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

//*********************************************** get token *******************************************//

router.post("/authToken",function(request,response){

   var phone_number=request.body.phone_number;
   var password=request.body.password;
   let error=[]
   if(!phone_number){
      error.push({"phone_number":"blank"});
   }
   if(!password){
      error.push({"password":"blank"});
   }

   if(error!=[]){
     UsersModel.getUserbyPhone(phone_number,password,function(err,data){
         if(!err&&data){
            let userData={//..payload
              email: data.email ,
              phone:data.Phone_number,
              name:data.first_name,
            }
           var token = jwt.sign(userData, config.secret, {
              expiresIn: 86400*30 // expires in month hours
             });

           response.json(token);
         }
         else
           response.json(err);
         });
   }
   else
     response.json(error);
});

//**************************** Authorizing with phone and token*****************************//

//is accessed by post request contains phone num (unique) and token
//I will verify the phone number that is in post req body with the one in payload

router.post("/accessProfile",function(request,response){
  var phone_number=request.body.phone_number;
  var auth_token=request.body.auth_token;

  if(!phone_number){
       response.status(401).json({"phone_number":"blank"});
  }
  else if(!auth_token){
    response.status(401).json({ auth: false, message: 'No token provided.' });
  }

  else{
    //.........verify token against phone num

    jwt.verify(auth_token, config.secret, function(err, decoded) {
    if (err)
      response.status(500).json({ auth: false, message: 'Failed to verify token.' });

    else if(decoded.phone==phone_number)
      response.status(200).json(decoded);

    else
      response.status(500).json({ auth: false, message: 'Failed to authenticate token with phone.' });
    });
 }

});

module.exports = router;
