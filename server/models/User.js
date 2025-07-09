import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    e_sewaNumber: {
      type: String,
      required: [true, "Please enter your E-Sewa number"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    monthlyTarget: {
      type: Number,
      default: 1000,
    },
    currentMonthDeposit: {
      type: Number,
      default: 0,
    },
    lastDepositDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
