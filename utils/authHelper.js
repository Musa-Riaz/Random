const bcrypt = require('bcryptjs');

exports.hashPassword = async (password)=>{

    try{
        const saltRounds = 10;
        const hasedPassword = await bcrypt.hash(password, saltRounds);
        return hasedPassword;
    }catch(err){
        console.log(err);
    }
}

exports.comparePassword = async (password, hashedPassword)=>{
    try{
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    }catch(err){
        console.log(err);
    }
}