import React, { useState, useEffect } from "react";
import "./token.css";
import "../../styles/token.css";
import { getGlobalState } from "../../store";
import { AiFillSetting } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import TokenCard from "../../components/ui/Token-card/TokenCard";
import TokenDeposit from "../../components/ui/Token-card/TokenDeposit";
import TokenWithdraw from "../../components/ui/Token-card/TokenWithdraw";
import {getToken, loadWeb3} from "../../depositNFT";
function TokenRow({ token, index }) {
  loadWeb3();
  const [showToken, setShowToken] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  //const [tokens, setTokens] = useState(token);
  const [balance, setBalance] = useState("");
  const isAdmin = getGlobalState("isAdmin");
  useEffect(() => {
    loadWeb3();
    const fetchData = async() => {
      const balance = await getToken(token.id, token.decimal);
      // console.log("balance1 :", balance);
      setBalance(balance);
    }
    fetchData()
    //setTokens(tokens);
  },[]
)

  return (
    <>
      <tr key={index}>
        <td>
          <span>{token.symbol}</span>
        </td>
        <td>
          <span>{balance} {token.symbol}</span>
        </td>
        <td>
          <span>
            {(
              (token.interestRateNumerator / token.interestRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </td>
        <td>
          <span>
            {(
              (token.extendedRateNumerator / token.extendedRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </td>
        <td>
          <span>
            {(
              (token.earlyRateNumerator / token.earlyRateDenominator) *
              100
            ).toFixed(2)}
            %
          </span>
        </td>
        {isAdmin ? (
        <td style={{display: "flex"}}>
          <AiFillSetting
            className="icons"
            onClick={() => {
              setShowToken(true);
            }}
          />
          {showToken && (
            <TokenCard
              setShowModal={setShowToken}
              token={token}
              index={index}
            />
          )}
          <GiReceiveMoney
            className="icons"
            onClick={() => {
              setShowDeposit(true);
            }}
          />
          {showDeposit && (
            <TokenDeposit setShowModal={setShowDeposit} token={token} />
          )}
          <GiPayMoney
            className="icons"
            onClick={() => {
              setShowWithdraw(true);
            }}
          />
          {showWithdraw && (
            <TokenWithdraw setShowModal={setShowWithdraw} token={token} />
          )}
        </td>
        ) : null }
      </tr>
    </>
  );
}

export default TokenRow;
