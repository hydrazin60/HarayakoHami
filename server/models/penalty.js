import mongoose from "mongoose";
const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  details: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Penalty = mongoose.model("Penalty", AdminLogSchema);
export default Penalty;