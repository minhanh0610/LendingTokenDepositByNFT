import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "./hero-section.css";
import heroImg from "../../assets/images/hero.jpg";
import RequestLoan from "./Token-card/RequestLoan";
import { getGlobalState } from "../../store";

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <section className="hero__section">
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="hero__content">
              <h2>
              Use your NFTs as <span>collateral</span> to borrow Token
                {/* Discover rare digital art and collect
                <span>sell extraordinary</span> NFTs */}
              </h2>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Deleniti excepturi omnis neque adipisci sequi ullam unde in
                minus quis quos.
              </p>

              <div className="hero__btns d-flex align-items-center gap-4">
                <button className=" explore__btn d-flex align-items-center gap-2">
                  <i class="ri-rocket-line"></i>{" "}
                  <Link to="/market">Explore</Link>
                </button>
               
                <button
                  className=" create__btn d-flex align-items-center gap-2"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <i class="ri-ball-pen-line"></i>
                  <Link to="/">Request Loan</Link>
                </button>
                {showModal && <RequestLoan setShowModal={setShowModal} />}
      
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="hero__img">
              <img src={heroImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
