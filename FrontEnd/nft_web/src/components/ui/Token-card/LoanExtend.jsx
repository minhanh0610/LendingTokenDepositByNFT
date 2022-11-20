import React, { useState, useEffect } from "react";
import "./token-card.css";
import { extendLoan, calculateFee } from "../../../depositNFT";
import { getGlobalState } from "../../../store";
const { ethers } = require("ethers");

const LoanExtend = ({setShowModal, item}) => {
  const duration = getGlobalState("duration");
  const [fee, setFee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [disable, setDisable] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true)
    try {
      extendLoan(
        item.nft.address,
        item.nft.tokenId,
        duration,
        item.loanAmount,
        item.token.id,
        item.token.extendedRateNumerator,
        item.token.extendedRateDenominator,
        item.token.decimal
      ).then((res) => {
        setShowModal(false);
      });
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  return (
    <div className="modal__wrapper">
      <div className="single__modal3">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">Extend a loan</h6>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Loan Amount</p>
          <span className="money">
            {ethers.utils.formatUnits(item.loanAmount, item.token.decimal)}{" "}
            {item.token.symbol}
          </span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Extended Fee</p>
          <span className="money">
            {(
              (item.token.extendedRateNumerator /
                item.token.extendedRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>Extended Amount</p>
          <span className="money">
            {fee}
           {" "}
            {item.token.symbol}
          </span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>Old Expires</p>
          <span className="money">
            {new Date(item.dueDate * 1000).toLocaleString().slice(0, 25)}
          </span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>Extend Duration</p>
          <span className="money">{duration} days</span>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>New Expires</p>
          <span className="money">
            {new Date(dueDate).toLocaleString().slice(0, 25)}
          </span>
        </div>
        <button disabled={disable} className="place__bid-btn" onClick={handleSubmit}>
          Extend
        </button>
      </div>
    </div>
  );
};

export default LoanExtend;
