import React from "react";
import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Token from "../../pages/Token/Token";
import Loan from "../../pages/Loan/Loan";
import Market from "../../pages/Market";
import LoanDetail from "../../pages/LoanDetail";

const Layout = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/token" element={<Token />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/market" element={<Market />} />
          <Route path="/detail" element={<LoanDetail />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
};

export default Layout;
