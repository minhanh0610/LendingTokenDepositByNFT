import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";


import Token from "../pages/Token/Token";
import Loan from "../pages/Loan/Loan";
import Home from "../pages/Home";
import Market from "../pages/Market";
import Request from "../pages/Request";
import LoanDetail from "../pages/LoanDetail";
const Routerss = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/token" element={<Token />} />
        <Route path="/loan" element={<Loan />} />
        <Route path="/market" element={<Market />} />
        <Route path="/detail" element={<LoanDetail />} />
      </Routes>
    );
  };
  
  export default Routerss;