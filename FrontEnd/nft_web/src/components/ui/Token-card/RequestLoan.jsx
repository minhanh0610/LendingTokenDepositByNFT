import React, { useState, useEffect } from "react";
import "./token-card.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { requestLoan } from "../../../depositNFT";
import { useQuery } from "@apollo/client";
import { getTokens } from "../../../graphql-client/queries";
import CustomSelect from "./CustomSelect";
import { getGlobalState } from "../../../store";
const { ethers } = require("ethers");

const RequestLoan = ({ setShowModal }) => {
  const regExp = /^[0-9]*(\.[0-9]{0,8})?$/;
  const addrReg = /^0x[a-fA-F0-9]{40}$/;
  const duration = getGlobalState("duration");
  const [disable, setDisable] = useState(false);

  const formik = useFormik({
    initialValues: {
      nft: "",
      tokenId: "",
      loan: "",
      token: "",
    },
    validationSchema: Yup.object({
      nft: Yup.string()
        .required("required field")
        .matches(addrReg, "Invalid address"),
      tokenId: Yup.number()
        .required("required field")
        .min(1, "TokenId must be at least 1"),
      loan: Yup.string()
        .required("required field")
        .matches(
          regExp,
          "Number must have exactly eight decimal places or less"
        ),
      token: Yup.string().required("required field"),
    }),
    onSubmit: (values) => {
      setDisable(true)
      requestLoan(
        values.nft,
        values.tokenId,
        ethers.utils.parseUnits(values.loan, 18),
        values.token,
        duration
      ).then((res) => {
        if (res) {
          setShowModal(false);
        }
      });
    },
  });

  function myFunction(token) {
    return { value: token.id, label: token.symbol, decimal: token.decimal };
  }

  const { loading, error, data } = useQuery(getTokens);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const tokens = data.tokens;
  const options = tokens.map(myFunction);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="modal__wrapper">
        <div className="single__modal2">
          <span className="close__modal">
            <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
          </span>
          <h6 className="text-center text-light">Request Loan</h6>
          <div className="input__item mb-3">
            <h6>Nft Address</h6>
            <input
              id="nft"
              name="nft"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nft}
            />
            {formik.touched.nft && formik.errors.nft ? (
              <div>{formik.errors.nft}</div>
            ) : null}
          </div>
          <div className="input__item mb-3">
            <h6>Token ID</h6>
            <input
              id="tokenId"
              name="tokenId"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tokenId}
            />
            {formik.touched.tokenId && formik.errors.tokenId ? (
              <div>{formik.errors.tokenId}</div>
            ) : null}
          </div>
          <div className="input__item mb-3">
            <h6>Amount</h6>
            <input
              id="loan"
              name="loan"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.loan}
            />
            {formik.touched.loan && formik.errors.loan ? (
              <div>{formik.errors.loan}</div>
            ) : null}
          </div>
          <div className="input__item mb-3">
            <h6>Token</h6>
            <CustomSelect
              onChange={(obj) => formik.setFieldValue("token", obj.value)}
              value={formik.values.token}
              options={options}
              onBlur={formik.handleBlur}
            />
            {formik.touched.token && formik.errors.token ? (
              <div>{formik.errors.token}</div>
            ) : null}
          </div>
          <div className="input__item mb-3">
            <h6>Duration</h6>
            <span>{duration} day{duration == 1 ? (""): "s"}</span>
          </div>
          <button disabled={disable} className="place__bid-btn" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};
export default RequestLoan;
