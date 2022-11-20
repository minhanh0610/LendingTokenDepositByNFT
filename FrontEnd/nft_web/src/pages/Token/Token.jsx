import React, { useState } from "react";
import { getGlobalState, setGlobalState, useGlobalState } from "../../store";
import "./token.css";
import CommonSection from "../../components/ui/Common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import "../../styles/token.css";
import { useQuery } from "@apollo/client";
import { getTokens } from "../../graphql-client/queries";
import TokenRow from "./TokenRow";
import TokenRate from "../../components/ui/Token-card/TokenRate";
import TokenDuration from "../../components/ui/Token-card/TokenDuration";
import {loadWeb3} from "../../depositNFT";
function Token() {
  //load
  loadWeb3();
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log(connectedAccount );
  if(connectedAccount == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){ setGlobalState("isAdmin", true);}
  else{ setGlobalState("isAdmin", false);}
  const isAdmin = getGlobalState("isAdmin");
  console.log({isAdmin});
  
  //load
  const [showModal, setShowModal] = useState(false);
  const [showDuration, setShowDuration] = useState(false);


  const { loading, error, data } = useQuery(getTokens, {
    pollInterval: 500
  });
  //console.log({data});
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const all_tokens = data.tokens;

  const handleSort = () => {};
  return (
    <>
      <CommonSection title={"Tokens List"} />
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                  {isAdmin ? (
                    <>
                    <button
                      onClick={() => {
                        setShowModal(true);
                       
                      }}
                    >
                      {" "}
                      Add Token
                    </button>
                    {showModal && <TokenRate  setShowModal={setShowModal} />}
                    </>
                    ) : null }
                  </div>
                  <div className="all__category__filter">
                  {isAdmin ? (
                    <>
                    <button
                      onClick={() => {
                        setShowDuration(true);
                       
                      }}
                    >
                      {" "}
                      Change duration
                    </button>
                    {showDuration && <TokenDuration  setShowModal={setShowDuration} />}
                    </>
                    ) : null }
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="dashboard-content">
            <div className="dashboard-content-container">
              <table>
                <thead>
                  <th>Token</th>
                  <th>Total Asset</th>
                  <th>Interest Rate</th>
                  <th>Extended Rate</th>
                  <th>Liquidate Early Rate</th>
                  {isAdmin ? (
                  <th>Setting</th>
                  ) : null }
                </thead>

                {data?.tokens.length ? (
                  <tbody>
                    {data?.tokens.map((token, index) => (
                      <TokenRow token={token} index={index} />
                    ))}
                  </tbody>
                ) : <> </>}
              </table>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Token;
