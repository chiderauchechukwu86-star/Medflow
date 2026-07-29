const mongoose = require("mongoose");

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    items: [lineItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["unpaid", "partially_paid", "paid", "void"], default: "unpaid" },
    paymentMethod: { type: String, enum: ["cash", "card", "insurance", "transfer", "other"] },
    issuedDate: { type: Date, default: Date.now },
    paidDate: { type: Date },
  },
  { timestamps: true }
);

billSchema.pre("save", function (next) {
  if (this.amountPaid >= this.totalAmount && this.totalAmount > 0) {
    this.status = "paid";
  } else if (this.amountPaid > 0) {
    this.status = "partially_paid";
  }
  next();
});

module.exports = mongoose.model("Bill", billSchema);
