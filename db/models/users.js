// Third Party packages
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Custom Packages
const dbutils = require("../utils");
const crypt = require("../../crypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: Buffer,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email id is required"],
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      unique: true,
      minlength: 10,
      length: 10,
      required: [true, "Mobile number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 7,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// convert user object to json
userSchema.methods.toJSON = function () {
  const user = this;
  user.email = crypt.StringDecrypt(user.email);
  user.mobile = crypt.StringDecrypt(user.mobile);
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject._id;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;

  return userObject;
};

// authenticate user by email id and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await dbutils.findOne(User, {
    email: crypt.StringEncrypt(email),
  });
  if (!user) {
    throw new Error("Invalid Credentials. Please try again.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials. Please try again.");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.displayName) {
    user.displayName = user.firstName + " " + user.lastName;
  }

  if (user.isModified("email")) {
    user.email = crypt.StringEncrypt(user.email);
  }

  if (user.isModified("mobile")) {
    user.mobile = crypt.StringEncrypt(user.mobile);
  }

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 6);
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
