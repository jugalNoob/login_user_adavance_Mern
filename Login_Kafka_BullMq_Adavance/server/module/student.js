// const mongoose = require('mongoose');
// const shortid = require('shortid'); // Import shortid library
// const jobSchema = new mongoose.Schema({

//     name: { type: String },
//     email: { type: String, unique: true },
//     password: { type: String },
//     createdAt: { type: Date, default: Date.now },
//     shortId: { type: String, unique: true }, // Ensure shortId is unique
 
// });

// const Register = mongoose.model("Url", jobSchema);

// module.exports = Register;





const mongoose = require("mongoose");
require('dotenv').config();
const shortid = require('shortid'); // Import shortid library
const keysecret = "khjjhuhuidsuiuiojfsioujiojfuvuiojfvjiofvdoiujfvdoiujvfoijvf"
var bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken")
const argon2 = require('argon2');
// Define the student schema
const studentSchema = new mongoose.Schema({
    name: { type: String  ,required:true},
    email: { type: String , required:true , unique:true}, //unique email address
    password: { type: String, required:true},
    date: { type: Date, default: Date.now }, // Default date time
    shortId: { type: String, unique: true }, // Ensure shortId is unique

     role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
    tokens:[
        {
            token:{
                type:String
            },
        }
    ],
 
 sessions: [
    {
      token: { type: String, required: true },
      ip: String,
      userAgent: String,
      deviceInfo: String,
      location: String,
      createdAt: { type: Date, default: Date.now },
      expiresAt: Date
    }
  ],
      address: [
        {
            add: { type: String }
        }
    ],

 
});






//You can generate and track a session like this:

studentSchema.methods.generateSessionToken = async function (req) {
  const jwt = require("jsonwebtoken");
  const geoip = require("geoip-lite");

  const token = jwt.sign({ userID: this._id.toString(), email: this.email }, keysecret, {
    expiresIn: "90m"
  });

  // Extract user context
  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  if (ip === "::1") ip = "103.27.9.41"; // mock for local
  else if (ip?.startsWith("::ffff:")) ip = ip.split("::ffff:")[1];

  const userAgent = req.headers["user-agent"] || "Unknown";
  const location = geoip.lookup(ip)?.city + ", " + geoip.lookup(ip)?.country;

  this.sessions.push({
    token,
    ip,
    userAgent,
    location,
    expiresAt: new Date(Date.now() + 90 * 60 * 1000)
  });

  await this.save();
  return token;
};

// ----> User Important ass IN sigup importantion  --------------------->>

studentSchema.methods.generateUserInfomration = async function (href, ip, hostname, pathname, protocol, connection, host, secChUaPlatform, acceptLanguage, secChUa) {
    const token = {
        href,
        'IP Address': ip,
        Host: hostname,
        Pathname: pathname,
        Protocol: protocol,
        Connection: connection,
        'Host Header': host,
        'Sec-CH-UA-Platform': secChUaPlatform,
        'Accept-Language': acceptLanguage,
        'Sec-CH-UA': secChUa
    }; // Example token, this should be generated securely
    this.address.push({ add: JSON.stringify(token) });
    await this.save();
    return token;
};









/// ------------------------ Jwt SignJwT Token  ----------------->>



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2ODUxNTI1NTQ5NDlkM2VmMjcxOWQzNWIiLCJlbWFpbCI6InJpbGVsODE5NjZAbGluYWNpdC5jb20iLCJpYXQiOjE3NTAxNTk5NjcsImV4cCI6MTc1MDE3MDc2N30.h9-167EUzvz_CS-gGI8Fo7Zhqt78pDan3EyxNWHCsXQ


studentSchema.methods.generateAuthtokens = async function () {
  try {
    const token23 = jwt.sign(
      {
        userID: this._id.toString(),
        email: this.email,
      },
      keysecret,
      { expiresIn: "3h" }
    );

    this.tokens = [{ token: token23 }]; // ✅ Replace old tokens
    await this.save();
    return token23;
  } catch (error) {
    throw new Error("Token generation failed: " + error.message);
  }
};


/// Create cryptography 

studentSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password")) {
        this.password = await argon2.hash(this.password)
      }
  
      next();
    } catch (error) {
      throw new Error(error);
    }
  });











// Create and export the student model
const Register  = mongoose.model("Url", studentSchema);
module.exports = Register ;


//Simple token generation ----->><>>
// studentSchema.methods.generateAuthToken = async function () {
//     let token = "453564456456"; // Example token, this should be generated securely
//     this.address.push({ add: token });
//     await this.save();
//     return token;
// };


///JSON web Token authentication




// studentSchema.methods.generateAuthToken = async function (href, ip, hostname, pathname, protocol, connection, host, secChUaPlatform, acceptLanguage, secChUa) {
//     const token = {
//         href,
//         'IP Address': ip,
//         Host: hostname,
//         Pathname: pathname,
//         Protocol: protocol,
//         Connection: connection,
//         'Host Header': host,
//         'Sec-CH-UA-Platform': secChUaPlatform,
//         'Accept-Language': acceptLanguage,
//         'Sec-CH-UA': secChUa
//     }; // Example token, this should be generated securely
//     this.address.push({ add: JSON.stringify(token) });
//     await this.save();
//     return token;
// };
