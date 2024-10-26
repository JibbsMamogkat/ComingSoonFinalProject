const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { 
    type : String,
    required : true
   },
  lastName: {  
    type : String,
    required : true
  },
  email: { 
    type : String,
    required : true,
    unique : true
  },
  phoneNumber: { 
    type : Number,
    required : true,
    unique : true
   },
  address: { 
    type : String,
    required : true
   },
  password: { 
    type : String,
    required : true
   }

} , {timestamps : true});


const User = mongoose.model('User', UserSchema);
/*
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'userBase' });
*/

module.exports = User;