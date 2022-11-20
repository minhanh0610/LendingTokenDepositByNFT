import React, { useState, useEffect } from "react";
import "./token-card.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateToken } from "../../../depositNFT";

const TokenCard = ({ setShowModal, token }) => {
  const [tokens, setTokens] = useState(token);
  const [disable, setDisable] = useState(false);
  const regExp = /^[0-9]{0,2}(\.[0-9]{0,2})?$/;

  useEffect(() => {
    setTokens(tokens);
  }, tokens);

  const formik = useFormik({
    initialValues: {
      interest_rate: (
        (tokens.interestRateNumerator / tokens.interestRateDenominator) *
        100
      ).toFixed(2),
      extended_rate: (
        (tokens.extendedRateNumerator / tokens.extendedRateDenominator) *
        100
      ).toFixed(2),
      early_rate: (
        (tokens.earlyRateNumerator / tokens.earlyRateDenominator) *
        100
      ).toFixed(2),
    },
    validationSchema: Yup.object({
      interest_rate: Yup.string()
        .required("required field")
        .matches(regExp, "Number must have exactly two decimal places or less"),
      extended_rate: Yup.string()
        .required("required field")
        .matches(regExp, "Number must have exactly two decimal places or less"),
      early_rate: Yup.string()
        .required("required field")
        .matches(regExp, "Number must have exactly two decimal places or less"),
    }),
    onSubmit: (values) => {
      console.log(values.interest_rate * 100);
      setDisable(true)
      updateToken(
        tokens.id,
        values.interest_rate * 100,
        10000,
        values.extended_rate * 100,
        10000,
        values.early_rate * 100,
        10000
      ).then((res) => {
        console.log(values.interest_rate * 100)
        if(res){
          setShowModal(false);
          setTokens({
            interestRateNumerator: values.interest_rate * 100,
            extendedRateNumerator: values.extended_rate * 100,
            earlyRateNumerator:  values.early_rate * 100
          })
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="modal__wrapper">
        <div className="single__modal">
          <span className="close__modal">
            <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
          </span>
          <h6 className="text-center text-light">
            Configure Token {tokens.symbol} Rate
          </h6>
          <div className="input__item mb-3">
            <h6>Interest Rate</h6>
            <input
              id="interest_rate"
              name="interest_rate"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.interest_rate}
            />
            {formik.touched.interest_rate && formik.errors.interest_rate ? (
              <div>{formik.errors.interest_rate}</div>
            ) : null}
          </div>
          
          <div className="input__item mb-3">
            <h6>Extended Rate</h6>
            <input
              id="extended_rate"
              name="extended_rate"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.extended_rate}
            />
            {formik.touched.extended_rate && formik.errors.extended_rate ? (
              <div>{formik.errors.extended_rate}</div>
            ) : null}
          </div>
          <div className="input__item mb-3">
            <h6>Liquidate Early Rate</h6>
            <input
              id="early_rate"
              name="early_rate"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.early_rate}
            />
            {formik.touched.early_rate && formik.errors.early_rate ? (
              <div>{formik.errors.early_rate}</div>
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
export default TokenCard;
