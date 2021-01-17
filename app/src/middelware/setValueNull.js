//Check if values are empty set them to null
module.exports = function setValueToNull (parameter) {
  if(parameter == ''){ 
    parameter == null 
  }else{
    return parameter
  }
};