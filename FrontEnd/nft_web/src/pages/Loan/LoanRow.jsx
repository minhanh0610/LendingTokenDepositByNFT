import React, { useState, useEffect } from "react";
import "./loan.css";
import DoneIcon from "../../assets/icons/done.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
//import RefundedIcon from "../../assets/icons/refunded.svg";
import { MdOutlinePending } from "react-icons/md";
import { MdSell } from "react-icons/md";
import "../../styles/token.css";
import LoanCard from "../../components/ui/Token-card/LoanCard";
import LoanLiquidate from "../../components/ui/Token-card/LoanLiquidate";
import { getNft } from "../../depositNFT";
const { ethers } = require("ethers");

function LoanRow({ loan, index }) {
  
  let liquidate = false;
  if (Date.now() > loan.dueDate * 1000) liquidate = true;
  else liquidate = false;

  const [showModal, setShowModal] = useState(false);
  //const [liquidate, setLiquidate] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      const {title} = await getNft(loan.nft.address, loan.nft.tokenId);
      setName(title);
    }
    fetchData();
    // if (Date.now() > loan.dueDate * 1000) {
    //   setLiquidate(true);
    // }

  }, []);
  return (
    <>
      <tr key={index}>
        <td>
          <span>{name}</span>
        </td>
        <td>
          <span>
            {ethers.utils.formatUnits(loan.loanAmount, loan.token.decimal)}
          </span>
        </td>
        <td>
          <span>
            {ethers.utils.formatUnits(loan.payoffAmount, loan.token.decimal)}
          </span>
        </td>
        <td>
          <span>
            {new Date(loan.createdAt * 1000).toLocaleString().slice(0, 25)}
          </span>
        </td>
        <td>
          <span>{loan.loanDuration} days</span>
        </td>
        <td>
          <span>{loan.token.symbol}</span>
        </td>
        {/* <td>
          <span>
            {(
              (loan.token.interestRateNumerator /
                loan.token.interestRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </td> */}
        <td style={{display:"flex"}}>
          <div style={{display:"flex"}}>
            {loan.state === 2 && liquidate === false ? (
              <img
                src={DoneIcon}
                alt="paid-icon"
                className="dashboard-content-icon"
              />
            ) : loan.state  === 2 && liquidate === true ? (
              <>
                <MdSell
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
                {showModal && (
                  <LoanLiquidate setShowModal={setShowModal} loan={loan} name={name} />
                )}
              </>
            ) : loan.state === 1 ? (
              <img
                src={CancelIcon}
                alt="canceled-icon"
                className="dashboard-content-icon"
              />
            ) : loan.state === 0 ? (
              <>
                <MdOutlinePending
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
                {showModal && (
                  <LoanCard setShowModal={setShowModal} loan={loan} name={name}/>
                )}
              </>
            ) : null}
            <span>
              {loan.state === 1
                ? "Rejected"
                : loan.state === 0
                ? "Pending"
                : loan.state === 2 && liquidate == false
                ? "Accepted"
                : loan.state === 3
                ? "Paid off"
                : loan.state === 4
                ? "Paid Early"
                : loan.state === 5
                ? "Withdrawn"
                : loan.state === 2 && liquidate == true
                ? "Liquidated"
                : null}
            </span>
          </div>
        </td>
      </tr>
    </>
  );
}

export default LoanRow;
