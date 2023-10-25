import React from "react";

import { Routes, Route, Navigate, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Market from "../pages/Market";
import Create from "../pages/Create";
import Contact from "../pages/Contact";

import Wallet from "../pages/Wallet";
import NftDetails from "../pages/NftDetails";

import Login from "../pages/Login";
import LoginForm from "../components/ui/Login/LoginForm";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/loginForm" element={<LoginForm />} /> */}
      <Route path="/home" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/create" element={<Create />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/market/:id" element={<NftDetails />} />
    </Routes>
  );
};


export default Routers;
