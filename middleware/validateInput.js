//https://stackoverflow.com/questions/16015548/tool-for-sending-multipart-form-data-request
var phone =require ('phone');
var validate={};

var validateEmailFormat= function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validatePhone_countrycode = function(phoneNum,countryCode) {
  //validate Phone according to country-Code
  //phone('6123-6123', 'HKG'); return ['+85261236123', 'HKG'] //phone('6123-6123', 'HKG');  return [], as default
    var res=phone(phoneNum,countryCode)
    if(res[1])
     return true;
    else
     return false;
};

var validateDateFormat = function(birthDate) {
  var re = /\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
  return re.test(birthDate)
};

var isFutureDate=function(idate){
var today = new Date().getTime(),
    idate = idate.split("-");
idate = new Date(idate[0], idate[1] - 1, idate[2]).getTime();
return (today - idate) < 0 ? true : false;
}

//****************************************************//

validate.validateDate=function(birthDate){
  errors=[];

  if(birthDate!=''){
    if(!validateDateFormat(birthDate))
      errors.push({"error": "invalid format ,must be yyyy-mm-dd" });
    else if(isFutureDate(birthDate))
      errors.push({"error": "in_the_future" });
  }
  else
    errors.push({"error": "blank" });

  return errors;
}
//***************************************************//

validate.validateEmail=function(email){
    errors=[];
    if(email&&email!=''){
       if(!validateEmailFormat(email)){
           errors.push({"error": "invalid" });
       }
    }
    else{
      errors.push({"error": "blank" });
    }
    return errors;
}

//*************************************************************************//

validate.validatePhone=function(phoneNum,countryCode){
  errors=[];
  if(phoneNum&&phoneNum!=''){
    if(isNaN(phoneNum))
       errors.push({ "error": "not_a_number" });
     if(phoneNum.toString().length<=10)
        errors.push({ "error": "too_short", "count": 10 })

    if(phoneNum.toString().length>15)
    errors.push({"error": "too_long", "count": 15 })

    if(!validatePhone_countrycode(phoneNum,countryCode)){
      errors.push({"error": "invalid" });
    }
  }
  else {
    errors.push({"error": "blank" });
  }
  return errors;
}
//************************************************************************//

validate.validateAvatar=function(files){
  errors=[]
  if(files.picture){
    let type=files.picture.mimetype;
   if(type.indexOf('jpg')==-1 &&type.indexOf('png')==-1&&type.indexOf('jpeg')==-1)
       errors.push({ "error": "invalid_content_type" });
  }
  else{
    errors.push({"error": "blank" });
  }
  return errors
}
module.exports=validate;
