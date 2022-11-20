import React, { useState, useEffect } from "react";
import "./token-card.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addToken } from "../../../depositNFT";
const { ethers } = require("ethers");

const TokenRate = ({ setShowModal }) => {
  const regExp = /^[0-9]{0,2}(\.[0-9]{0,2})?$/;
  const addrReg = /^0x[a-fA-F0-9]{40}$/;
  const [disable, setDisable] = useState(false);

  const formik = useFormik({
    initialValues: {
      address: "",
      interest_rate: "",
      extended_rate: "",
      early_rate: "",
    },
    validationSchema: Yup.object({
      address: Yup.string()
        .required("required field")
        .matches(addrReg, "Invalid address"),
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
      setDisable(true)
        addToken(
            values.address,
            ethers.utils.parseUnits(values.interest_rate.toString(), 2),
            ethers.utils.parseUnits("100", 2),
            ethers.utils.parseUnits(values.extended_rate.toString(), 2),
            ethers.utils.parseUnits("100", 2),
            ethers.utils.parseUnits(values.early_rate.toString(), 2),
            ethers.utils.parseUnits("100", 2),
            //values.interest_rate * 100,
            // 10000,
            // values.extended_rate * 100,
            // 10000,
            // values.early_rate * 100,
            // 10000
          ).then((res) => {
            console.log(2);
            if(res){
              setShowModal(false);
              alert("success");
            }
          });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="modal__wrapper">
        <div className="single__modal3">
          <span className="close__modal">
            <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
          </span>
          <h6 className="text-center text-light">Add Token</h6>
          <div className="input__item mb-3">
            <h6>Address</h6>
            <input
              id="address"
              name="address"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address ? (
              <div>{formik.errors.address}</div>
            ) : null}
          </div>
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
export default TokenRate;
