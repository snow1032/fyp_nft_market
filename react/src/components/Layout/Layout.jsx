import React from "react";
import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Login from "../../pages/Login";

import { useLocation, Navigate } from 'react-router-dom';
import { useStateContext } from "../Context/ContextProvider";
import axiosClient from "../../axios-client";

const Layout = () => {
  const {user, token} = useStateContext();
  const location = useLocation();

  // if(!token){
  //   return <Login />
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
