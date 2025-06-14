


const { z } = require('zod');

const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" }) // Fixed 'required_errors' to 'required_error'
    .trim()
    .min(7, { message: "Name must be at least 3 characters" })
    .max(200, { message: "Name must be at most 200 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 3 characters" })
    .max(200, { message: "Email must be at most 200 characters" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }) // Password strength increased
    .max(200, { message: "Password must be at most 200 characters" }),

  date: z
    .string({ required_error: "Date is required" })
    .transform((value) => new Date(value)) // Converts string to Date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format", // Validates if the date is correct
    })
    .default(() => new Date().toISOString()), // Adds a default current date in ISO format


});

module.exports = signupSchema;




// const age=z.number().min(18).max(100).int()

// const userage=17

// const parserUser=age.parse(userage)

// console.log(parserUser)



// const Port=isNaN(process.env.PORT) ? 3000 : parseInt(process.env.POR);

// console.log(Port)






// const { z } = require('zod');

// const signupSchema = z.object({
//   name: z
//     .string({ required_error: "Name is required" }) // Fixed 'required_errors' to 'required_error'
//     .trim()
//     .min(3, { message: "Name must be at least 3 characters" })
//     .max(200, { message: "Name must be at most 200 characters" }),

//   email: z
//     .string({ required_error: "Email is required" })
//     .email({ message: "Invalid email address" })
//     .min(3, { message: "Email must be at least 3 characters" })
//     .max(200, { message: "Email must be at most 200 characters" }),

//   password: z
//     .string({ required_error: "Password is required" })
//     .min(8, { message: "Password must be at least 8 characters" }) // Password strength increased
//     .max(200, { message: "Password must be at most 200 characters" }),

//   date: z
//     .string({ required_error: "Date is required" })
//     .transform((value) => new Date(value)) // Converts string to Date
//     .refine((date) => !isNaN(date.getTime()), {
//       message: "Invalid date format", // Validates if the date is correct
//     })
//     .default(() => new Date().toISOString()), // Adds a default current date in ISO format

//   time: z
//     .string({ required_error: "Time is required" })
//     .refine((value) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value), {
//       message: "Invalid time format, must be HH:MM (24-hour format)",
//     })
//     .default(() => new Date().toISOString().slice(11, 16)) // Default to current time in HH:MM
// });

// module.exports = signupSchema;
