var mongoose = require("mongoose");
const fetch = require("cross-fetch");
const fs = require("fs");
const { date } = require("yup");

mongoose.connect("mongodb://localhost:27017/nft", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

//schema : loans
var schema = mongoose.Schema({
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

var Loan = mongoose.model("loan", schema, "Loans");

async function saveData(data) {
  try {
    let result = await Loan.findOne({ loanId: data.id });
    console.log(result);
    if (result) {
      if (data.dueDate != null) {
        if (Date.now() >= data.dueDate * 1000) result.liquidate = true;
        else if (Date.now() >= data.dueDate * 1000 - 2 * 86400 * 1000) {
          result.inform = true;
        }
        else if (Date.now() < data.dueDate * 1000 - 2 * 86400 * 1000){
          result.inform = false;
        }
        result.dueDate = data.dueDate;
        result.state = data.state;
        await result.save();
      }
      return;
    }
    console.log(data);
    let loan = new Loan({
      loanId: data.id,
      borrower: data.borrower.id,
      dueDate: data.dueDate,
      state: data.state,
      duration: data.loanDuration,
    });
    await loan.save();
    console.log("success");
  } catch (error) {
    console.log(error);
  }
}

async function getLoans() {
  let results = await fetch("http://127.0.0.1:8000/subgraphs/name/example", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `{
            loans {
                id
                createdAt
                dueDate
                state
                loanDuration
                borrower {
                  id
                }
              }
        }`,
    }),
  });
  let loans = await results.json();
  loans = loans.data.loans;
  for (const item of loans) {
    await saveData(item);
  }
}
function stop() {
  process.exit();
}
async function write() {
  const content =
    "schedule at1: " + new Date(Date.now()).toLocaleString() + "\n";
  fs.appendFile(
    "/home/minhanh/smartOsc/Le-minh-anh/SumUp/FrontEnd/nft_web/app/check.txt",
    content,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
      stop();
    }
  );
}

getLoans().then(() => {
  write();
});
