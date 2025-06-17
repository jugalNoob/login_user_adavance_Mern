Advanced MongoDB Schema for Student/URL Management
Here's an enhanced version of your schema with several advanced features:

javascript
const mongoose = require("mongoose");
const shortid = require("shortid");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      index: true, // for faster queries
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator: function (value) {
          // Require at least one number and one letter
          return /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value);
        },
        message: "Password must contain at least one letter and one number",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    date: {
      type: Date,
      default: Date.now,
      immutable: true, // cannot be changed after creation
    },
    shortId: {
      type: String,
      unique: true,
      default: shortid.generate,
      index: true,
    },
    profile: {
      bio: {
        type: String,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
      avatar: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL for avatar"],
      },
      website: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
    },
    socialMedia: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    urls: [
      {
        originalUrl: {
          type: String,
          required: true,
          validate: [validator.isURL, "Please provide a valid URL"],
        },
        shortUrl: {
          type: String,
          unique: true,
          default: shortid.generate,
        },
        clicks: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        tags: [String],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property (not stored in DB)
studentSchema.virtual("fullProfile").get(function () {
  return `${this.name} (${this.email}) - ${this.profile.bio || "No bio"}`;
});

// Indexes for better performance
studentSchema.index({ name: "text", "profile.bio": "text" });

// Document middleware - runs before .save() and .create()
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after
  }
  next();
});

// Query middleware - filters out inactive users by default
studentSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Instance method - available on all documents
studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

studentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

studentSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

studentSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Static method - available on the model
studentSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+password");
};

const Register = mongoose.model("Url", studentSchema);
module.exports = Register;



Key Advanced Features Added:
Enhanced Validation:

Added email validation using validator.js

Stronger password requirements

URL validation for website/avatar fields

Security Features:

Password hashing with bcrypt

Password reset functionality

JWT token generation

Password change tracking

User Management:

Role-based access control

Active/inactive status

Login tracking

Performance Optimizations:

Indexes for frequently queried fields

Text indexes for search

URL Management:

Embedded URL documents with click tracking

Short URL generation

Virtual Properties:

Computed properties not stored in DB

Middleware:

Pre-save hooks for automatic operations

Query hooks for default filtering

Profile Management:

Social media links

Bio and avatar

Nested profile structure

To use this advanced schema, you'll need to install additional dependencies: