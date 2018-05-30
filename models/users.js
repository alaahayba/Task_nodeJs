var mongoose = require("mongoose");
var phone =require ('phone');

// ORM Mapping ...
var Schema = mongoose.Schema;

const users = new Schema({
  first_name:String,
  last_name:String,
  countryCode:String,
  Phone_number:{
    type: Date,
    required: true ,
    unique: true,
  },
  gender:{type: String, enum:['male', 'female']},
  birthDate:{
    type: Date,
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

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validatePhone = function(phoneNum,countryCode) {
  //phone('6123-6123', 'HKG'); // return ['+85261236123', 'HKG']
    //validate Phone according to country-Code  //phone('6123-6123', ''); // return [], as default country is USA
    console.log(phoneNum,countryCode);
    var res=phone(phoneNum,users.countryCode)
    console.log("ooooooooooooooooooooooooooooooooooooo")
    console.log(res);
    return res.length;
};

var validateDate = function(birthDate) {
  var re = /\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
  return re.test(birthDate)
};
//*************************************************************************//

UsersModel.isValidData=(data)=>{

  let response={case:true,error:""}
  console.log(data)
  if(!validateEmail(data.email))
  {
    response={case:false,error:response.error+"email isn't valid,"}
  }
  if(!validatePhone(data.Phone_number,data.countryCode))
  {
    response={case:false,error:response.error+"phone number isn't valid,"}
  }
  if(!validateDate(data.birthDate))
  {
    response={case:false,error:response.error+"birth date format isn't valid,it  must be yyyy-mm-dd"}
  }
    console.log(response)
 return response
}

//****************************************************************************//
UsersModel.register = (newUserAccount, callbackFn)=>{
    let user = new UsersModel.model(newUserAccount);
    user.save((err, doc)=>{
        callbackFn(err, doc);
    });
}

module.exports = UsersModel;
