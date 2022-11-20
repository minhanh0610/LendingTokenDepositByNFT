const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Loans = new Schema({
  loanId: {
    type: String,
  },
  name: {
    type: String,
  },
  borrower: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  duration: {
    type: String,
  },
  state: {
    type: Number,
  },
  inform: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Boolean,
    default: false,
  },
  liquidate: {
    type: Boolean,
    default: false,
  },
});
//const Loan = mongoose.model('Loans', Loans);

module.exports = mongoose.model("loan", Loans, "Loans");
