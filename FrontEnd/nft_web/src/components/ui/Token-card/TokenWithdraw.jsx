import React, { useState, useEffect } from "react";
import "./token-card.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { withdraw } from "../../../depositNFT";
const { ethers } = require("ethers");

const TokenWithdraw = ({ setShowModal, token }) => {
  const [tokens, setTokens] = useState(token);
  const regExp = /^[0-9]*(\.[0-9]{0,8})?$/;
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setTokens(tokens);
  }, []);
  const formik = useFormik({
    initialValues: {
      amount: " ",
    },
    validationSchema: Yup.object({
      amount: Yup.string()
        .required("required field")
        .matches(
          regExp,
          "Number must have exactly eight decimal places or less"
        ),
    }),
    onSubmit: (values) => {
      setDisable(true)
      //console.log(ethers.utils.parseUnits(values.amount, token.decimal));
      withdraw(tokens.id, ethers.utils.parseUnits(values.amount, token.decimal)).then((res) => {
        if (res) {
          setShowModal(false);
        }
      });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="modal__wrapper">
        <div className="single__modal1">
          <span className="close__modal">
            <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
          </span>
          <h6 className="text-center text-light">
            Withdraw Token {tokens.symbol}
          </h6>
          <div className="input__item mb-3">
            <h6>Amount</h6>
            <input
              id="amount"
              name="amount"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.interest_rate}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div>{formik.errors.amount}</div>
            ) : null}
          </div>
          <button disabled={disable} className="place__bid-btn" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};
export default TokenWithdraw;
