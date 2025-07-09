const MonthlyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String, // format: "2025-07"
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    missedDays: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: true,
    },
    penaltyCarryOver: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MonthlyReport = mongoose.model("MonthlyReport", MonthlyReportSchema);
export default MonthlyReport;
