import React, { useState, useEffect } from "react";
import "./token-card.css";
import { repayLoan, repaiedEarly, calculateFee, calculateTotal } from "../../../depositNFT";
import { getGlobalState } from "../../../store";
const { ethers } = require("ethers");

const LoanRepay = ({ setShowModal, item }) => {
  const [early, setEarly] = useState(false);
  const [fee, setFee] = useState("");
  const [total, setTotal] = useState(0);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const feeRepay = await calculateFee(
        item.loanAmount,
        item.token.earlyRateNumerator,
        item.token.earlyRateDenominator
      );
      setFee(ethers.utils.formatUnits(feeRepay, item.token.decimal));
      const total = await calculateTotal(
        item.loanAmount,
        item.token.earlyRateNumerator,
        item.token.earlyRateDenominator
      );
      setTotal(ethers.utils.formatUnits(total, item.token.decimal));

      if (Date.now() < item.dueDate * 1000 - 1 * 86400 * 1000) {
        setEarly(true);
      }
    };
    fetchData();
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true)
    try {
      repayLoan(
        item.token.id,
        item.nft.address,
        item.nft.tokenId,
        item.payoffAmount
      ).then((res) => {
        setShowModal(false);
      });
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const handleSubmitEarly = async (e) => {
    e.preventDefault();
    try {
      repaiedEarly(
        item.token.id,
        item.nft.address,
        item.nft.tokenId,
        ethers.utils.parseUnits(total, item.token.decimal)
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
        <h6 className="text-center text-light">
          {early ? "Early " : ""}
          Repayment
        </h6>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Loan Amount</p>
          <span className="money">
            {ethers.utils.formatUnits(item.loanAmount, item.token.decimal)}{" "}
            {item.token.symbol}
          </span>
        </div>

        {/* <div className=" d-flex align-items-center justify-content-between">
          <p>Interest Fee</p>
          <span className="money">
            {(
              (item.token.interestRateNumerator /
                item.token.interestRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </div> */}

        <div className=" d-flex align-items-center justify-content-between">
          <p>Payoff Amount</p>
          <span className="money">
            {ethers.utils.formatUnits(item.payoffAmount, item.token.decimal)}{" "}
            {item.token.symbol}
          </span>
        </div>
        {early ? (
          <>
            <div className=" d-flex align-items-center justify-content-between">
              <p>Extended Fee</p>
              <span className="money">
                {(
                  (item.token.earlyRateNumerator /
                    item.token.earlyRateDenominator) *
                  100
                ).toFixed(2)}
                %
              </span>
            </div>
            <div className=" d-flex align-items-center justify-content-between">
              <p>Extended Amount</p>
              <span className="money">
                {fee} {item.token.symbol}
              </span>
            </div>
            <div className=" d-flex align-items-center justify-content-between">
              <p>Total</p>
              <span className="money">
                {total} {item.token.symbol}
              </span>
            </div>
            
            <button className="place__bid-btn" onClick={handleSubmitEarly}>
              Payoff Early
            </button>
          </>
        ) : (
          <button disabled={disable} className="place__bid-btn" onClick={handleSubmit}>
            Pay off
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanRepay;
