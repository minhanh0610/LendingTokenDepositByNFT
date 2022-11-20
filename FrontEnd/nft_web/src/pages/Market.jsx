import React, { useState } from "react";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import { Container, Row, Col } from "reactstrap";
import "../styles/market.css";
import { useQuery } from "@apollo/client";
import { getLoans } from "../graphql-client/queries";
import {loadWeb3} from "../depositNFT";
import { getGlobalState, setGlobalState, useGlobalState} from "../store";

const Market = () => {
  loadWeb3();
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log(connectedAccount );
  if(connectedAccount == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){ setGlobalState("isAdmin", true);}
  else{ setGlobalState("isAdmin", false);}
  const isAdmin = getGlobalState("isAdmin");

  const { loading, error, data } = useQuery(getLoans, {pollInterval: 500});
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const loans = data.loans;

  const handleCategory = () => {};

  const handleItems = () => {};

  const handleSort = () => {};

  return (
    <>
      <CommonSection title={"MarketPlace"} />

      <section>
        <Container>
          <Row>
            {/* <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>Search </option>
                      <option value="nft">My Request</option>
                    </select>
                  </div>
                </div>

              </div>
            </Col> */}

            {loans?.map((item,index) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Market;
