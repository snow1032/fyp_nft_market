import React from "react";
import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Login from "../../pages/Login";
import Home from "../../pages/Home";

import { useLocation, Navigate } from 'react-router-dom';
import { useStateContext } from "../Context/ContextProvider";
import axiosClient from "../../axios-client";

const Layout = () => {
  const {user, token} = useStateContext();
  const location = useLocation();

  // if(!token){
  //   return <Home />
  // }

  return (
    <div>
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
