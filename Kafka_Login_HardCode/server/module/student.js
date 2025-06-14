
const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, unique: true },
   price:{type:Number , required: true},
   age:{type:Number , required: true},
   birthDate:{type:Date, required: true},
   bloodGroup:{type:String, required: true},
   email:{type:String, required: true},
   hobbies:{   type: [String], required: true},
   country:{type:String, required: true},
   bio:{type:String, required: true},

   gender:{type:String, required: true},
  date: {type: Date, default: Date.now ,required: true// Default value for date required: true
      },
});



const Register = new mongoose.model("Means", userSchema)
    // Error handler function
  module.exports = Register;