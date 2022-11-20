import React, { useState, useEffect } from "react";
import "./token-card.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changeDuration } from "../../../depositNFT";
import { setGlobalState } from "../../../store";
const { ethers } = require("ethers");

const TokenDuration = ({ setShowModal }) => {

  const [disable, setDisable] = useState(false);

  const formik = useFormik({
    initialValues: {
      duration: "",
    },
    validationSchema: Yup.object({
      duration: Yup.number()
        .integer()
        .required("required field")
        .min(0, "Duration must be at least 0")
        .max(60, "Duration must be at most 60"),
    }),
    onSubmit: (values) => {
        console.log(values.duration);
      setDisable(true);
      changeDuration(values.duration).then((res) => {
        if (res) {
          setShowModal(false);
          setGlobalState("duration", values.duration);
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
            Do you want to change duration
          </h6>
          <div className="input__item mb-3">
            <h6>Duration</h6>
            <input
              id="duration"
              name="duration"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.duration}
            />
            {formik.touched.duration && formik.errors.duration ? (
              <div>{formik.errors.duration}</div>
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
export default TokenDuration;
