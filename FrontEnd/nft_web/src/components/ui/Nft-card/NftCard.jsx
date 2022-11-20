import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./nft-card.css";
import Modal from "../Modal/Modal";
import LoanRepay from "../Token-card/LoanRepay";
import LoanExtend from "../Token-card/LoanExtend";
import { getNft, loadWeb3 } from "../../../depositNFT";
import { getGlobalState, setGlobalState, useGlobalState} from "../../../store";
import LoanDetail from "../Token-card/LoanDetail";
const { ethers } = require("ethers");

const NftCard = ({item}) => {
  loadWeb3();
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log(connectedAccount );
  if(connectedAccount == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){ setGlobalState("isAdmin", true);}
  else{ setGlobalState("isAdmin", false);}
  const isAdmin = getGlobalState("isAdmin");
  // let isOwner = false;
  // if(connectedAccount == item.borrower.id) isOwner = true;
  // else isOwner = false
  // console.log(item.borrower.id);
  // console.log({connectedAccount});
  // console.log({isOwner});
  const [liquidate, setLiquidate] = useState(false);
  const [showRepay, setShowRepay] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState({
    title: "",
    imgUrl: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      const {title, imgUrl} = await getNft(item.nft.address, item.nft.tokenId);
      console.log({title, imgUrl}); 
      setData({title, imgUrl});
      const account = getGlobalState("connectedAccount");
      if(account.toUpperCase() == item.borrower.id.toUpperCase()){
        setOwner(true);
      }
      if (Date.now() > item.dueDate * 1000 ) {
        setLiquidate(true);
      }
    }
    fetchData();
 
  }, [])
  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={data?.imgUrl} alt="" className="w-100" />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          {/* <Link to={"/detail"}>{data?.title}</Link> */}
          <span onClick={() => setShowDetail(true)}>{data?.title}</span>
          {showDetail && <LoanDetail setShowModal={setShowDetail} item={item} data={data} />}
        </h5>
        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              {item.state == 0 ? (
                <>
              <h6>Request At</h6>
              <p>{new Date(item.createdAt * 1000)
              .toLocaleString()
              .slice(0, 20)}</p>
              </>
              ) : (
                <>
              <h6>Expires</h6>
              <p>{new Date(item.dueDate * 1000)
              .toLocaleString()
              .slice(0, 20)}</p>
              </>
              )}
            </div>

            <div>
              <h6>Payoff Price</h6>
              <p>{ethers.utils.formatUnits(item.payoffAmount, item.token.decimal)} {item.token.symbol}</p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
        { owner && (item.state == 2) && liquidate==false ? (
          <>
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowRepay(true)}
          >
            <i className="ri-shopping-bag-line"></i> Payoff
          </button>
          {showRepay && <LoanRepay setShowModal={setShowRepay} item={item} />}

          <button
            className="bid__btn1 d-flex align-items-center gap-1"
            onClick={() => setShowExtend(true)}
          >
            <i className="ri-shopping-bag-line"></i>  Extend
          </button>
          {showExtend && <LoanExtend setShowModal={setShowExtend} item={item} />}
          </>
          ) : (owner && (item.state == 2) && liquidate==true) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Liquidate
          </button>
          ) : (item.state == 0) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Waiting
          </button>
          ) : (item.state == 1) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Rejected
          </button>
          ) : ( owner == false && item.state == 2) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  {(liquidate ? "Liquidate" : "Active")}
          </button>
          ) : (item.state == 3) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Repaied
          </button>
          ) : (item.state == 4) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Repaied Early
          </button>
          ) : (item.state == 5) ? (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Withdrawn
          </button>
          ) : (
            <button
            className="bid__btn2 d-flex align-items-center gap-1"
          >
            <i className="ri-shopping-bag-line"></i>  Not owner
          </button>
            ) }
        </div>
      </div>
    </div>
  );
};

export default NftCard;
