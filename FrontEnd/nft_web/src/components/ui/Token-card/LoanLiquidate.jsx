import React, { useState, useEffect } from "react";
import "./token-card.css";
import { setAlert } from "../../../store";
import { liquidate } from "../../../depositNFT";
import { namehash } from "ethers/lib/utils";

const LoanLiquidate = ({ setShowModal, loan, name }) => {
  const [state, setState] = useState(0);
  const [disable, setDisable] = useState(false);
  const handleLiquidate = async (e) => {
    setDisable(true);
    e.preventDefault();
    try {
      liquidate(loan.nft.address, loan.nft.tokenId).then((res) => {
        setShowModal(false);
      });
    } catch (error) {
      console.log("Error : ", error);
      setAlert("Acception failed", "red");
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
            Do you want withdraw NFT {name}
          </h6>
          <button
            disabled={disable}
            className="place__bid-btn"
            type="submit"
            onClick={handleLiquidate}
          >
            Withdraw
          </button>
        </div>
      </div>
    </form>
  );
};
export default LoanLiquidate;
