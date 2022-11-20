import React, { useState, useEffect } from "react";
import "./token-card.css";
import { extendLoan, calculateFee } from "../../../depositNFT";
import { getGlobalState } from "../../../store";
const { ethers } = require("ethers");

const LoanDetail = ({ setShowModal, item, data }) => {
  const duration = getGlobalState("duration");
  const [fee, setFee] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fee = await calculateFee(
        item.loanAmount,
        item.token.extendedRateNumerator,
        item.token.extendedRateDenominator
      );
      setFee(ethers.utils.formatUnits(fee, item.token.decimal));
      setDueDate(item.dueDate * 1000 + duration * 86400 * 1000);
    };
    fetchData();
  }, []);

  return (
    <div className="modal__wrapper">
      <div className="single__modal3">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">{data?.title}</h6>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Amount</p>
          <span className="money">
            {ethers.utils.formatUnits(item.loanAmount, item.token.decimal)}{" "}
            {item.token.symbol}
          </span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Payoff Amount</p>
          <span className="money">
            {ethers.utils.formatUnits(item.payoffAmount, item.token.decimal)}{" "}
            {item.token.symbol}
          </span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p> 
            {item.state == 0 || item.state == 1
              ? "Requested at"
              : "Expires"}
          </p>
          <span className="money">
            {item.state == 0 || item.state == 1
              ? new Date(item.createdAt * 1000).toLocaleString().slice(0, 25)
              : new Date(item.dueDate * 1000).toLocaleString().slice(0, 25)}
            {/* {new Date(item.dueDate * 1000).toLocaleString().slice(0, 25)} */}
          </span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>Duration</p>
          <span className="money">{duration} days</span>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
