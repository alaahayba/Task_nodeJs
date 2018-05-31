var mongoose = require("mongoose");
var lookup = require('country-code-lookup');
var validate=require("../middleware/validateInput.js")
// var DateOnly = require('mongoose-dateonly')(mongoose);

// ORM Mapping ...
var Schema = mongoose.Schema;

const users = new Schema({
  first_name:String,
  last_name:String,
  countryCode:String,
  Phone_number:{
    type: String,
    required: true,
    unique: true,
  },
  gender:{type: String, enum:['male', 'female']},
  birthDate:{
    type: String,
    required: true,
     },

  avatarPath:String,
  email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },

  password:String
});

// Register ...
mongoose.model("users",users);
// Mongoose Hooks ...

let UsersModel = {}
UsersModel.model = mongoose.model("users");

//***************************************************************//

UsersModel.isValidData=(data,files)=>{
  let response={errors:{}}

  if(!data.first_name||data.first_name=='')
     response.errors.first_name=[{"error": "blank" }];

  if(!data.last_name||data.last_name=='')
     response.errors.last_name=[{"error": "blank" }];

  if(!data.password||data.password=='')
    response.errors.password=[{"error": "blank" }];

  if(['female','male'].indexOf(data.gender)< 0)
     response.errors.gender=[{"error": "inclusion" }];

  if((errors=validate.validateEmail(data.email))&&errors.length){
    response.errors.email=errors;
  }
  if(data.countryCode && !lookup.byInternet(data.countryCode)){
    response.errors.countryCode=[ { "error": "inclusion" } ];
  }
  else if(!data.countryCode){
      response.errors.countryCode=[ { "error": "blank" } ];
  }
  if((errors=validate.validatePhone(data.Phone_number,data.countryCode))&&errors.length){
      response.errors.phone_number=errors;
  }
  if((errors=validate.validateDate(data.birthDate))&&errors.length){
    response.errors.birthDate=errors;
  }
  if((errors=validate.validateAvatar(files))&&errors.length){
    response.errors.avatar=errors;
  }

 return response
}

//****************************************************************************//

UsersModel.register = (newUserAccount, callbackFn)=>{
    let user = new UsersModel.model(newUserAccount);
    user.save((err, doc)=>{
        callbackFn(err, doc);
    });
}

UsersModel.getUserbyEmail = (email, callbackFn)=>{
    UsersModel.model.find({email:email},(err,doc)=>{
        callbackFn(err, doc);
      });
}

module.exports = UsersModel;
