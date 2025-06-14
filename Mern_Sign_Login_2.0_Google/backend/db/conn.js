const mongoose=require("mongoose")
require('dotenv').config();

// const DB = "mongodb+srv://jugal786:jugal786@cluster0.sgg8t.mongodb.net/ones?retryWrites=true&w=majority";
const DB = process.env.DATABASE; // Correct usage


(async () => {
  try {
    if (!DB) {
      throw new Error("Database URL not provided. Please set the DATAS environment variable.");
    }

    setTimeout(()=>{
     mongoose.connect(DB, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
          });
      
          console.log("Connected to the database");
    } , 3000)

  
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
})();