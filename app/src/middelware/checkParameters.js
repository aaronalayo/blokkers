module.exports = function checkParameter (parameter) {
    if (parameter == undefined){
        console.log('false');
        return false;
    }else {
        console.log('true')
        return parameter;  
    }
};