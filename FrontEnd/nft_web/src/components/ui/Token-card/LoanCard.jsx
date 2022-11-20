import React, { useState, useEffect } from "react";
import "./token-card.css";
import { setAlert } from "../../../store";
import { takeALoan } from "../../../depositNFT";

const LoanCard = ({ setShowModal, loan, name }) => {
  const [state, setState] = useState(0);
  const [disable, setDisable] = useState(false);
  const handleAccept = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      takeALoan(loan.nft.address, loan.nft.tokenId, 2).then((res) => {
        setShowModal(false);
      });
    } catch (error) {
      console.log("Error : ", error);
      setAlert("Acception failed", "red");
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      takeALoan(loan.nft.address, loan.nft.tokenId, 1).then((res) => {
        setShowModal(false);
      });
    } catch (error) {
      console.log("Error : ", error);
      setAlert("Rejection failed", "red");
    }
  };
  return (
    <form>
      <div className="modal__wrapper">
        <div className="single__modal3">
          <span className="close__modal">
            <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
          </span>
          <h6 className="text-center text-light">
            Do you want to accept or reject {name} ?
          </h6>
          <div 
          // style={{ display: "flex" }}
          >
            <button
              disabled={disable}
              className="place__bid-btn"
              type="submit"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              disabled={disable}
              className="place__bid-btn1"
              type="submit"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default LoanCard;
