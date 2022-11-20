import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./loan.css";
import CommonSection from "../../components/ui/Common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import "../../styles/token.css";
import { useQuery } from "@apollo/client";
import { getLoans } from "../../graphql-client/queries";
import LoanRow from "./LoanRow";
import { useGlobalState, getGlobalState, setGlobalState } from "../../store";
import {loadWeb3} from "../../depositNFT";
function Loan() {
  loadWeb3();
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log(connectedAccount );
  if(connectedAccount == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){ setGlobalState("isAdmin", true);}
  else{ setGlobalState("isAdmin", false);}
  const isAdmin = getGlobalState("isAdmin");
  const { loading, error, data } = useQuery(getLoans, { pollInterval: 500 });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const loans = data?.loans;
  console.log(loans);

  const handleSort = () => {};
  if (isAdmin == false) return <Navigate to="/" />;
  return (
    <>
      <CommonSection title={"Loans List"} />
      <section>
        <Container>
          <div className="dashboard-content">
            <div className="dashboard-content-container">
              <table>
                <thead>
                  <th>NFT</th>
                  <th>Amount</th>
                  <th>Payoff Price</th>
                  <th>Created At</th>
                  <th>Duration</th>
                  <th>Token</th>
                  {/* <th>Interest Rate</th> */}
                  <th>Status</th>
                </thead>

                {loans.length !== 0 ? (
                  <tbody>
                    {loans.map((loan, index) => (
                      <LoanRow loan={loan} index={index} />
                    ))}
                  </tbody>
                ) : null}
              </table>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Loan;
