const mongoose = require('mongoose'); 

const userSchema  = new mongoose.Schema({
    name : {
        type : Object ,
        require : "True"
    },
    gender : {
        type : String
    }, 
    location : {
        type : Object
    },
    email : {
        type : String
    },
    login : {
        type : Object
    },
    dob : {
        type : Object
    }, 
    registered : {
        type : Object
    },
    phone : {
        type : String
    },
    cell : {
        type : String
    },
    id : {
        type : Object
    },
    picture : {
        type : Object
    }

})

const Users = mongoose.model( "Users" , userSchema) ;
module.exports = Users