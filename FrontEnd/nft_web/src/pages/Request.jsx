import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import "../styles/create-item.css";
import { setGlobalState, useGlobalState, setAlert } from "../store";
import {requestLoan} from "../depositNFT"

const Request = () => {

  const [nft, setNft] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loan, setLoan] = useState("");
  const [duration, setDuration] = useState("");

  const handleCategory = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nft || !tokenId || !loan || !duration) return;

    try {
      const request = {nft, tokenId, loan, duration};
      console.log(request);
      requestLoan(request).then((res) => {
        if(res){
          console.log("res");
          resetForm()
          setAlert('Request successfully ', 'green')
          window.location.reload()
        }
        
      })
    } catch (error) {
      console.log('Error : ', error)
      setAlert("request loan failed ...", "red");
    }
  };
  const resetForm = () => {
    setNft('')
    setTokenId('')
    setLoan('')
    setDuration('')
  }

  return (
    <>
      <CommonSection title="Request Loan" />

      <section>
        <Container>
          <Row>
            <Col lg="9" md="8" sm="6" className="m-auto">
              <div className="create__item">
                <form>
                  <div className="form__input">
                    <label htmlFor="">NFT Address</label>
                    <input
                      name="nft"
                      type="text"
                      placeholder="Enter NFT Address"
                      onChange={(e) => setNft(e.target.value)}
                      value={nft}
                      required
                    />
                  </div>
                  <div className="form__input">
                    <label htmlFor="">Token ID</label>
                    <input
                      name="tokenId"
                      type="number"
                      placeholder="Enter token ID"
                      onChange={(e) => setTokenId(e.target.value)}
                      value={tokenId}
                      required
                    />
                  </div>
                  <div className=" d-flex align-items-center gap-4">
                    <div className="form__input w-50">
                      <label htmlFor="">Loan value</label>
                      <input
                        name="loan"
                        type="number"
                        placeholder="Enter value of loan"
                        onChange={(e) => setLoan(e.target.value)}
                        value={loan}
                        required
                      />
                    </div>

                    <div className="form__input w-25">
                      <label htmlFor="">Token</label>
                      <div>
                        <select onChange={handleCategory}>
                          <option value="ETH">ETH</option>
                          <option value="DAI">DAI</option>
                          <option value="BSC">BSC</option>
                        </select>
                      </div>
                    </div>
                    <div className="form__input w-25">
                      <label htmlFor="">Interest Rate</label>
                      <div>
                        <p>20%</p>
                      </div>
                    </div>
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Duration</label>
                    <input
                      name="duration"
                      type="number"
                      placeholder="Enter duration"
                      onChange={(e) => setDuration(e.target.value)}
                      value={duration}
                      required
                    />
                  </div>
                  <button
                    className="send__btn"
                    style={{
                      border: "none",
                      padding: "7px 25px",
                      borderRadius: "5px",
                      marginTop: "20px",
                    }}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Send a Request
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Request;
