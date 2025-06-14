const express=require('express')
const cookieParser = require('cookie-parser');
const cors=require('cors')
require('./db/conn')
require('dotenv').config();
const startServer = require('./Cluster/clust')
const rateLimit = require('express-rate-limit');
const session = require("express-session");
const  helmet=require("helmet")

const router = require('./routes/router');

const passport =require('./google/login')




// express convert to app()
const app=express()
// CORS Configuration --------------------<><><><><>
const corsOption = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true
};


app.use(express.json())
app.use(cors(corsOption));
app.use(router)
app.use(cookieParser());

app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded bodies



///all app.use 
const Port=process.env.PORT   // .env port number is 041


startServer(app, Port);  /// function loadbalance use for cluster management

// Google login your start row cclass 

const secsecret=process.env.sessionsecret;

app.use(session({
  secret:secsecret,
  resave:false,
  saveUninitialized:true
}))



// setuppassport
app.use(passport.initialize());
app.use(passport.session());



 



// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/google",
    failureRedirect:"http://localhost:3000/login"
}))


app.get("/users",async(req,res)=>{
console.log(req.user)
  
  if(req.user){
      res.status(200).json({message:"user Login",user:req.user})
  }else{
      res.status(400).json({message:"Not Authorized"})
  }
})


// Rate Limit Important  ----------------------------->>
// Define a rate limit rule
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,  // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: true, // Enable the `X-RateLimit-*` headers.
    statusCode:400, // Status code 
    message: {
      status: 429,
      message:  'Too many login attempts from this IP, please try again after 15 minutes',
      requestWasSuccessful: false
  }
  });
  

  app.use(limiter)


  app.use(helmet());




module.exports = app;



// app.listen(Port , ()=>{
//     console.log(`Server is running on port ${Port}`)
// })



// const express = require('express');
// const router = require('./routes/router');
// const startServer = require('./Cluster/clust');
// const morgan = require('morgan');
// const start=process.hrtime()




// const app = express();
// const port = 9000;

// app.use(router);


// app.use(morgan('combined'))  /// morgan for respones:: get information 

// startServer(app, port);  /// function loadbalance use for cluster management 
// const end=process.hrtime(start)

// const latencyInMs=end[0]*1000+end[1]/1e6;

// console.log(`Latency: ${latencyInMs} ms`)  //check if latency


// // Start the server using cluster management
// module.exports = app;


